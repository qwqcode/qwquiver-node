import F, { ScoreData } from '../common/interfaces/field'
import DataStore from 'nedb'

export const CONF_FIELD: string[] = [] // must before the code where @AsConf is called

export default class Table {
  public data!: DataStore<ScoreData>

  @AsConf
  public label?: string

  @AsConf
  public fullScore: { [f in F]?: number } = {}
}

function AsConf (target: any, propertyName: string) {
  CONF_FIELD.push(propertyName)
}
