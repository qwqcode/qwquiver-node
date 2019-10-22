import _ from 'lodash'
import { Router, Request, Response } from 'express'
import Database from './database'
import { FieldNames, ScoreDataItem } from './database/fields'

const router: Router = Router()

function sendSuccess (res: Response, msg?: string, data?: Object) {
  return res.send({ success: true, msg, data })
}

function sendError (res: Response, msg?: string, data?: Object) {
  return res.send({ success: false, msg, data })
}

router.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!')
})

router.get('/query', (req: Request, res: Response) => {
  const {
    db: dbName,
    type,
    data: queryData,
    where: whereJsonStr,
    page,
    pagePer,
    sortBy,
    sortType,
  } = req.query

  if (!dbName) {
    sendError(res, `未选择数据`)
    return
  }

  const dbList = Database.getScoreDbList()
  if (typeof dbList[dbName] === 'undefined') {
    sendError(res, `未找到数据 ${dbName || ''}`)
    return
  }
  const db = dbList[dbName]

  let conditionList: { [key: string]: string } = {}
  if (whereJsonStr) {
    try {
      conditionList = JSON.parse(whereJsonStr)
    } catch {
      sendError(res, `where 参数 JSON 解析错误`)
      return
    }
  }
  if (queryData)
    conditionList[FieldNames.NAME] = queryData

  db.find(conditionList, (err: Error, rawData: any[]) => {
    const scoreDbData: ScoreDataItem[] = []
    rawData.forEach((rawItem) => {
      const item: any = {}
      Object.values(FieldNames).forEach((fieldName) => {
        if (rawItem[fieldName] !== undefined) item[fieldName] = rawItem[fieldName]
      })
      scoreDbData.push(item)
    })

    if (err) {
      sendError(res, `数据获取错误 ${err.message}`)
    }
    sendSuccess(res, '数据获取成功', { scoreDbData })
  })
})

const Api: Router = router
export default Api
