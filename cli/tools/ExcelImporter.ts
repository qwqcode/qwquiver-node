import path from 'path'
import fs from 'fs'
import consola from 'consola'
import * as XLSX from 'xlsx'
import F, { ScoreData } from '../../server/Field'
import { transDict as FT } from '../../server/Field/Trans'
import { F_ALL, F_SUBJ, F_ZK_SUBJ, F_LZ_SUBJ, F_WZ_SUBJ } from '../../server/Field/Grp'
import Database, { DATA_PATH, ExamMapFile, DataUpdatedSignFile } from '../../server/Database'
import Exam, { EXAM_CONF } from '../../server/Exam'
import DataStore from 'nedb'
import _ from 'lodash'

export default async function ExcelImporter (srcFileName: string, examConf?: any, force: boolean = false, alwaysCalc: boolean = false) {
  if (!fs.existsSync(srcFileName)) {
    consola.error(`表格文件不存在，路径有误`)
    process.exit()
  }

  const examName: string = examConf.Name || path.basename(srcFileName).replace(path.extname(srcFileName), '')
  if (/[\\/:*?"<>|]/g.test(examName)) {
    consola.error(`名称不能包含字符 "\\/:*?"<>|"，请修改名称`)
    process.exit()
  }

  const dataFileName = path.join(DATA_PATH, `${examName}.qexam`)

  if (fs.existsSync(dataFileName)) {
    if (!force) {
      consola.warn(`Exam "${examName}" 已存在，导入会覆盖数据，若继续请加上 --force 参数`)
      process.exit()
    }

    fs.unlinkSync(dataFileName)
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

  // 读取数据 & 导入数组
  let tableDataItems: ScoreData[] = []
  xlsData.forEach((rowValues, rowPos) => { // ↓↓↓ 表格 纵向遍历 ↓↓↓
    if (rowPos === 0) return // 忽略首行
    const itemName = rowValues[xlsFieldToColPos[F.NAME]]
    if (!itemName) return // 舍弃 NAME 未知的数据

    const dataItem: any = {} // →→→ 表格 横向遍历 →→→
    _.forEach(xlsFieldToColPos, (colPos: number, field: string) => {
      const value = rowValues[colPos]
      if (F_SUBJ.includes(field as F)) { // 若为分数字段
        if (isNaN(Number(value))) { // 若科目分数数据不为数字
          consola.error(`表格存在问题 `
          + `行:${rowPos+1}, 列:${colPos+1}, NAME:"${itemName}", F:"${field}" `
          + `科目分数不是数字，请检查并修改为数字后继续导入`)
          process.exit(1)
        }

        dataItem[field] = Number(value)
      } else {
        dataItem[field] = value || null
      }
    })
    tableDataItems.push(dataItem)
  })

  // 计算总分
  calcSumFieldFor(F_SUBJ, F.SCORED)

  // 按成绩从大到小排序
  tableDataItems = _.sortBy(tableDataItems, o => -o[F.SCORED])

  /**
   * 计算 求和数据字段
   * @param dataSrcFields 求和数据源 字段
   * @param targetField 求和计算结果 字段
   */
  function calcSumFieldFor (dataSrcFields: F[], targetField: F|string) {
    if (xlsFields.includes(targetField as F) && !alwaysCalc) return // 若字段已存在于源表格文件中
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

  /**
   * 计算 分数的排名
   * @param scoreSrcField 分数 字段
   * @param targetField 排名计算结果 字段
   * @param dataItemsSortSrc 作用的 dataItems (给定作用范围)
   */
  function _calcRankFieldFor (scoreSrcField: F, targetField: F|string, dataItemsSortSrc: ScoreData[] = tableDataItems) {
    if (xlsFields.includes(targetField as F) && !alwaysCalc) return // 若字段已存在于源表格文件中
    let tRank = 1
    let tScored = -1
    let tSameNum = 1
    const applyRankData = (item: any, rank: Number) => {
      const rawItem: any = _.find(tableDataItems, o => o === item)
      rawItem[targetField] = rank
    }
    const itemsSorted = _.sortBy(dataItemsSortSrc, o => -o[scoreSrcField]) // 从大到小排序
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

  /**
   * 计算 相对于 全部数据/学校/班级 的分数排名
   * @param scoreSrcField 分数 字段
   * @todo 效率不太高，待优化
   */
  function calcRankFieldFor (scoreSrcField: F) {
    {
      // 相对于 全部数据 的排名
      const targetField = (scoreSrcField !== F.SCORED) ? `${scoreSrcField}_RANK` : F.RANK
      _calcRankFieldFor(scoreSrcField, targetField)
    }
    const schoolClasses: {[school: string]: string[]} = {} // 顺便建立学校班级列表
    _.forEach(tableDataItems, (item) => {
      if (!item.NAME || !item.CLASS || !item.SCHOOL) return
      // 相对于 学校 的排名
      if (schoolClasses[item.SCHOOL] === undefined) {
        const targetField = (scoreSrcField !== F.SCORED) ? `${scoreSrcField}_SCHOOL_RANK` : F.SCHOOL_RANK
        _calcRankFieldFor(scoreSrcField, targetField, _.filter(tableDataItems, {
          [F.SCHOOL]: item.SCHOOL
        }))
        schoolClasses[item.SCHOOL] = []
      }
      // 相对于 班级 的排名
      if (!schoolClasses[item.SCHOOL].includes(item.CLASS)) {
        const targetField = (scoreSrcField !== F.SCORED) ? `${scoreSrcField}_CLASS_RANK` : F.CLASS_RANK
        _calcRankFieldFor(scoreSrcField, targetField, _.filter(tableDataItems, {
          [F.SCHOOL]: item.SCHOOL,
          [F.CLASS]: item.CLASS
        }))
        schoolClasses[item.SCHOOL].push(item.CLASS)
      }
    })
  }

  // 计算总分相对于 全部数据/学校/班级 的排名
  calcRankFieldFor(F.SCORED)

  // 单科排名
  const dataSubjects = _.intersection(xlsFields, F_SUBJ) as F[]
  _.forEach(dataSubjects, (subj) => {
    // 学校 & 班级 单科排名
    calcRankFieldFor(subj)
  })

  // 主科, 文科, 理科, 理综, 文综 => SUM & RANK
  const dataZkSubjects = _.intersection(xlsFields, F_ZK_SUBJ) as F[]
  const dataLzSubjects = _.intersection(xlsFields, F_LZ_SUBJ) as F[]
  const dataWzSubjects = _.intersection(xlsFields, F_WZ_SUBJ) as F[]
  if (dataZkSubjects.length > 0) {
    calcSumFieldFor(dataZkSubjects, F.ZK)
    calcRankFieldFor(F.ZK)
  }
  if (dataLzSubjects.length > 0) {
    calcSumFieldFor(dataLzSubjects, F.LZ)
    calcRankFieldFor(F.LZ)

    calcSumFieldFor(_.union(dataLzSubjects, dataZkSubjects), F.LK)
    calcRankFieldFor(F.LK)
  }
  if (dataWzSubjects.length > 0) {
    calcSumFieldFor(dataWzSubjects, F.WZ)
    calcRankFieldFor(F.WZ)

    calcSumFieldFor(_.union(dataWzSubjects, dataZkSubjects), F.WK)
    calcRankFieldFor(F.WK)
  }

  // 总分从大到小排序
  tableDataItems = _.sortBy(tableDataItems, o => -o.SCORED)

  consola.success(`表格数据已解析`)

  // 创建 Exam 实例
  const exam = new Exam({ Name: examName, ...(examConf||{}) })

  // 导入表格数据到文件
  exam.Data.insert(tableDataItems, (err) => {
    if (err) consola.error(`表格数据写入文件：`, err)

    ExamMapFile.update([exam])
    consola.success(`更新数据表索引文件`)

    DataUpdatedSignFile.create()
    consola.success(`导入任务执行完毕`)
  })
}
