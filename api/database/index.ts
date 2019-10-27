import path from 'path'
import fs from 'fs'
import _ from 'lodash'
import DataStore from 'nedb'
import F, { ScoreData } from '../interfaces/field'
import ScoreDbInfo from '../interfaces/ScoreDbInfo'

export const DB_BASE_PATH = path.join(__dirname, '../../storage/database')
export const SCORE_DB_PATH = path.join(DB_BASE_PATH, 'scores')
export const SCORE_DB_INFO_PATH = path.join(SCORE_DB_PATH, './__info.json')

const scoreDbList: { [dbName: string]: DataStore<ScoreData> } = {}
let scoreDbInfoList: { [dbName: string]: ScoreDbInfo } = {}

function loadScoreDbList () {
  fs.readdirSync(SCORE_DB_PATH).filter(o => /\.db$/.test(o)).forEach(fileName => {
    const dbName = fileName.replace(/(\.\/|\.db)/g,'')
    scoreDbList[dbName] = new DataStore({ filename: path.join(SCORE_DB_PATH, fileName), autoload: true })
  })
}

function loadScoreDbInfo () {
  if (!fs.existsSync(SCORE_DB_INFO_PATH)) {
    makeNewScoreDbList()
    return
  }

  const fileContent = fs.readFileSync(SCORE_DB_INFO_PATH, 'utf-8')
  if (fileContent) {
    try {
      scoreDbInfoList = JSON.parse(fileContent)
    } catch {
      scoreDbInfoList = {}
    }
  }
}

export function makeNewScoreDbList () {
  _.forEach(scoreDbList, (db, dbName) => {
    const info: ScoreDbInfo = {
      label: dbName
    }

    scoreDbInfoList[dbName] = info
  })

  fs.writeFileSync(SCORE_DB_INFO_PATH, JSON.stringify(scoreDbInfoList, null, '  '), 'utf8')
}

const Database = {
  init () {
    if (!fs.existsSync(SCORE_DB_PATH)) {
      fs.mkdirSync(SCORE_DB_PATH, { recursive: true })
    }

    loadScoreDbList()
    loadScoreDbInfo()
  },

  getScoreDb (dbName: string) {
    return (typeof scoreDbList[dbName] !== 'undefined') ? scoreDbList[dbName] : undefined
  },

  getScoreDbInfoList () {
    return scoreDbInfoList
  }
}

export default Database
