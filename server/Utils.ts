import PaginatedData from '../common/interfaces/api/PaginatedData'
import ApiCommonParams from '../common/interfaces/api/ApiCommonParams'
import Database from './database'
import express, { Router, Request, Response } from 'express'
import _ from 'lodash'

export default class Utils {
  static success (res: Response, msg?: string, data?: Object) {
    return res.send({ success: true, msg, data })
  }

  static error (res: Response, msg?: string, data?: Object) {
    return res.send({ success: false, msg, data })
  }

  static getPaginatedItems (items: any[], page: number, pageSize: number): PaginatedData {
    const pg = page || 1
    const pgSize = pageSize || 100
    const offset = (pg - 1) * pgSize
    const pagedItems = _.drop(items, offset).slice(0, pgSize)

    return {
      page: pg,
      pageSize: pgSize,
      total: items.length,
      lastPage: Math.ceil(items.length / pgSize),
      list: pagedItems
    }
  }

  static getDbByReq (req: Request, res: Response) {
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
}
