import { defineStore } from 'pinia'
import piniaStore from '@/store/index'

export const useSqlStore = defineStore<any, any>(
  // 唯一ID
  'sql',
  {
    state: () => ({
      columns: [],
      tabs: []
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
        this.columns = columns
      }
    },
  },
)

export function useSqlOutsideStore() {
  return useSqlStore(piniaStore)
}