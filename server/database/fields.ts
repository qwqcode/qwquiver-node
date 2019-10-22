enum FieldNames { NAME, SCHOOL, CLASS, ID, YW, SX, YY, WL, HX, SW, ZZ, LS, DL }

enum FieldLabels {
  NAME = '姓名', SCHOOL = '学校', CLASS = '班级', ID = '考号',
  YW = '语文', SX = '数学', YY = '英语',
  WL = '物理', HX = '化学', SW = '生物',
  ZZ = '政治', LS = '历史', DL = '地理'
}

enum FieldLabelsShort {
  YW = '语', SX = '数', YY = '英',
  WL = '物', HX = '化', SW = '生',
  ZZ = '政', LS = '历', DL = '地'
}

export {
  FieldNames,
  FieldLabels,
  FieldLabelsShort
}
