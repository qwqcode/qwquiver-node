import path from 'path'
import fs from 'fs'
import F, { ScoreData } from '../common/interfaces/field'
import Utils from './Utils'
import Table, { CONF_FIELD } from './Table'
import _ from 'lodash'
import DataStore from 'nedb'

export const DATA_PATH = path.join(__dirname, '../storage/data')
export const DATA_CONFIG_PATH = path.join(DATA_PATH, './_config.json')

class Database {
  tableList: { [name: string]: Table } = {}

  init () {
    if (!fs.existsSync(DATA_PATH)) {
      fs.mkdirSync(DATA_PATH, { recursive: true })
    }

    this.loadTableList()
  }

  getTable (name: string) {
    return (typeof this.tableList[name] !== 'undefined') ? this.tableList[name] : undefined
  }

  loadTableList () {
    fs.readdirSync(DATA_PATH).filter(o => /\.db$/.test(o)).forEach(fileName => {
      const name = fileName.replace(/(\.\/|\.db)/g,'')
      const table = new Table()
      table.data = new DataStore({ filename: path.join(DATA_PATH, fileName), autoload: true })
      this.tableList[name] = table
    })

    this.loadConfigFile()
  }

  loadConfigFile () {
    if (fs.existsSync(DATA_CONFIG_PATH)) {
      const fileContent = fs.readFileSync(DATA_CONFIG_PATH, 'utf-8')
      let confObj = {}
      if (fileContent) {
        try {
          confObj = JSON.parse(fileContent)
        } catch {
          console.error(`JSON 文件语法错误 - "${DATA_CONFIG_PATH}"`)
          process.abort()
        }
      }
      _.forEach(confObj, (table: Table, name) => {
        if (!_.has(this.tableList, name)) return
        _.forEach(table, (val, key) => {
          if (typeof val !== 'undefined' && val !== null && CONF_FIELD.includes(key))
            this.tableList[name][key] = val
        })
      })
    } else {
      // Config 文件不存在
      this.makeNewConfigFile()
    }
  }

  makeNewConfigFile () {
    _.forEach(this.tableList, (table, name) => {
      table.label = name
    })

    fs.writeFileSync(DATA_CONFIG_PATH, JSON.stringify(Utils.getAllTableConfObj(), null, '  '), 'utf8')
  }
}

const _D = new Database()

export default _D
