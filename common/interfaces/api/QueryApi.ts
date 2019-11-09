import F from '../field'
import PaginatedData from './PaginatedData'
import ApiCommonParams from './ApiCommonParams'

export interface QueryApiParams extends ApiCommonParams {
  where?: string
  page?: number
  pagePer?: number
  sort?: string
}

export interface QueryApiData extends PaginatedData {
  fieldNameList: F[]
  conditionList: { [key in F]?: string }
  sortList: { [key in F]?: 1|-1 }
}
