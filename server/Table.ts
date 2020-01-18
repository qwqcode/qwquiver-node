import F, { ScoreData } from './Field'
import DataStore from 'nedb'

/** 可配置的字段名列表 */
export const CONF_FIELD: string[] = [] // must before the code where @AsConf is called
function AsConf (target: any, propertyName: string) { CONF_FIELD.push(propertyName) }

/**
 * 一次成绩的数据表
 */
export default class Table {
  /** 数据 */
  public data!: DataStore<ScoreData>

  /** 标签 */
  @AsConf
  public label?: string

  /** 最大分值 */
  @AsConf
  public fullScore: { [f in F]?: number } = {}

  /** 所属分类 */
  @AsConf
  public grp?: string
}
