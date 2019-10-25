import path from 'path'
import fs from 'fs'
import DataStore from 'nedb'

const DB_BASE_PATH = path.join(__dirname, '../../storage/database')
const DB_SCORES_PATH = path.join(DB_BASE_PATH, 'scores')
export { DB_BASE_PATH, DB_SCORES_PATH }

const scoreDbList: { [dbName: string]: DataStore<any> } = {}

function loadScoreDbList () {

  if (!fs.existsSync(DB_SCORES_PATH)) {
    fs.mkdirSync(DB_SCORES_PATH, { recursive: true })
  }

  fs.readdirSync(DB_SCORES_PATH).filter(o => /\.db$/.test(o)).forEach(fileName => {
    const dbName = fileName.replace(/(\.\/|\.db)/g,'')
    scoreDbList[dbName] = new DataStore({ filename: path.join(DB_SCORES_PATH, fileName), autoload: true })
  })
}

const Database = {
  init () {
    loadScoreDbList()
  },

  getScoreDbList () {
    return scoreDbList
  }
}

export default Database
