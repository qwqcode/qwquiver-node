import F from './'

/** 主要字段 */
export const F_MAIN = [F.NAME, F.ID, F.SCHOOL, F.CLASS, F.RANK, F.SCORED]

/** 主科 */
export const F_ZK_SUBJ = [F.YW, F.SX, F.YY]
/** 理科 */
export const F_LZ_SUBJ = [F.WL, F.HX, F.SW]
/** 文科 */
export const F_WZ_SUBJ = [F.ZZ, F.LS, F.DL]
/** 科目字段 */
export const F_SUBJ = [...F_ZK_SUBJ, ...F_LZ_SUBJ, ...F_WZ_SUBJ]

/** 拓展排名字段 */
export const F_EXT_RANK = [F.ZK_RANK, F.LK_RANK, F.WK_RANK, F.LZ_RANK, F.WZ_RANK]
/** 拓展求和字段  */
export const F_EXT_SUM = [F.ZK, F.LZ, F.WZ, F.LK, F.WK]

/** 数字字段 */
export const F_NUM_ALL = [F.RANK, F.SCORED, ...F_SUBJ, ...F_EXT_RANK, ...F_EXT_SUM]
/** 非数字字段 */
export const F_STR_ALL = [F.NAME, F.ID, F.SCHOOL, F.CLASS]

export const F_ALL = Object.keys(F) as F[]
