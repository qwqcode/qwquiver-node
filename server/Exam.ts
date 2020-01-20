import path from 'path'
import consola from 'consola'
import F, { ScoreData } from './Field'
import { F_SUBJ, F_ALL } from './Field/Grp'
import { DATA_PATH } from './Database'
import DataStore from 'nedb'
import _ from 'lodash'

/** 数据表配置 */
export interface EXAM_CONF {
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
  public Name: string

  /** 数据 */
  public Data: DataStore<ScoreData>

  public readonly Conf: EXAM_CONF

  constructor (name: string, conf: EXAM_CONF = {}) {
    const dataFilename = path.join(DATA_PATH, `${name}.tb`)

    this.Name = name
    this.Conf = conf
    this.Data = new DataStore({ filename: dataFilename, autoload: true })
  }

  private _dataFieldList: F[]|null = null

  /** 数据字段列表 */
  public get DataFieldList () {
    if (this._dataFieldList !== null) return this._dataFieldList

    const fieldList: F[] = this._dataFieldList = []
    _.forEach(this.Data.getAllData(), (rawItem) => {
      F_ALL.forEach((f) => {
        if (rawItem[f] === undefined) return // 若字段不存在
        if (!fieldList.includes(f)) // 若是数据中新出现的字段
          fieldList.push(f) // 记录新字段
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
