import F from '~/server/Field'

export interface CommonParms {
  /** 成绩数据表名 */
  tb?: string
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
  pagePer?: number
  sort?: string
}
export interface QueryData extends PaginatedData {
  fieldList: F[]
  conditionList: { [key in F]?: string }
  sortList: { [key in F]?: 1|-1 }
}
