import Database from './Database'
import F from './Field'
import { F_SUBJ } from './Field/Grp'
import Exam, { EXAM_CONF } from './Exam'
import * as ApiT from './ApiTypes'
import express, { Router, Request, Response } from 'express'
import _ from 'lodash'

export default class Utils {
  static getPaginatedData (items: any[], page: number, pageSize: number): ApiT.PaginatedData {
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

  static getExamByReq (req: Request, res: Response) {
    const { exam: examName } = req.query as ApiT.CommonParms
    if (!examName) {
      Utils.error(res, `未选择数据`)
      return null
    }

    const exam = Database.getExam(examName)
    if (!exam) {
      Utils.error(res, `未找到数据 ${examName || ''}`)
      return null
    }

    return exam
  }

  static success (res: Response, msg?: string, data?: Object) {
    return res.status(200).send({ success: true, msg, data })
  }

  static error (res: Response, msg?: string, data?: Object) {
    return res.status(500).send({ success: false, msg, data })
  }
}
