import F, { ScoreData } from './Field'
import { transDict as FTD } from './Field/Trans'
import * as ApiT from './ApiTypes'
import Utils from './Utils'
import Database from './Database'
import Exam, { EXAM_CONF } from './Exam'
import express, { Router, Request, Response } from 'express'
import _ from 'lodash'

const api: Router = Router()

api.get('/', function index (req, res) {
  res.send('Hello, QWQUIVER!')
})

api.get('/conf', function conf (req, res) {
  const examList = Database.getExamIndex()
  const examGrpList = _.uniq(_.flatMap(examList, (o) => o.Grp || ''))
  const fieldTransDict = FTD

  Utils.success(res, '', {
    examList,
    examGrpList,
    fieldTransDict
  })
}
)

api.get('/query', function query (req, res) {
  const {
    exam: examName,
    where: whereJsonStr,
    page: pageStr,
    pagePer: pagePerStr,
    sort: sortJsonStr
  } = req.query as ApiT.QueryParams

  const exam = Utils.getExamByReq(req, res)
  if (!exam) return

  let conditionList: { [key in F]?: string|RegExp } = {}
  let sortList: { [key in F]?: 1|-1 } = {}

  try {
    if (whereJsonStr) conditionList = JSON.parse(whereJsonStr)
    if (sortJsonStr) sortList = JSON.parse(sortJsonStr)

    if (conditionList.NAME) {
      conditionList.NAME = new RegExp(`${conditionList.NAME}`, 'g')
    }
  } catch {
    Utils.error(res, `参数 JSON 解析错误`)
    return
  }
  if (!sortJsonStr) {
    sortList = { SCORED: -1 }
  }

  const pagePer: number = !!pagePerStr && !isNaN(pagePerStr) ? Number(pagePerStr) : 50
  const page: number = !!pageStr && !isNaN(pageStr) ? Number(pageStr) : 1

  exam.Data.find(conditionList).sort(sortList).exec((err: Error, rawData) => {
    if (err) Utils.error(res, `数据获取错误 ${err.message}`)

    const data: ScoreData[] = [] // 成绩数据

    // 遍历源数据
    rawData.forEach((rawItem) => {
      const item: any = {}
      data.push(item)

      // 遍历所有可能的字段名
      exam.DataFieldList.forEach((f) => {
        item[f] = rawItem[f]
      })
    })

    Utils.success(res, '数据获取成功', <ApiT.QueryData>{
      ...Utils.getPaginatedData(data, page, pagePer),
      examConf: exam.getConf(),
      fieldList: exam.DataFieldList,
      conditionList,
      sortList
    })
  })
})

api.get('/allSchoolClass', function allSchoolClass (req, res) {
  const { exam: examName } = req.query as ApiT.AllSchoolParams

  const exam = Utils.getExamByReq(req, res)
  if (!exam) return

  const respData: ApiT.AllSchoolData = { school: {} }
  _.forEach(exam.Data.getAllData(), (item: ScoreData) => {
    let classInSchool = respData.school[item.SCHOOL]
    if (!classInSchool)
      classInSchool = respData.school[item.SCHOOL] = []
    if (!classInSchool.includes(item.CLASS))
      classInSchool.push(item.CLASS)
  })

  Utils.success(res, '数据获取成功', respData)
})

export default api
