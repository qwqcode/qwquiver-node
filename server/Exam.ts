import path from 'path'
import consola from 'consola'
import DataStore from 'nedb'
import _ from 'lodash'
import F, { ScoreData } from './Field'
import { F_SUBJ, F_ALL, F_TARGET_RANK } from './Field/Grp'
import { DATA_PATH } from './Database'

/** 数据表配置 */
export interface EXAM_CONF {
  /** 名称 */
  Name: string

  /** 标签 */
  Label?: string

  /** 每科最大分值 */
  FullScore?: { [subject in F]?: number }

  /** 考试日期 */
  Date?: string

  /** 所属分类 */
  Grp?: string

  /** 备注 */
  Note?: string
}

/**
 * 成绩 数据表
 */
export default class Exam {
  public get Name () {
    return this.Conf.Name
  }

  /** 数据 */
  public Data: DataStore<ScoreData>

  /** 数据是否已装载 */
  public isDataLoaded = false

  public readonly Conf: EXAM_CONF

  constructor (conf: EXAM_CONF) {
    this.Conf = conf

    const dataFilename = path.join(DATA_PATH, `${conf.Name}.qexam`)
    this.Data = new DataStore({ filename: dataFilename })

    // 装载数据
    this.Data.loadDatabase((err) => {
      if (!err) {
        this.isDataLoaded = true
      } else {
        consola.error(`Exam "${conf.Name}" 数据装载发生错误`, err)
      }
    })
  }

  /** 数据字段缓存 */
  private _dataFieldList: F[]|null = null

  /** 数据字段列表 */
  public get DataFieldList () {
    if (this._dataFieldList !== null) return this._dataFieldList

    const fieldList: F[] = this._dataFieldList = []
    _.forEach(this.Data.getAllData(), (rawItem) => {
      F_ALL.forEach((f) => {
        if (rawItem[f] === undefined) return // 若字段不存在
        if (fieldList.includes(f)) return // 若不是数据中新出现的字段
        fieldList.push(f) // 记录新字段
        // 加入排名字段
        if (F_TARGET_RANK.includes(f)) {
          const rfs = ['_RANK', '_SCHOOL_RANK', '_CLASS_RANK']
          _.forEach(rfs, (rf) => {
            const fXrf = (f + rf) as F
            if (!fieldList.includes(fXrf)) fieldList.push(fXrf)
          })
        }
      })
    })

    return fieldList
  }

  /** 获取数据表配置 */
  public getConf (): EXAM_CONF {
    return this.Conf
  }

  /** 通过数据尝试得到每科最大分值 */
  public tryGetFullScoreByData () {
    const fullScore: { [subject in F]?: number } = {}
    function RecordOnce (subj: F, score: number) {
      let predScore: number = 1
      if (score > 110) {
        predScore = 150
      } else if (score > 100) {
        predScore = 110
      } else if (score > 90) {
        predScore = 100
      } else if (score > 80) {
        predScore = 90
      } else if (score > 50) {
        predScore = 60
      } else if (score > 40) {
        predScore = 50
      }

      if (predScore > (fullScore[subj] || 0))
        fullScore[subj] = predScore
    }

    _.forEach(this.Data.getAllData(), (rawItem) => {
      F_SUBJ.forEach((f) => {
        if (rawItem[f] === undefined) return
        if (isNaN(Number(rawItem[f]))) return
        RecordOnce(f, rawItem[f])
      })
    })
    return fullScore
  }
}
