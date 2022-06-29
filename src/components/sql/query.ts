import { query } from "@/utils/http"

export const queryAllTables = () => {
  const sql = `SELECT t.database,
        t.name,
        t.engine,
        -- t.*,
        pa.size
    FROM system.tables as t ANY LEFT JOIN ( SELECT database,table as name,formatReadableSize(sum(bytes)) as size FROM system.parts  GROUP BY database,name ) as pa USING (database,name)
    LIMIT 10000

    FORMAT JSON`
  return query(sql).then(res => {
    return res
  })
}

export const queryAllDatabases = () => {
  const sql = `SELECT name FROM system.databases LIMIT 10000

  FORMAT JSON`
  return query(sql).then(res => {
    return res
  })
}

export const queryAllColumns = () => {
  const sql = `SELECT * FROM system.columns

    LIMIT 50000

  FORMAT JSON`
  return query(sql).then(res => {
    return res
  })
}