import express, { Router, Request, Response } from 'express'
import F, { ScoreData } from '../common/interfaces/field'
import { transDict as FT } from '../common/interfaces/field/FieldTrans'
import QueryApiData from '../common/interfaces/QueryApiData'
import Utils from './Utils'
import Database from './database'

export default class Actions {
  public index (req: Request, res: Response) {
    res.send('Hello, World!')
  }

  public conf (req: Request, res: Response) {
    const scoreDbInfoList = Database.getScoreDbInfoList()
    const fieldTransDict = FT

    Utils.success(res, '', {
      scoreDbInfoList,
      fieldTransDict
    })
  }

  public query (req: Request, res: Response) {
    const {
      db: dbName,
      data: queryData,
      where: whereJsonStr,
      page: pageStr,
      pagePer: pagePerStr,
      sort: sortJsonStr
    } = req.query

    if (!dbName) {
      Utils.error(res, `未选择数据`)
      return
    }

    const db = Database.getScoreDb(dbName)
    if (!db) {
      Utils.error(res, `未找到数据 ${dbName || ''}`)
      return
    }

    let conditionList: { [key: string]: string } = {}
    let sortList: { [key: string]: 1|-1 } = {}

    try {
        if (whereJsonStr) conditionList = JSON.parse(whereJsonStr)
        if (sortJsonStr) sortList = JSON.parse(sortJsonStr)
    } catch {
      Utils.error(res, `参数 JSON 解析错误`)
      return
    }

    if (queryData)
      conditionList[F.NAME] = queryData

    const pagePer: number = !!pagePerStr && !isNaN(pagePerStr) ? Number(pagePerStr) : 50
    const page: number = !!pageStr && !isNaN(pageStr) ? Number(pageStr) : 1

    db.find(conditionList).sort(sortList).exec((err: Error, rawData) => {
      const scoreDbData: ScoreData[] = []
      const fieldNameList: F[] = []
      rawData.forEach((rawItem) => {
        const item: any = {}
        Object.values(F).forEach((fieldName) => {
          if (rawItem[fieldName] !== undefined) {
            item[fieldName] = rawItem[fieldName]
            if (!fieldNameList.includes(fieldName))
              fieldNameList.push(fieldName)
          }
        })
        scoreDbData.push(item)
      })

      if (err) {
        Utils.error(res, `数据获取错误 ${err.message}`)
      }
      Utils.success(res, '数据获取成功', <QueryApiData>{ ...Utils.getPaginatedItems(scoreDbData, page, pagePer), fieldNameList })
    })
  }
}
