<route>
{
  name: "SQL",
  meta: { title: 'SQL' }
}
</route>
<script lang='ts' setup>
import { onMounted, ref } from 'vue'

import FilterVue from '@/components/sql/Filter.vue'
// import SimpleEditorVue from '@/components/sql/SimpleEditor.vue'
import EditorTabsVue from '@/components/sql/EditorTabs.vue'
import { useSqlStore } from '@/store'
import { ColumnCommand } from '@/components/sql/types'
import { getSqlDescribe, getMakeSelectSql } from '@/components/sql/utils'

const sqlStore = useSqlStore()

const filterInstance = ref<any>()
const filterContainer = ref<HTMLElement>()
const sqlContainer = ref<HTMLElement>()

onMounted(() => {
  const dragElement = filterInstance.value.getDragEle() as HTMLElement
  const editorContainer = filterContainer.value as HTMLElement
  const container = sqlContainer.value as HTMLElement
  dragElement.onmousedown = (e) => {
    const oldX = e.clientX
    const editorWidth = editorContainer.getBoundingClientRect().width
    document.onmousemove = (e) => {
      const currentX = e.clientX
      const result = currentX - oldX
      container.style.cssText = `grid-template-columns: ${editorWidth + result}px 1fr;`
    }
    document.onmouseup = () => {
      document.onmousemove = null
    }
  }
})

const tableCommand = ({node, command}: any) => {
  const current = sqlStore.tabs.find(tab => tab.name === sqlStore.activeTabs)
  sqlStore.toggleAddSqlIsCommand()
  // current && (current.sql = '123')
  const oldSql = current?.sql || ''
  let newSql = ''
  switch (command) {
    case ColumnCommand.MakeSelect:
      newSql = getMakeSelectSql(node.data)
      current && (current.sql = oldSql + newSql)
      setTimeout(() => sqlStore.toggleAddSqlIsCommand())
      break
    case ColumnCommand.OpenTable:
      sqlStore.addTableTabs(node.data)
      break
    case ColumnCommand.MakeSqlDescribe:
      getSqlDescribe(node.data)
        .then(data => {
          newSql = data
          current && (current.sql = oldSql + newSql)
          setTimeout(() => sqlStore.toggleAddSqlIsCommand())
        })
      break  
  }
}
</script>
<template>
  <section
    ref="sqlContainer"
    class="SQL-container"
  >
    <aside
      ref="filterContainer"
      class="sidebar"
    >
      <FilterVue
        ref="filterInstance"
        @tableCommand="tableCommand"
      />
    </aside>
    <section class="content">
      <EditorTabsVue />
    </section>
  </section>
</template>
<style lang='scss' scoped>
.SQL-container {
  display: grid;
  grid-template-columns: 290px 1fr;
  grid-template-rows: 1fr;
  width: 100%;
  height: 100%;

  & > aside.sidebar {
    height: 100%;
    background-color: #10223E;
    overflow-y: auto;
  }
  & > section.content {
    position: relative;
    height: 100%;
    background-color: #fff;
  }
}
</style>
