import F from './Field'
import { EXAM_CONF } from './Exam'

export interface CommonParms {
  /** 成绩数据表名 */
  exam?: string
}

export interface AllSchoolParams extends CommonParms {}
export interface AllSchoolData {
  school: { [schoolName: string]: string[] }
}

export interface PaginatedData {
  page: number
  pageSize: number
  total: number
  lastPage: number
  list: any[]
}

export interface QueryParams extends CommonParms {
  where?: string
  page?: number
  pageSize?: number
  sort?: string
}
export interface QueryData extends PaginatedData {
  dataDesc: string
  examConf: EXAM_CONF
  fieldList: F[]
  avgList: { [key in F]?: number }
  condList: { [key in F]?: string|RegExp }
  sortList: { [key in F]?: 1|-1 }
}
