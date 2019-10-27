import express, { Router, Request, Response } from 'express'
import _ from 'lodash'
import Database from './database'
import F, { ScoreData } from './interfaces/field'
import { transDict as FT } from './interfaces/field/FieldTrans'

// Create express instance
const app = express()

const router: Router = Router()

Database.init()

function sendSuccess (res: Response, msg?: string, data?: Object) {
  return res.send({ success: true, msg, data })
}

function sendError (res: Response, msg?: string, data?: Object) {
  return res.send({ success: false, msg, data })
}

function getPaginatedItems (items: any[], page: number, pageSize: number) {
  const pg = page || 1
  const pgSize = pageSize || 100
  const offset = (pg - 1) * pgSize
  const pagedItems = _.drop(items, offset).slice(0, pgSize)

  return {
    page: pg,
    pageSize: pgSize,
    total: items.length,
    lastPage: Math.ceil(items.length / pgSize),
    scoreList: pagedItems
  }
}

router.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!')
})

router.get('/conf', (req: Request, res: Response) => {
  const scoreDbInfoList = Database.getScoreDbInfoList()
  const fieldTransDict = FT

  sendSuccess(res, '', {
    scoreDbInfoList,
    fieldTransDict
  })
})

router.get('/query', (req: Request, res: Response) => {
  const {
    db: dbName,
    data: queryData,
    where: whereJsonStr,
    page: pageStr,
    pagePer: pagePerStr,
    sort: sortJsonStr
  } = req.query

  if (!dbName) {
    sendError(res, `未选择数据`)
    return
  }

  const db = Database.getScoreDb(dbName)
  if (!db) {
    sendError(res, `未找到数据 ${dbName || ''}`)
    return
  }

  let conditionList: { [key: string]: string } = {}
  let sortList: { [key: string]: 1|-1 } = {}

  try {
      if (whereJsonStr) conditionList = JSON.parse(whereJsonStr)
      if (sortJsonStr) sortList = JSON.parse(sortJsonStr)
  } catch {
    sendError(res, `参数 JSON 解析错误`)
    return
  }

  if (queryData)
    conditionList[F.NAME] = queryData

  const pagePer: number = !!pagePerStr && !isNaN(pagePerStr) ? Number(pagePerStr) : 50
  const page: number = !!pageStr && !isNaN(pageStr) ? Number(pageStr) : 1

  db.find(conditionList).sort(sortList).exec((err: Error, rawData) => {
    const scoreDbData: ScoreData[] = []
    rawData.forEach((rawItem) => {
      const item: any = {}
      Object.values(F).forEach((fieldName) => {
        if (rawItem[fieldName] !== undefined) item[fieldName] = rawItem[fieldName]
      })
      scoreDbData.push(item)
    })

    if (err) {
      sendError(res, `数据获取错误 ${err.message}`)
    }
    sendSuccess(res, '数据获取成功', { ...getPaginatedItems(scoreDbData, page, pagePer) })
  })
})

const Api: Router = router

app.use(Api)

// Export the server middleware
export default {
  path: '/api',
  handler: app
}
