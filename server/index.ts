import Database from './database'
import Api from './Routes'
import ErrorHandler from './middleware/ErrorHandler'
import express from 'express'
import _ from 'lodash'

// 初始化数据库
Database.init()

// 初始化 API
const app = express()
app.use(Api)

// Error handler
app.use(ErrorHandler)

export default {
  path: '/api',
  handler: app
}
