import { defineStore } from 'pinia'
import piniaStore from '@/store/index'
import { TabsType } from '@/components/sql/types'
import { TabItem } from './types'

const firstDate = +new Date() + ''

export const useSqlStore = defineStore(
  // 唯一ID
  'sql',
  {
    state: () => ({
      columns: [],
      tabs: [
        {
          title: 'SQL_1' as string,
          name:  firstDate,
          sql: '',
          type: TabsType.Editor,
        }
      ],
      activeTabs: firstDate
    }),
    persist: {
      enabled: true,
      strategies: [
        { key: 'tabs', storage: localStorage, paths: ['tabs'] },
        { key: 'activeTabs', storage: localStorage, paths: ['activeTabs'] },
      ],
    },
    getters: {},
    actions: {
      setColumns (columns: any[]) {
        this.columns = columns as never[]
      },
      setCurrentTab (tab: TabItem) {
        const index = this.tabs.findIndex(item => item.name === tab.name)
        const tabOld = this.tabs[index]
        this.tabs[index] = {
          ...tabOld,
          ...tab
        }
      },
      addEditorTabs () {
        this.tabs.push({
          name: +new Date() + '',
          title: `SQL_${this.tabs.length + 1}`,
          sql: '',
          type: TabsType.Editor,
        })
      },
      removeTabs(index: number) {
        this.tabs.splice(index, 1)
      },
      setActiveTabs (val: string) {
        this.activeTabs = val
      }
    },
  },
)

export function useSqlOutsideStore() {
  return useSqlStore(piniaStore)
}