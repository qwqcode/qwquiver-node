import path from 'path'
import fs from 'fs'
import consola from 'consola'
import { transDict as FT } from '../server/Field/Trans'
import ExcelImporter from './tools/ExcelImporter'
import _ from 'lodash'
import { ArgumentParser } from 'argparse'

const parser = new ArgumentParser({
  description: `QWQUIVER v${process.env.npm_package_version} Command Line Interface`,
  version: `QWQUIVER v${process.env.npm_package_version}`,
  addHelp: true
})

/** 操作 */
const subparsers = parser.addSubparsers({
  title: 'Actions',
  dest: 'action'
})

/** 工具 */
const toolBar = subparsers.addParser('tool', { help: '工具', addHelp: true })
toolBar.addArgument('toolName', {
  action: 'store',
  type: 'string',
  help: '工具名'
})

/** 配置 */
const configBar = subparsers.addParser('config', {
  help: '配置',
  addHelp: true
})

/** 导入 */
const importBar = subparsers.addParser('import', {
  help: '导入',
  addHelp: true,
  description: `表格文件表头可选字段名: ${_.map(FT, (ft, f) => `${f} (${ft})`).join(', ')}`
})
importBar.addArgument('fileName', {
  action: 'store',
  type: 'string',
  help: '表格文件的完整路径'
})
importBar.addArgument('--force', { action: 'storeTrue', help: '强制执行 (忽略所有警告)' })
const storeStr = { action: 'store', type: 'string' }
importBar.addArgument(['-n', '--name'], { dest: 'Name', help: '考试名称 (唯一值)', ...storeStr })
importBar.addArgument(['-l', '--label'], { dest: 'Label', help: '考试显示名称', ...storeStr })
importBar.addArgument(['-d', '--date'], { dest: 'Date', help: '考试日期', ...storeStr })
importBar.addArgument(['-g', '--grp'], { dest: 'Grp', help: '考试所属分类', ...storeStr })
importBar.addArgument(['--note'], { dest: 'Note', help: '考试备注', ...storeStr })

const args = parser.parseArgs()
if (args.action === 'import' && !!args.fileName) {
  const examConf = {};
  ['Name', 'Label', 'Date', 'Grp', 'Note'].forEach((key) => {
    if (args[key]) examConf[key] = args[key]
  })
  ExcelImporter(args.fileName, examConf, args.force)
}
