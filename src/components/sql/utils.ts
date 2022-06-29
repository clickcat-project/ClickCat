
import { useLoginStore } from "@/store"
import { ColumnItem, DatabaseItem, TableItem } from "./types"

export const createTree = (columns: ColumnItem[], tables: TableItem[], database: DatabaseItem[]) => {
  const loginStore = useLoginStore()
  const tablesTree = tables.map((item) => {
    const children = columns.filter((col) => col.table === item.name)
    return {
      ...item,
      children
    }
  })

  const databaseTree = database.map(item => {
    const children = tablesTree.filter((table) => table.database === item.name)
    return {
      ...item,
      children
    }
  })

  const finalTree = {
    name: loginStore.connection.connectionName,
    children: databaseTree
  }
  return [finalTree]
}