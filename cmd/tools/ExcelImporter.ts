import path from 'path'
import fs from 'fs'
import consola from 'consola'
import * as XLSX from 'xlsx'
import F, { ScoreData } from '../../server/Field'
import { transDict as FT } from '../../server/Field/Trans'
import { F_ALL, F_SUBJ, F_ZK_SUBJ, F_LZ_SUBJ, F_WZ_SUBJ } from '../../server/Field/Grp'
import Database, { DATA_PATH, ExamMapFile } from '../../server/Database'
import Exam from '../../server/Exam'
import DataStore from 'nedb'
import _ from 'lodash'

export default function ExcelImporter (srcFileName: string) {
  if (!fs.existsSync(srcFileName)) {
    consola.error(`表格文件不存在，路径有误`)
    process.exit(1)
  }

  const examName = path.basename(srcFileName).replace(path.extname(srcFileName), '')
  const dataFileName = path.join(DATA_PATH, `${examName}.tb`)
  if (fs.existsSync(dataFileName)) {
    consola.error(`表格文件之前已导入过。若需重新导入，请先删除文件："${dataFileName}"`)
    process.exit(1)
  }

  const wb: XLSX.WorkBook = XLSX.readFile(srcFileName)
  const xlsData: any[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 })
  const xlsFieldToColPos: { [field: string]: number } = {}
  const xlsFields: F[] = []

  // 读取表头
  xlsData[0].forEach((colVal: string, pos: number) => {
    F_ALL.forEach((field) => {
      if (_.has(xlsFieldToColPos, field)) return
      if (colVal === field || colVal === FT[field]) {
        xlsFieldToColPos[field] = pos
        xlsFields.push(field)
      }
    })
  })

  // 读取数据
  let tableDataItems: ScoreData[] = []
  xlsData.forEach((rowValues, rowIndex) => {
    if (rowIndex === 0) return
    const dataItem: any = {}
    _.forEach(xlsFieldToColPos, (colPos: number, fieldName: string) => {
      dataItem[fieldName] = rowValues[colPos] || null
    })
    tableDataItems.push(dataItem)
  })

  // 总分 & 排名

  /**
   * 计算 求和数据字段
   * @param dataSrcFields 求和数据源 字段
   * @param targetField 求和结果 字段
   */
  function calcSumFieldFor (dataSrcFields: F[], targetField: F) {
    if (!dataSrcFields || dataSrcFields.length <= 0) return
    _.forEach(tableDataItems, (item) => {
      let scoreSum = 0
      dataSrcFields.forEach((field: F) => {
        if (!xlsFields.includes(field)) return // 若这个字段不存在
        scoreSum += (Number((item as any)[field]) || 0)
      });
      (item as any)[targetField] = scoreSum
    })
  }
  calcSumFieldFor(F_SUBJ, F.SCORED)
  calcRankFieldFor(F.SCORED, F.RANK)

  /**
   * 计算 排名
   * @param sumDataField 分数字段
   * @param targetField 排名结果字段
   */
  function calcRankFieldFor (scoreSrcField: F, targetField: F) {
    let tRank = 1
    let tScored = -1
    let tSameNum = 1
    const itemsSorted = _.sortBy(tableDataItems, o => -o[scoreSrcField]) // 从大到小排序
    const applyRankData = (item: any, rank: Number) => {
      const rawItem: any = _.find(tableDataItems, o => o === item)
      rawItem[targetField] = rank
    }
    _.forEach(itemsSorted, (item: any) => {
      const itemScore = Number(item[scoreSrcField])
      if (tScored === -1) {
        // 最高分初始化
        tScored = itemScore
        applyRankData(item, tRank)
        return
      }

      if (itemScore < tScored) {
        tRank = tRank + tSameNum
        tScored = itemScore
        tSameNum = 1
      } else {
        tSameNum++
      }
      applyRankData(item, tRank)
    })
  }

  // 文科 & 理科 & 理综 & 文综
  const dataZkSubjects = _.intersection(xlsFields, F_ZK_SUBJ) as F[]
  const dataLzSubjects = _.intersection(xlsFields, F_LZ_SUBJ) as F[]
  const dataWzSubjects = _.intersection(xlsFields, F_WZ_SUBJ) as F[]
  if (dataZkSubjects.length > 0) {
    calcSumFieldFor(dataZkSubjects, F.ZK)
    calcRankFieldFor(F.ZK, F.ZK_RANK)
  }
  if (dataLzSubjects.length > 0) {
    calcSumFieldFor(dataLzSubjects, F.LZ)
    calcRankFieldFor(F.LZ, F.LZ_RANK)

    calcSumFieldFor(_.union(dataLzSubjects, dataZkSubjects), F.LK)
    calcRankFieldFor(F.LK, F.LK_RANK)
  }
  if (dataWzSubjects.length > 0) {
    calcSumFieldFor(dataWzSubjects, F.WZ)
    calcRankFieldFor(F.WZ, F.WZ_RANK)

    calcSumFieldFor(_.union(dataWzSubjects, dataZkSubjects), F.WK)
    calcRankFieldFor(F.WK, F.WK_RANK)
  }

  // 总分从大到小排序
  tableDataItems = _.sortBy(tableDataItems, o => -o.SCORED)

  consola.success(`表格数据已解析`)

  // 创建 Exam 实例
  const exam = new Exam({
    Name: examName
  })

  // 导入表格数据到文件
  exam.Data.insert(tableDataItems, (err) => {
    if (err) consola.error(`表格数据写入文件：${err.message}`)

    ExamMapFile.update([exam])
    consola.success(`更新数据表索引文件`)
    consola.success(`导入任务执行完毕`)
  })
}
