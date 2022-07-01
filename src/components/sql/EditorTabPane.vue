<script lang='ts' setup>
import { ref } from 'vue'

import SimpleEditorVue from './SimpleEditor.vue';
import EditorTabPaneTableVue from './EditorTabPaneTable.vue';
import { TabItem } from '@/store/modules/sql/types';
import { useSqlStore } from '@/store';
import { query } from '@/utils/http';
import { Statistics } from './types';
import { ExportData } from './ExportData';

const sqlStore = useSqlStore()

const props = defineProps<{
  tab: TabItem
}>()

const columns = ref<{name: string}[]>([])
const tableData = ref<any[]>([])
const statistics = ref<Statistics>()
const editorContainerRef = ref<HTMLElement>()
const reloadSomeElement = ref<boolean>(true)

const changeValue = (val: string) => {
  sqlStore.setCurrentTab({
    ...props.tab,
    sql: val
  })
}

const queryTableData = (rows = 100) => {
  const sql = props.tab.sql + ` limit ${rows} FORMAT JSON`
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
      console.log(statistics.value)
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
  <section ref="editorContainerRef" class="editor-tab-pane-container">
    <template v-if="reloadSomeElement">
      <SimpleEditorVue :tab="tab" @change="changeValue" @query-action="queryTableData" />
      <EditorTabPaneTableVue
        :columns="columns"
        :table-data="tableData"
        :statistics="statistics"
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
