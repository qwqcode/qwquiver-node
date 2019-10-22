export enum FieldNames {
  NAME = 'NAME', ID = 'ID',
  SCHOOL = 'SCHOOL', CLASS = 'CLASS',
  YW = 'YW', SX = 'SX', YY = 'YY',
  WL = 'WL', HX = 'HX', SW = 'SW',
  ZZ = 'ZZ', LS = 'LS', DL = 'DL'
}

export enum FieldLabels {
  NAME = '姓名', SCHOOL = '学校', CLASS = '班级', ID = '考号',
  YW = '语文', SX = '数学', YY = '英语',
  WL = '物理', HX = '化学', SW = '生物',
  ZZ = '政治', LS = '历史', DL = '地理'
}

export enum FieldLabelsShort {
  NAME = '名', SCHOOL = '校', CLASS = '班', ID = '号',
  YW = '语', SX = '数', YY = '英',
  WL = '物', HX = '化', SW = '生',
  ZZ = '政', LS = '历', DL = '地'
}

export interface ScoreDataItem {
  [FieldNames.NAME]: string
  [FieldNames.ID]: string
  [FieldNames.SCHOOL]: string
  [FieldNames.CLASS]: string
  [FieldNames.YW]?: string
  [FieldNames.SX]?: string
  [FieldNames.YY]?: string
  [FieldNames.WL]?: string
  [FieldNames.HX]?: string
  [FieldNames.SW]?: string
  [FieldNames.ZZ]?: string
  [FieldNames.LS]?: string
  [FieldNames.DL]?: string
}
