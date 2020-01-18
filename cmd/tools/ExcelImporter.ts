import path from 'path'
import fs from 'fs'
import Console from 'console'
import * as XLSX from 'xlsx'
import F, { ScoreData } from '../../server/Field'
import { transDict as FT } from '../../server/Field/Trans'
import { F_ALL, F_SUBJ, F_ZK_SUBJ, F_LZ_SUBJ, F_WZ_SUBJ } from '../../server/Field/Grp'
import Database, { DATA_PATH } from '../../server/Database'
import DataStore from 'nedb'
import _ from 'lodash'

export default function ExcelImporter (srcFileName: string) {
  if (!fs.existsSync(srcFileName)) {
    Console.error(`[Error] 表格文件不存在，路径有误`)
    process.exit(1)
  }

  const dataFileName = path.join(DATA_PATH, path.basename(srcFileName).replace(path.extname(srcFileName), '') + '.tb')
  if (fs.existsSync(dataFileName)) {
    Console.error(`[Error] 表格文件之前已导入过 \n如果想重新导入，请先删除文件：\n"${dataFileName}"`)
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
  let tableData: ScoreData[] = []
  xlsData.forEach((rowValues, rowIndex) => {
    if (rowIndex === 0) return
    const dataItem: any = {}
    _.forEach(xlsFieldToColPos, (colPos: number, filedName: string) => {
      dataItem[filedName] = rowValues[colPos] || null
    })
    tableData.push(dataItem)
  })

  // 总分 & 排名

  /**
   * 计算 求和数据字段
   * @param dataSrcFields 求和数据源 字段
   * @param targetField 求和结果 字段
   */
  const calcSumFieldFor = (dataSrcFields: F[], targetField: F) => {
    if (!dataSrcFields || dataSrcFields.length <= 0) return
    _.forEach(tableData, (item) => {
      let scoreSum = 0
      dataSrcFields.forEach((field: F) => {
        if (!xlsFields.includes(field)) return // 若这个字段不存在
        scoreSum += (Number((item as any)[field]) || 0)
      });
      (item as any)[targetField] = scoreSum
    })
  }
  calcSumFieldFor(F_SUBJ, F.SCORED)

  // 总分从大到小排序
  tableData = _.sortBy(tableData, o => -o.SCORED)

  // RANK
  let tRank = 1
  let tScored = -1
  let tSameNum = 1
  _.forEach(tableData, (item) => {
    if (tScored === -1) {
      // 最高分初始化
      tScored = item.SCORED
      item.RANK = tRank
      return
    }

    if (Number(item.SCORED) < tScored) {
      tRank = tRank + tSameNum
      tScored = item.SCORED
      tSameNum = 1
    } else {
      tSameNum++
    }
    item.RANK = tRank
  })

  // 文科 & 理科 & 理综 & 文综
  const dataZkSubjects = _.intersection(xlsFields, F_ZK_SUBJ) as F[]
  const dataLzSubjects = _.intersection(xlsFields, F_LZ_SUBJ) as F[]
  const dataWzSubjects = _.intersection(xlsFields, F_WZ_SUBJ) as F[]
  if (dataZkSubjects.length > 0) {
    calcSumFieldFor(dataZkSubjects, F.ZK)
  }
  if (dataLzSubjects.length > 0) {
    calcSumFieldFor(dataLzSubjects, F.LZ)
    calcSumFieldFor(_.union(dataLzSubjects, dataZkSubjects), F.LK)
  }
  if (dataWzSubjects.length > 0) {
    calcSumFieldFor(dataWzSubjects, F.WZ)
    calcSumFieldFor(_.union(dataWzSubjects, dataZkSubjects), F.WK)
  }

  // 创建 DataStore
  const dataFile = new DataStore({
    filename: dataFileName,
    autoload: true
  })

  // 导入表格数据到文件
  tableData.forEach((item) => {
    dataFile.insert(item)
  })
}
