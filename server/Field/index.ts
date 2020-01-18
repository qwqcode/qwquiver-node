enum F {
  /** 姓名 */ NAME = 'NAME',
  /** 考号 */ ID = 'ID',
  /** 学校 */ SCHOOL = 'SCHOOL',
  /** 班级 */ CLASS = 'CLASS',

  /** 排名 */ RANK = 'RANK',
  /** 文排 */ LK_RANK = 'LK_RANK',
  /** 理排 */ WK_RANK = 'WK_RANK',

  /** 语文 */ YW = 'YW',
  /** 数学 */ SX = 'SX',
  /** 英语 */ YY = 'YY',

  /** 物理 */ WL = 'WL',
  /** 化学 */ HX = 'HX',
  /** 生物 */ SW = 'SW',

  /** 政治 */ ZZ = 'ZZ',
  /** 历史 */ LS = 'LS',
  /** 地理 */ DL = 'DL',

  /** 理综 (物+化+生) */
  LZ = 'LZ',
  /** 文综 (政+历+地) */
  WZ = 'WZ',

  /** 主科 (语+数+英) */
  ZK = 'ZK',
  /** 理科 (语数英+理综) */
  LK = 'LK',
  /** 文科（语数英+理综） */
  WK = 'WK',

  /** 总分 */
  SCORED = 'SCORED',
}

type _ScoreData = {
  [F.NAME]: string, [F.ID]: string,
  [F.SCHOOL]: string, [F.CLASS]: string,
  [F.SCORED]: number,
  [F.RANK]: number,
  [F.LK_RANK]: number,
  [F.WK_RANK]: number,
  [F.YW]: number, [F.SX]: number, [F.YY]: number,
  [F.WL]: number, [F.HX]: number, [F.SW]: number,
  [F.ZZ]: number, [F.LS]: number, [F.DL]: number,
  [F.LZ]: number, [F.WZ]: number,
  [F.ZK]: number, [F.LK]: number, [F.WK]: number
}

export default F
export interface ScoreData extends _ScoreData {}
