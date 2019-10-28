import F from './field'

export default interface ScoreDbInfo {
  label: string
  fullScore?: { [f in F]?: number }
}
