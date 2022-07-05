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

export const queryTableDataPaneData = (table: any, rows: number = 100) => {
  const sql = `select * from ${table.database}.${table.name} limit ${rows}
  FORMAT JSON;`
  return query(sql).then(res => {
    return res
  })
}

export const queryPropertiesColumns = (table: any) => {
  const sql = `DESCRIBE TABLE ${table.database}.${table.name} FORMAT JSON`
  return query(sql).then(res => {
    return res
  })
}

export const queryPropertiesStatistics = (table: any) => {
  const sql = `SELECT table,
    sum(rows) AS rows,
    formatReadableSize(sum(bytes)) as size,
    min(min_date) as min_date,
    max(max_date) as max_date
    FROM system.parts
    WHERE active
    and database = '${table.database}' and table = '${table.name}'
    GROUP BY table FORMAT JSON
  `
  return query(sql).then(res => {
    const data = res.data[0]
    return {
      columns: [
        {
          name: 'Name'
        },
        {
          name: 'Value'
        },
      ],
      tableData: data && res.meta.map((item: any) => {
        return {
          Name: item.name,
          Value: data[item.name]
        }
      })
    }
  })
}