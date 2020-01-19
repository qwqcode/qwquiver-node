import path from 'path'
import fs from 'fs'
import consola from 'consola'
import F, { ScoreData } from './Field'
import Utils from './Utils'
import Table, { CONF_FIELD, TB_CONF } from './Table'
import _ from 'lodash'
import DataStore from 'nedb'

/** 数据根目录 */
export const DATA_PATH = path.join(__dirname, '../storage/data')

/** 数据表索引对象  */
export type TB_INDEX = { [tbName: string]: TB_CONF }

/** 数据表索引文件完整路径 */
export const TB_INDEX_FILENAME = path.join(DATA_PATH, './_index.json')

/** 数据库 */
class Database {
  private tableList: Table[] = []

  /** 初始化数据库 */
  public init () {
    this.loadTables()
  }

  /** 获取数据表 */
  public getTable (name: string) {
    return this.tableList.find(o => o.name === name)
  }

  /** 装载数据表 */
  private loadTables () {
    if (!fs.existsSync(DATA_PATH)) { // 若数据根目录不存在，则创建一个
      fs.mkdirSync(DATA_PATH, { recursive: true })
    }

    // 获取数据表索引对象，装载数据表前根据数据文件来更新一次
    const tbIndex = TbIndexFile.update()

    _.forEach(tbIndex, (tableConf, tableName) => {
      const dataFilename = path.join(DATA_PATH, `${tableName}.tb`)
      if (!fs.existsSync(dataFilename)) {
        consola.warn(`数据表 "${tableName}" 的数据文件丢失，找不到文件："${dataFilename}"`)
        return
      }

      try {
        this.tableList.push(new Table(tableName, tableConf))
      } catch (e) {
        consola.warn(`数据表 "${tableName}" 实例化时发生错误：${e}`)
      }
    })
  }

  /** 获取数据表索引 */
  public getTbIndex (): TB_INDEX {
    const tbIndex: TB_INDEX = {}
    _.forEach(this.tableList, (table) => {
      tbIndex[table.name] = table.getConf()
    })
    return tbIndex
  }
}

const _D = new Database()
export default _D

/** 数据表索引文件 */
export class TbIndexFile {
  /** 从索引文件中 获取数据表索引 */
  static get (): TB_INDEX {
    let indexFileStr: string
    if (!fs.existsSync(TB_INDEX_FILENAME) || !(indexFileStr = fs.readFileSync(TB_INDEX_FILENAME, 'utf-8'))) {
      // 若文件不存在 或 读取的文件数据为空
      return {}
    }

    let tbIndex: any
    try {
      // 尝试解析 JSON
      tbIndex = JSON.parse(indexFileStr)
    } catch (err) {
      consola.error(`无法读取数据索引，解析 JSON 发生错误：${err} - "${TB_INDEX_FILENAME}"`)
      process.exit(1)
    }

    if (!_.isObject(tbIndex)) return {}

    return (tbIndex as any) || {}
  }

  /** 根据数据文件，更新数据表索引文件 */
  static update (rangeTables?: Table[]): TB_INDEX {
    const tbIndex = this.get() // 原有的数据表索引

    // 读取所有数据文件
    fs.readdirSync(DATA_PATH).filter(o => /\.tb$/.test(o)).forEach((fileName) => {
      const tbName = fileName.replace(/\.tb$/i,'')
      if (!rangeTables && _.has(tbIndex, tbName)) return // 若未指定范围，则已存在的CONF不改动

      const conf = {
        Label: tbName,
        FullScore: {},
        Date: '',
        Grp: '其他',
        Note: ''
      } as Table // 为了方便，欺骗一下 ts 的 type
      // 仅变动索引中不存在的数据表

      if (rangeTables) {
        const table = rangeTables.find(o => o.name === tbName)
        if (!table) return

        // 生成 fullScore
        // @ts-ignore
        conf.FullScore = table.tryGetFullScoreByData()
      }

      tbIndex[tbName] = conf
    })

    // 将修改后的数据表索引对象写入文件
    fs.writeFileSync(TB_INDEX_FILENAME, JSON.stringify(tbIndex, null, '  '), 'utf8')

    return tbIndex
  }

}
