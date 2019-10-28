import F from './'

/** 主要字段 */
export const F_MAIN = [F.NAME, F.ID, F.SCHOOL, F.CLASS, F.SCORED]

/** 排名字段 */
export const F_RANK = [F.RANK, F.LK_RANK, F.WK_RANK]

/** 主科 */
export const F_ZK_SUBJ = [F.YW, F.SX, F.YY]
/** 理科 */
export const F_LZ_SUBJ = [F.WL, F.HX, F.SW]
/** 文科 */
export const F_WZ_SUBJ = [F.ZZ, F.LS, F.DL]
/** 科目字段 */
export const F_SUBJ = [...F_ZK_SUBJ, ...F_LZ_SUBJ, ...F_WZ_SUBJ]

/** 求和字段  */
export const F_SUM = [F.ZK, F.LZ, F.WZ, F.LK, F.WK]

/** 数字字段 */
export const F_NUM_ALL = [...F_RANK, ...F_SUBJ, ...F_SUM]
/** 非数字字段 */
export const F_STR_ALL = [...F_MAIN]

export const F_ALL = Object.keys(F)
