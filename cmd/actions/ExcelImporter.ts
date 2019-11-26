import path from 'path'
import fs from 'fs'
import * as XLSX from 'xlsx'
import F, { ScoreData } from '../../common/interfaces/field'
import { transDict as FT } from '../../common/interfaces/field/FieldTrans'
import { F_ALL, F_SUBJ, F_ZK_SUBJ, F_LZ_SUBJ, F_WZ_SUBJ } from '../../common/interfaces/field/FieldGrp'
import Database, { DATA_PATH } from '../../server/Database'
import DataStore from 'nedb'
import _ from 'lodash'

export default function ExcelImporter (args: any) {
  const dataPath = path.join(DATA_PATH, path.basename(args.fileName).replace(path.extname(args.fileName), '') + '.tb')
  if (fs.existsSync(dataPath)) {
    console.error(`[ERROR] Excel data has imported before. \nif you want to import again, please delete it first.\n"${dataPath}"`)
    process.exit(1)
  }

  const dataFile = new DataStore({
    filename: dataPath,
    autoload: true
  })

  const theadRowIndex = 0
  const wb: XLSX.WorkBook = XLSX.readFile(args.fileName)
  const xlsData: any[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 })
  const xlsFieldPos: { [key: string]: number } = {}
  const xlsFieldNames: string[] = []

  // 读取表头
  xlsData[theadRowIndex].forEach((colVal: string, pos: number) => {
    F_ALL.forEach((fieldName) => {
      if (colVal === fieldName) {
        xlsFieldPos[fieldName] = pos
        xlsFieldNames.push(fieldName)
      }
    })
  })

  // 读取数据
  let data: ScoreData[] = []
  xlsData.forEach((rowValues, rowIndex) => {
    if (rowIndex === 0) return
    const dataItem: any = {}
    _.forEach(xlsFieldPos, (pos: number, filedName: string) => {
      dataItem[filedName] = rowValues[pos] || null
    })
    data.push(dataItem)
  })

  // 总分 & 排名
  const setDataSumFieldValue = (dataFields: F[], targetField: F) => {
    if (!dataFields || dataFields.length <= 0) return
    _.forEach(data, (item) => {
      let scoreSum = 0
      dataFields.forEach((fieldName: string) => {
        if (xlsFieldNames.includes(fieldName)) {
          scoreSum += (Number((item as any)[fieldName]) || 0)
        }
      });
      (item as any)[targetField] = scoreSum
    })
  }
  setDataSumFieldValue(F_SUBJ, F.SCORED)

  // 总分从大到小排序
  data = _.sortBy(data, o => -o.SCORED)

  // RANK
  let tRank = 1
  let tScored = -1
  let tSameNum = 1
  _.forEach(data, (item) => {
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
  const dataZkSubjects = _.intersection(xlsFieldNames, F_ZK_SUBJ) as F[]
  const dataLzSubjects = _.intersection(xlsFieldNames, F_LZ_SUBJ) as F[]
  const dataWzSubjects = _.intersection(xlsFieldNames, F_WZ_SUBJ) as F[]
  if (dataZkSubjects.length > 0) {
    setDataSumFieldValue(dataZkSubjects, F.ZK)
  }
  if (dataLzSubjects.length > 0) {
    setDataSumFieldValue(dataLzSubjects, F.LZ)
    setDataSumFieldValue(_.union(dataLzSubjects, dataZkSubjects), F.LK)
  }
  if (dataWzSubjects.length > 0) {
    setDataSumFieldValue(dataWzSubjects, F.WZ)
    setDataSumFieldValue(_.union(dataWzSubjects, dataZkSubjects), F.WK)
  }

  // 导入数据到数据库
  data.forEach((item) => {
    dataFile.insert(item)
  })
}
