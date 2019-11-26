import Utils from '../Utils'
import F, { ScoreData } from '../../common/interfaces/field'
import { AllSchoolApiParams, AllSchoolApiData } from '../../common/interfaces/api/AllSchoolApi'
import express, { Router, Request, Response } from 'express'
import _ from 'lodash'

export default function allSchoolClass (req: Request, res: Response) {
  const { tb: tbName } = req.query as AllSchoolApiParams

  const table = Utils.getTableByReq(req, res)
  if (!table) return

  const respData: AllSchoolApiData = { school: {} }
  _.forEach(table.data.getAllData(), (item: ScoreData) => {
    let classInSchool = respData.school[item.SCHOOL]
    if (!classInSchool)
      classInSchool = respData.school[item.SCHOOL] = []
    if (!classInSchool.includes(item.CLASS))
      classInSchool.push(item.CLASS)
  })

  Utils.success(res, '数据获取成功', respData)
}
