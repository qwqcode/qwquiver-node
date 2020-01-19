import F, { ScoreData } from './Field'
import { transDict as FTD } from './Field/Trans'
import * as ApiT from './ApiTypes'
import Utils from './Utils'
import Database from './Database'
import Table, { CONF_FIELD } from './Table'
import express, { Router, Request, Response } from 'express'
import _ from 'lodash'

const api: Router = Router()

api.get('/', function index (req, res) {
  res.send('Hello, QWQUIVER!')
})

api.get('/conf', function conf (req, res) {
  const tableList = Database.getTbIndex()
  const tableGrpList = _.uniq(_.flatMap(tableList, (o: Table) => o.Grp))
  const fieldTransDict = FTD

  Utils.success(res, '', {
    tableList,
    tableGrpList,
    fieldTransDict
  })
}
)

api.get('/query', function query (req, res) {
  const {
    tb: tbName,
    where: whereJsonStr,
    page: pageStr,
    pagePer: pagePerStr,
    sort: sortJsonStr
  } = req.query as ApiT.QueryParams

  const table = Utils.getTableByReq(req, res)
  if (!table) return

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

  table.Data.find(conditionList).sort(sortList).exec((err: Error, rawData) => {
    if (err) Utils.error(res, `数据获取错误 ${err.message}`)

    const data: ScoreData[] = [] // 成绩数据

    // 遍历源数据
    rawData.forEach((rawItem) => {
      const item: any = {}
      data.push(item)

      // 遍历所有可能的字段名
      table.DataFieldList.forEach((f) => {
        item[f] = rawItem[f]
      })
    })

    Utils.success(res, '数据获取成功', <ApiT.QueryData>{
      ...Utils.getPaginatedData(data, page, pagePer),
      fieldList: table.DataFieldList,
      conditionList,
      sortList
    })
  })
})

api.get('/allSchoolClass', function allSchoolClass (req, res) {
  const { tb: tbName } = req.query as ApiT.AllSchoolParams

  const table = Utils.getTableByReq(req, res)
  if (!table) return

  const respData: ApiT.AllSchoolData = { school: {} }
  _.forEach(table.Data.getAllData(), (item: ScoreData) => {
    let classInSchool = respData.school[item.SCHOOL]
    if (!classInSchool)
      classInSchool = respData.school[item.SCHOOL] = []
    if (!classInSchool.includes(item.CLASS))
      classInSchool.push(item.CLASS)
  })

  Utils.success(res, '数据获取成功', respData)
})

export default api
