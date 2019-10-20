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

const args = parser.parseArgs()
console.dir(args)
