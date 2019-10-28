export default interface PaginatedData {
  page: number
  pageSize: number
  total: number
  lastPage: number
  list: any[]
}
