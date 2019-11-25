import Utils from '../Utils'
import F, { ScoreData } from '../../common/interfaces/field'
import { AllSchoolApiParams, AllSchoolApiData } from '../../common/interfaces/api/AllSchoolApi'
import express, { Router, Request, Response } from 'express'
import _ from 'lodash'

export default function allSchoolClass (req: Request, res: Response) {
  const { db: dbName } = req.query as AllSchoolApiParams

  const db = Utils.getDbByReq(req, res)
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
