import path from 'path'
import fs from 'fs'
import Console from 'console'
import { transDict as FT } from '../server/Field/Trans'
import ExcelImporter from './tools/ExcelImporter'
import _ from 'lodash'
import { ArgumentParser } from 'argparse'

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
  description: `表头可选字段名: ${_.map(FT, (ft, f) => `${f} (${ft})`).join(', ')}`
})
importBar.addArgument('fileName', {
  action: 'store',
  type: 'string',
  help: '文件路径'
})

const args = parser.parseArgs()

if (args.action === 'import' && !!args.fileName) {
  ExcelImporter(args.fileName)
}
