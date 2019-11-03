import PaginatedData from './PaginatedData'
import F from './field'

export interface QueryApiParams {
  db?: string,
  where?: string,
  page?: number,
  pagePer?: number,
  sort?: string
}

export interface QueryApiData extends PaginatedData {
  fieldNameList: F[]
}
