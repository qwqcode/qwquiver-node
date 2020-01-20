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
export type EXAM_INDEX = { [examName: string]: EXAM_CONF }

/** 考试索引文件完整路径 */
export const EXAM_INDEX_FILENAME = path.join(DATA_PATH, './_index.json')

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
    const examIndex = ExamIndexFile.update()

    _.forEach(examIndex, (examConf, examName) => {
      const dataFilename = path.join(DATA_PATH, `${examName}.tb`)
      if (!fs.existsSync(dataFilename)) {
        consola.warn(`"${examName}" 的数据文件丢失，找不到文件："${dataFilename}"`)
        return
      }

      try {
        this.ExamList.push(new Exam(examName, examConf))
      } catch (e) {
        consola.warn(`"${examName}" 实例化时发生错误：${e}`)
      }
    })
  }


  /** 获取考试配置列表 */
  public getExamIndex (): EXAM_INDEX {
    const examIndex: EXAM_INDEX = {}
    _.forEach(this.ExamList, (exam) => {
      examIndex[exam.Name] = exam.getConf()
    })
    return examIndex
  }
}

const _D = new Database()
export default _D

/** 考试索引文件 */
export class ExamIndexFile {
  /** 获取考试索引 */
  static get (): EXAM_INDEX {
    let indexFileStr: string
    if (!fs.existsSync(EXAM_INDEX_FILENAME) || !(indexFileStr = fs.readFileSync(EXAM_INDEX_FILENAME, 'utf-8'))) {
      // 若文件不存在 或 读取的文件数据为空
      return {}
    }

    let examIndex: any
    try {
      // 尝试解析 JSON
      examIndex = JSON.parse(indexFileStr)
    } catch (err) {
      consola.error(`无法读取数据索引，解析 JSON 发生错误：${err} - "${EXAM_INDEX_FILENAME}"`)
      process.exit(1)
    }

    if (!_.isObject(examIndex)) return {}

    return (examIndex as any) || {}
  }

  /** 根据数据文件，更新考试索引文件 */
  static update (rangeExams?: Exam[]): EXAM_INDEX {
    const examIndex = this.get() // 原有的索引

    // 读取所有数据文件
    fs.readdirSync(DATA_PATH).filter(o => /\.tb$/.test(o)).forEach((fileName) => {
      const examName = fileName.replace(/\.tb$/i,'')
      if (!rangeExams && _.has(examIndex, examName)) return // 若未指定范围，则更新索引中不存在的考试配置

      const conf: EXAM_CONF = {
        Label: examName,
        FullScore: {},
        Date: '',
        Grp: '其他',
        Note: ''
      }

      if (rangeExams) { // 若指定了范围，则仅改动范围中的考试配置
        const exam = rangeExams.find(o => o.Name === examName)
        if (!exam) return

        // 生成 fullScore
        conf.FullScore = exam.tryGetFullScoreByData()
      }

      examIndex[examName] = conf
    })

    // 将修改后的考试索引对象写入文件
    fs.writeFileSync(EXAM_INDEX_FILENAME, JSON.stringify(examIndex, null, '  '), 'utf8')

    return examIndex
  }

}
