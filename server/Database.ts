import path from 'path'
import fs from 'fs'
import consola from 'consola'
import F, { ScoreData } from './Field'
import Utils from './Utils'
import Exam, { EXAM_CONF } from './Exam'
import _ from 'lodash'
import DataStore from 'nedb'

/** 数据根目录 */
export const DATA_PATH = path.join(__dirname, '../storage/data')

/** 考试索引对象  */
export type EXAM_MAP = EXAM_CONF[]

/** 考试索引文件完整路径 */
export const EXAM_MAP_FILENAME = path.join(DATA_PATH, './_map.json')

/**
 * 考试数据库
 */
class Database {
  /** 考试列表 */
  private ExamList: Exam[] = []

  /** 初始化数据库 */
  public init () {
    this.loadExams()
  }

  /** 获取考试 */
  public getExam (name: string) {
    return this.ExamList.find(o => o.Name === name)
  }

  /** 获取考试列表 */
  public getExamList () {
    return this.ExamList
  }

  /** 装载考试 */
  private loadExams () {
    if (!fs.existsSync(DATA_PATH)) { // 若数据根目录不存在，则创建一个
      fs.mkdirSync(DATA_PATH, { recursive: true })
    }

    // 根据数据文件来更新一次 考试索引
    const examMap = ExamMapFile.update()

    _.forEach(examMap, (conf) => {
      if (!conf.Name) {
        consola.warn(`配置中 Name 不能为空`)
        return
      }

      const dataFilename = path.join(DATA_PATH, `${conf.Name}.tb`)
      if (!fs.existsSync(dataFilename)) {
        consola.warn(`"${conf.Name}" 的数据文件丢失，找不到文件："${dataFilename}"`)
        return
      }

      try {
        this.ExamList.push(new Exam(conf))
      } catch (e) {
        consola.warn(`"${conf.Name}" 实例化时发生错误：${e}`)
      }
    })
  }


  /** 获取考试配置列表 */
  public getExamMap (): EXAM_MAP {
    let examMap: EXAM_MAP = []
    _.forEach(this.ExamList, (exam) => {
      examMap.push(exam.getConf())
    })
    examMap =  _.sortBy(examMap, e => e.Date ? -(new Date(e.Date).getTime()) : -1) // 根据日期排序

    return examMap
  }
}

const _D = new Database()
export default _D

/** 考试索引文件 */
export class ExamMapFile {
  /** 获取考试索引 */
  static get (): EXAM_MAP {
    let mapFileStr: string
    if (!fs.existsSync(EXAM_MAP_FILENAME) || !(mapFileStr = fs.readFileSync(EXAM_MAP_FILENAME, 'utf-8'))) {
      // 若文件不存在 或 读取的文件数据为空
      return []
    }

    let examMap: any
    try {
      // 尝试解析 JSON
      examMap = JSON.parse(mapFileStr)
    } catch (err) {
      consola.error(`无法读取数据索引，解析 JSON 发生错误：${err} - "${EXAM_MAP_FILENAME}"`)
      process.exit(1)
    }

    if (!_.isArray(examMap)) return []

    return (examMap as any) || []
  }

  /** 根据数据文件，更新考试索引文件 */
  static update (rangeExams?: Exam[]): EXAM_MAP {
    const examMap = this.get() // 原有的索引

    // 读取所有数据文件
    fs.readdirSync(DATA_PATH).filter(o => /\.tb$/.test(o)).forEach((fileName) => {
      const examName = fileName.replace(/\.tb$/i,'')
      if (!rangeExams && _.find(examMap, e => e.Name === examName)) return // 若未指定范围，则仅更新索引中不存在的考试配置

      const conf: EXAM_CONF = {
        Name: examName,
        Label: examName,
        FullScore: {},
        Date: '',
        Grp: '其它',
        Note: ''
      }

      if (rangeExams) { // 若指定了范围，则仅改动范围中的考试配置
        const exam = rangeExams.find(o => o.Name === examName)
        if (!exam) return

        // 生成 fullScore
        conf.FullScore = exam.tryGetFullScoreByData()
      }

      examMap.unshift(conf)
    })

    // 将修改后的考试索引对象写入文件
    fs.writeFileSync(EXAM_MAP_FILENAME, JSON.stringify(examMap, null, '  '), 'utf8')

    return examMap
  }

}
