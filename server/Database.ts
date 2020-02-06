import path from 'path'
import fs from 'fs'
import consola from 'consola'
import chokidar from 'chokidar'
import F, { ScoreData } from './Field'
import Utils from './Utils'
import Exam, { EXAM_CONF } from './Exam'
import _ from 'lodash'
import DataStore from 'nedb'

/** 数据根目录 */
export const DATA_PATH = path.resolve(__dirname, '../storage/data')

/** 考试索引对象  */
export type EXAM_MAP = EXAM_CONF[]

/** 考试索引文件完整路径 */
export const EXAM_MAP_FILE = path.join(DATA_PATH, './_map.json')

/** 数据热更新标识文件 */
export const DATA_UPDATED_SIGN_FILE = path.join(DATA_PATH, './.DATA_UPDATED')

/**
 * 考试数据库
 */
class Database {
  /** 考试列表 */
  private ExamList: Exam[] = []

  /** 初始化数据库 */
  public init () {
    this.loadExams()
    this.initDataUpdateWatcher()
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
    consola.info(`开始初始化 Exams`)
    this.ExamList = []

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

      const dataFilename = path.join(DATA_PATH, `${conf.Name}.qexam`)
      if (!fs.existsSync(dataFilename)) {
        consola.warn(`"${conf.Name}" 的数据文件丢失，找不到文件："${dataFilename}"`)
        return
      }

      try {
        this.ExamList.push(new Exam(conf))
      } catch (e) {
        consola.warn(`Exam "${conf.Name}" 实例化时发生错误：${e}`)
      }
    })

    consola.success(`初始化 Exams 完毕`)

    DataUpdatedSignFile.remove()
  }

  /** 数据变化监听器（for 导入数据的热更新） */
  private initDataUpdateWatcher () {
    // 监听 SIGN 文件，触发 loadExams
    chokidar.watch(DATA_UPDATED_SIGN_FILE, {
      interval: 3000,
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100
      },
      ignorePermissionErrors: true,
      ignoreInitial: true,
    }).on('add', (event, path) => {
      consola.info(`考试数据发生变化，准备执行数据重载`)
      this.loadExams()
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
    if (!fs.existsSync(EXAM_MAP_FILE) || !(mapFileStr = fs.readFileSync(EXAM_MAP_FILE, 'utf-8'))) {
      // 若文件不存在 或 读取的文件数据为空
      return []
    }

    let examMap: any
    try {
      // 尝试解析 JSON
      examMap = JSON.parse(mapFileStr)
    } catch (err) {
      consola.error(`无法读取数据索引，解析 JSON 发生错误 - "${EXAM_MAP_FILE}"`, err)
      process.exit(1)
    }

    if (!_.isArray(examMap)) return []

    return (examMap as any) || []
  }

  /** 根据数据文件，更新考试索引文件 */
  static update (rangeExams?: Exam[]): EXAM_MAP {
    let examMap = this.get() // 原有的索引

    // 删除指定范围 Exam 的旧 Conf，准备用新 Conf 覆盖
    if (rangeExams)
      examMap = examMap.filter(e => (rangeExams.find(re => re.Name === e.Name) === undefined))

    // 读取所有数据文件
    fs.readdirSync(DATA_PATH).filter(o => /\.qexam$/.test(o)).forEach((fileName) => {
      const examName = fileName.replace(/\.qexam$/i,'')

      if (examMap.find(e => e.Name === examName))
        return // 若 Conf 已存在，直接跳过

      // 构建新的 Conf
      let conf: EXAM_CONF = {
        Name: examName,
        Label: examName,
        FullScore: {},
        Date: '',
        Grp: '其它',
        Note: ''
      }

      if (rangeExams) { // 若指定范围
        const rangeExam = rangeExams.find(o => o.Name === examName)
        if (rangeExam) {
          conf = { ...conf, ...(rangeExam.Conf || {}) }
          conf.FullScore = rangeExam.tryGetFullScoreByData() // 生成 fullScore
        }
      }

      examMap.unshift(conf)
    })

    // 将修改后的考试索引对象写入文件
    fs.writeFileSync(EXAM_MAP_FILE, JSON.stringify(examMap, null, '  '), 'utf8')

    return examMap
  }
}

/** 数据更新信号文件 */
export class DataUpdatedSignFile {
  static create () {
    fs.writeFileSync(DATA_UPDATED_SIGN_FILE, '', { flag:'w' })
  }

  static remove () {
    if (fs.existsSync(DATA_UPDATED_SIGN_FILE))
      fs.unlinkSync(DATA_UPDATED_SIGN_FILE)
  }
}
