import Database from './Database'
import Api from './Routes'
import express from 'express'
import _ from 'lodash'

// 初始化数据库
Database.init()

// 初始化 API
const app = express()
app.use(Api)

export default {
  path: '/api',
  handler: app
}
