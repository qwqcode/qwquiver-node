import path from 'path'
import fs from 'fs'
import _ from 'lodash'
import * as XLSX from 'xlsx'
import { ArgumentParser } from 'argparse'
import DataStore from 'nedb'
import Database, { DB_SCORES_PATH } from '../server/database'
import { FieldNames, FieldLabels } from '../server/database/fields'

const parser = new ArgumentParser({
  description: `QWQUIVER v${process.env.npm_package_version} Command Line Interface`,
  version: `v${process.env.npm_package_version}`,
  addHelp: true
})

const subparsers = parser.addSubparsers({
  title: 'Actions',
  dest: 'action'
})

const toolBar = subparsers.addParser('tool', { help: '工具', addHelp: true })
toolBar.addArgument('toolName', {
  action: 'store',
  type: 'string',
  help: '工具名'
})

const configBar = subparsers.addParser('config', {
  help: '配置',
  addHelp: true
})

const importBar = subparsers.addParser('import', {
  help: '导入',
  addHelp: true,
  description: '表头需设定字段名: ' + _.trimEnd(Object.keys(FieldLabels).join(', '), ', ')
})
importBar.addArgument('fileName', {
  action: 'store',
  type: 'string',
  help: '文件路径'
})

const args = parser.parseArgs()
console.dir(args)

if (args.action === 'import' && !!args.fileName) {
  const dbFilename = path.join(DB_SCORES_PATH, path.basename(args.fileName).replace(path.extname(args.fileName), '') + '.db')
  if (fs.existsSync(dbFilename)) {
    console.error(`[ERROR] Excel data has imported before. \nif you want to import again, please delete it first.\n"${dbFilename}"`)
    process.exit(0)
  }

  const db = new DataStore({
    filename: dbFilename,
    autoload: true
  })

  const theadRowIndex = 0
  const wb: XLSX.WorkBook = XLSX.readFile(args.fileName)
  const data: any[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 })
  const filedPos: { [key: string]: number } = {}

  // 读取表头
  data[theadRowIndex].forEach((colVal: string, pos: number) => {
    Object.keys(FieldNames).forEach(name => {
      if (colVal === name) {
        filedPos[name] = pos
      }
    })
  })

  // 读取数据
  data.forEach((rowValues, rowIndex) => {
    if (rowIndex === 0) return
    const dataItem: { [key: string]: string } = {}
    _.forEach(filedPos, (pos: number, filedName: string) => {
      dataItem[filedName] = rowValues[pos]
    })
    db.insert(dataItem)
  })
}
