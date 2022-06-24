import { SqlParams } from './dataAnalysis/sqls'

export type CommonResType = {
  meta: CommonMeta,
  data: CommonData
}

export type CommonObj = {[key: string]: string | number | any}

export type CommonMeta = CommonObj[]

export type CommonData = CommonMeta | CommonMeta[]

export type DataQueryFunc = (
  sqlFuncName: string,
  params: SqlParams
) => Promise<CommonResType>