import Utils from '../Utils'
import { transDict as FT } from '../../common/interfaces/field/FieldTrans'
import { QueryApiData, QueryApiParams } from '../../common/interfaces/api/QueryApi'
import F, { ScoreData } from '../../common/interfaces/field'
import { AllSchoolApiParams, AllSchoolApiData } from '../../common/interfaces/api/AllSchoolApi'
import express, { Router, Request, Response } from 'express'

export default function query (req: Request, res: Response) {
  const {
    tb: tbName,
    where: whereJsonStr,
    page: pageStr,
    pagePer: pagePerStr,
    sort: sortJsonStr
  } = req.query as QueryApiParams

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

  table.data.find(conditionList).sort(sortList).exec((err: Error, rawData) => {
    const scoreTbData: ScoreData[] = []
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
      scoreTbData.push(item)
    })

    if (err) {
      Utils.error(res, `数据获取错误 ${err.message}`)
    }
    Utils.success(res, '数据获取成功', <QueryApiData>{
      ...Utils.getPaginatedItems(scoreTbData, page, pagePer),
      fieldNameList,
      conditionList,
      sortList
    })
  })
}
