import PaginatedData from './PaginatedData'
import F from './field'

export default interface QueryApiData extends PaginatedData {
  fieldNameList: F[]
}
