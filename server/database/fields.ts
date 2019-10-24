export enum FN {
  NAME = 'NAME', ID = 'ID',
  SCHOOL = 'SCHOOL', CLASS = 'CLASS',
  SCORED = 'SCORED', RANK = 'RANK',
  YW = 'YW', SX = 'SX', YY = 'YY',
  WL = 'WL', HX = 'HX', SW = 'SW',
  ZZ = 'ZZ', LS = 'LS', DL = 'DL',
  LZ = 'LZ', WZ = 'WZ',
  LK = 'LK', WK = 'WK', ZK = 'ZK'
}

export enum FL {
  NAME = '姓名', ID = '考号',
  SCHOOL = '学校', CLASS = '班级',
  SCORED = '总分', RANK = '排名',
  YW = '语文', SX = '数学', YY = '英语',
  WL = '物理', HX = '化学', SW = '生物',
  ZZ = '政治', LS = '历史', DL = '地理',
  LZ = '理综', WZ = '文综',
  LK = '理科总分', WK = '文科总分', ZK = '语数英总分'
}

/** 所有 科目字段名 */
export const FL_SUBJECTS = [
  FN.YW, FN.SX, FN.YY,
  FN.WL, FN.HX, FN.SW,
  FN.ZZ, FN.LS, FN.DL
]

/** 主要 科目字段名  */
export const FL_ZK_SUBJECTS = [
  FN.YW, FN.SX, FN.YY
]

/** 理科综合 科目字段名  */
export const FL_LZ_SUBJECTS = [
  FN.WL, FN.HX, FN.SW
]

/** 文科综合 科目字段名  */
export const FL_WZ_SUBJECTS = [
  FN.ZZ, FN.LS, FN.DL
]

export enum FSL {
  NAME = '名', ID = '号',
  SCHOOL = '校', CLASS = '班',
  SCORED = '总', RANK = '排',
  YW = '语', SX = '数', YY = '英',
  WL = '物', HX = '化', SW = '生',
  ZZ = '政', LS = '历', DL = '地'
}

export interface ScoreDataItem {
  [FN.NAME]: string
  [FN.ID]: string
  [FN.SCHOOL]: string
  [FN.CLASS]: string
  [FN.SCORED]: number
  [FN.RANK]: number
  [FN.YW]?: number
  [FN.SX]?: number
  [FN.YY]?: number
  [FN.WL]?: number
  [FN.HX]?: number
  [FN.SW]?: number
  [FN.ZZ]?: number
  [FN.LS]?: number
  [FN.DL]?: number
  [FN.LZ]?: number
  [FN.WZ]?: number
  [FN.LK]?: number
  [FN.WK]?: number
  [FN.ZK]?: number
}
