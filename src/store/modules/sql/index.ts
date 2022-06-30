import { defineStore } from 'pinia'
import piniaStore from '@/store/index'
import { TabsType } from '@/components/sql/types'

export const useSqlStore = defineStore(
  // 唯一ID
  'sql',
  {
    state: () => ({
      columns: [],
      tabs: [
        {
          name: 'SQL_1',
          sql: '',
          type: TabsType.Editor
        }
      ]
    }),
    persist: {
      enabled: true,
      strategies: [
        { key: 'tabs', storage: localStorage, paths: ['tabs'] },
      ],
    },
    getters: {},
    actions: {
      setColumns (columns: any[]) {
        this.columns = columns as never[]
      }
    },
  },
)

export function useSqlOutsideStore() {
  return useSqlStore(piniaStore)
}