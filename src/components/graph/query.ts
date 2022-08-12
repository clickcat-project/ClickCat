import { query } from '@/utils/http'

export const queryList = async () => {
  const sql = 'select * from clickcat.GRAPH_TASK '
  return query(sql).then(res => {
    return {
      data: res.data.map((item: any) => ({id: item.ID, ...JSON.parse(item.JOB_DETAIL)})),
      rows: res.rows,
      statistics: res.statistics
    }
  })
}

export function addOne(dataStr: string) {
  const sql = `insert into clickcat.GRAPH_TASK values('shjdhsjdhsj','${dataStr}')`
  return query(sql)
    .catch(err => {
      console.log(err)
    })
}

export async function deleteOne (id: string) {
  const sql = `alter table clickcat.GRAPH_TASK delete where ID = '${id}'`
  return query(sql)
    .catch(err => {
      console.log(err)
    })
}

export async function queryColumnByDatabase (database: string) {
  const sql = `select * from system.columns where database = '${database}'`
  return query(sql)
}