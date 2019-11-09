import F, { ScoreData } from '../common/interfaces/field'
import { transDict as FT } from '../common/interfaces/field/FieldTrans'
import { QueryApiData, QueryApiParams } from '../common/interfaces/api/QueryApi'
import { AllSchoolApiParams, AllSchoolApiData } from '../common/interfaces/api/AllSchoolApi'
import ApiCommonParams from '../common/interfaces/api/ApiCommonParams'
import Utils from './Utils'
import Database from './database'
import _ from 'lodash'
import express, { Router, Request, Response } from 'express'

const getDbByReq = (req: Request, res: Response) => {
  const { db: dbName } = req.query as ApiCommonParams
  if (!dbName) {
    Utils.error(res, `未选择数据`)
    return null
  }

  const db = Database.getScoreDb(dbName)
  if (!db) {
    Utils.error(res, `未找到数据 ${dbName || ''}`)
    return null
  }

  return db
}

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
      where: whereJsonStr,
      page: pageStr,
      pagePer: pagePerStr,
      sort: sortJsonStr
    } = req.query as QueryApiParams

    const db = getDbByReq(req, res)
    if (!db) return

    let conditionList: { [key in F]?: string } = {}
    let sortList: { [key in F]?: 1|-1 } = {}

    try {
        if (whereJsonStr) conditionList = JSON.parse(whereJsonStr)
        if (sortJsonStr) sortList = JSON.parse(sortJsonStr)
    } catch {
      Utils.error(res, `参数 JSON 解析错误`)
      return
    }
    if (!sortJsonStr) {
      sortList = { SCORED: -1 }
    }

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
      Utils.success(res, '数据获取成功', <QueryApiData>{
        ...Utils.getPaginatedItems(scoreDbData, page, pagePer),
        fieldNameList,
        conditionList,
        sortList
      })
    })
  }

  public allSchoolClass (req: Request, res: Response) {
    const { db: dbName } = req.query as AllSchoolApiParams

    const db = getDbByReq(req, res)
    if (!db) return

    const respData: AllSchoolApiData = { school: {} }
    _.forEach(db.getAllData(), (item: ScoreData) => {
      let classInSchool = respData.school[item.SCHOOL]
      if (!classInSchool)
        classInSchool = respData.school[item.SCHOOL] = []
      if (!classInSchool.includes(item.CLASS))
        classInSchool.push(item.CLASS)
    })

    Utils.success(res, '数据获取成功', respData)
  }
}
