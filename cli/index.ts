import path from 'path'
import fs from 'fs'
import _ from 'lodash'
import { ArgumentParser } from 'argparse'
import { transDict as FT } from '../common/interfaces/field/FieldTrans'
import ExcelImporter from './actions/ExcelImporter'

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
  description: '表头需设定字段名: ' + _.trimEnd(Object.keys(FT).join(', '), ', ')
})
importBar.addArgument('fileName', {
  action: 'store',
  type: 'string',
  help: '文件路径'
})

const args = parser.parseArgs()
console.dir(args)

if (args.action === 'import' && !!args.fileName) {
  ExcelImporter(args)
}
