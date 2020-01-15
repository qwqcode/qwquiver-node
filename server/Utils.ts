import PaginatedData from '../common/interfaces/api/PaginatedData'
import ApiCommonParams from '../common/interfaces/api/ApiCommonParams'
import Database from './Database'
import Table, { CONF_FIELD } from './Table'
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

  static getTableByReq (req: Request, res: Response) {
    const { tb: tbName } = req.query as ApiCommonParams
    if (!tbName) {
      Utils.error(res, `未选择数据`)
      return null
    }

    const tb = Database.getTable(tbName)
    if (!tb) {
      Utils.error(res, `未找到数据 ${tbName || ''}`)
      return null
    }

    return tb
  }

  static getAllTableConfObj (): any {
    const obj = {}
    _.forEach(Database.tableList, (table, name) => {
      obj[name] = {}
      _.forEach(CONF_FIELD, (field) => {
        const val = table[field]
        if (typeof val === 'undefined') return
        obj[name][field] = val
      })
    })
    return obj
  }
}
