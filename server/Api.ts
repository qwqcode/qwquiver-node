import F, { ScoreData } from './Field'
import { F_SUBJ, F_EXT_SUM } from './Field/Grp'
import { FTrans, transDict as FTD } from './Field/Trans'
import * as ApiT from './ApiTypes'
import Utils from './Utils'
import Database from './Database'
import Exam, { EXAM_CONF } from './Exam'
import express, { Router, Request, Response } from 'express'
import _ from 'lodash'

const api: Router = Router()

api.get('/', (req, res) => {
  res.send('Hello, QWQUIVER!')
})

api.get('/conf', (req, res) => {
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

api.get('/query', (req, res) => {
  const {
    exam: examName,
    where: whereJsonStr,
    page: pageStr,
    pageSize: pageSizeStr,
    sort: sortJsonStr
  } = req.query as ApiT.QueryParams

  const exam = Utils.getExamByReq(req, res)
  if (!exam) return

  let condList: { [key in F]?: string|RegExp } = {}
  let sortList: { [key in F]?: 1|-1 } = {}

  try {
    if (whereJsonStr) condList = JSON.parse(whereJsonStr)
    if (sortJsonStr) sortList = JSON.parse(sortJsonStr)

    if (condList.NAME) {
      condList.NAME = new RegExp(`${condList.NAME}`, 'g')
    }
  } catch {
    Utils.error(res, `参数 JSON 解析错误`)
    return
  }
  if (!sortJsonStr) {
    sortList = { SCORED: -1 }
  }

  let dataDesc = ''
  if (_.isEmpty(condList))
    dataDesc = '全部考生成绩'
  else if (_.has(condList, F.NAME))
    dataDesc = `姓名满足 “${condList.NAME}” 的考生成绩`
  else if (_.has(condList, F.SCHOOL) && !_.has(condList, F.CLASS))
    dataDesc = `${condList.SCHOOL} · 全校成绩`
  else if (_.has(condList, F.SCHOOL) && _.has(condList, F.CLASS))
    dataDesc = `${condList.SCHOOL} ${condList.CLASS} · 班级成绩`


  const pageSize: number = !!pageSizeStr && !isNaN(pageSizeStr) ? Number(pageSizeStr) : 50
  const page: number = !!pageStr && !isNaN(pageStr) ? Number(pageStr) : 1

  exam.Data.find(condList).sort(sortList).exec((err: Error, rawData) => {
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

    // 平均值计算
    const avgFields = [...F_SUBJ, ...F_EXT_SUM]
    const avgList: {[field in F]?: number} = {}
    _.forEach(_.intersection(avgFields, exam.DataFieldList), (f) => {
      avgList[f] = _.sum(_.flatMap(rawData, o => o[f])) / (rawData.length || 1)
    })

    const respData: ApiT.QueryData = {
      dataDesc,
      ...Utils.getPaginatedData(data, page, pageSize),
      examConf: exam.getConf(),
      fieldList: exam.DataFieldList,
      avgList,
      condList,
      sortList
    }

    Utils.success(res, '数据获取成功', respData)
  })
})

api.get('/allSchoolClass', (req, res) => {
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

api.get('/chart', (req, res) => {
  const {
    examGrp,
    where: whereJsonStr,
  } = req.query as ApiT.ChartParams

  let condList: { [key in F]?: string } = {}
  try {
    if (whereJsonStr) condList = JSON.parse(whereJsonStr)
  } catch {
    Utils.error(res, `参数 JSON 解析错误`)
    return
  }

  let uncertain = false // 不确定的数据
  const examList = (examGrp !== undefined) ? _.filter(Database.getExamList(), o => o.Conf.Grp === examGrp) : Database.getExamList()
  const fieldList: string[] = F_SUBJ

  const chartData: any[] = []
  _.forEach(examList, (exam) => {
    const oneList = _.filter(exam.Data.getAllData(), condList)
    if (oneList.length <= 0) return
    if (oneList.length > 1) uncertain = true
    const one = oneList[0]
    const chartDataItem: {[key: string]: number} = {}
    _.forEach(fieldList, (f) => {
      if (!one[f]) return
      let score: number = one[f]
      if (!!exam.Conf.FullScore && _.has(exam.Conf.FullScore, f))
        score = Number(((score / (exam.Conf.FullScore[f] || 1)) * 100).toFixed(2)) // 转为百分制
      chartDataItem[FTrans(f)] = score
    })
    chartData.push({exam: exam.Name, ...chartDataItem})
  })

  const respData: ApiT.ChartData = {
    chartData,
    fieldList: _.map(fieldList, f => FTrans(f)),
    uncertain
  }

  Utils.success(res, '数据获取成功', respData)
})

export default api
