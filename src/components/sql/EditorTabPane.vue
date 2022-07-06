<script lang='ts' setup>
import { ref, onMounted } from 'vue'

import SimpleEditorVue from './SimpleEditor.vue'
import EditorTabPaneTableVue from './EditorTabPaneTable.vue'
import { TabItem } from '@/store/modules/sql/types'
import { useSqlStore } from '@/store'
import { query } from '@/utils/http'
import { Statistics } from './types'
import { ExportData } from './ExportData'

const sqlStore = useSqlStore()

const props = defineProps<{
  tab: TabItem
}>()

const columns = ref<{name: string}[]>([])
const tableData = ref<any[]>([])
const statistics = ref<Statistics>()
const editorContainerRef = ref<HTMLElement>()
const reloadSomeElement = ref<boolean>(true)
const editorTabPaneTableInstance = ref<any>()
const simpleEditorInstance = ref<any>()

onMounted(() => {
  const dragElement = editorTabPaneTableInstance.value.getDragElement() as HTMLElement
  const editorContainer = simpleEditorInstance.value.getEditorContainer() as HTMLElement
  const container = editorContainerRef.value as HTMLElement
  dragElement.onmousedown = (e) => {
    const oldY = e.clientY
    const editorHight = editorContainer.getBoundingClientRect().height
    document.onmousemove = (e) => {
      const currentY = e.clientY
      const result = currentY - oldY
      container.style.cssText = `grid-template-rows: ${editorHight + result}px 1fr;`
    }
    document.onmouseup = () => {
      document.onmousemove = null
    }
  }
})

const changeValue = (val: string) => {
  sqlStore.setCurrentTab({
    ...props.tab,
    sql: val
  })
}

const queryTableData = (rows = 100) => {
  const originSql = props.tab.sql
  const sql = originSql + ` limit ${rows} FORMAT JSON`
  originSql && sqlStore.addHistorySql(originSql)
  query(sql)
    .then(res => {
      columns.value = res.meta
      tableData.value = res.data
      const { bytes_read, elapsed, rows_read } = res.statistics
      statistics.value = {
        bytes_read: +(bytes_read / 1024).toFixed(1),
        elapsed: elapsed.toFixed(2),
        rows_read
      }
    })
}
const exportDataFunc = (command: string) => {
  ExportData(tableData.value, command, props.tab.title as string)
}

const fullScreen = async () => {
  reloadSomeElement.value = false
  if (document.fullscreenElement) {
    await document.exitFullscreen()
  } else {
    await editorContainerRef.value?.requestFullscreen()
  }
  reloadSomeElement.value = true
}
</script>
<template>
  <section
    ref="editorContainerRef"
    class="editor-tab-pane-container"
  >
    <template v-if="reloadSomeElement">
      <SimpleEditorVue
        ref="simpleEditorInstance"
        :tab="tab"
        @change="changeValue"
        @query-action="queryTableData"
      />
      <EditorTabPaneTableVue
        ref="editorTabPaneTableInstance"
        :columns="columns"
        :table-data="tableData"
        :statistics="statistics"
        :drag-ele="editorContainerRef"
        @change-rows="queryTableData"
        @export="exportDataFunc"
        @full-screen="fullScreen"
      />
    </template>
  </section>
</template>
<style lang='scss' scoped>
.editor-tab-pane-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 330px 1fr;
  height: 100%;
  width: 100%;
}
</style>
