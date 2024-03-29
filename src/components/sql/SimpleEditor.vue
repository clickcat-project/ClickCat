<script lang='ts' setup>
import { onMounted, ref, watch } from 'vue'
import { CaretRight } from '@element-plus/icons-vue'
import * as monaco from 'monaco-editor'

import { defaultOptions } from './editorConfig'
import { themeCobalt } from './theme/Cobalt'
import createSqlCompleter from './utils/sql-completion'
import { TabItem } from '@/store/modules/sql/types'
import { useSqlStore } from '@/store'
import { queryAllColumns, queryAllTables } from './query'
import { error } from 'console'

let editorInstance: monaco.editor.IStandaloneCodeEditor

monaco.editor.defineTheme('cobalt', themeCobalt)

const global: any = {}
let timer: any = null

const getHints = (model: any) => {
  let id = model.id.substring(6)
  return (global[id] && global[id].hints) || []
}

const sqlStore = useSqlStore()
const props = defineProps<{
  tab: TabItem,
}>()

const emit = defineEmits(['change', 'queryAction'])

const editorRenderer = ref<HTMLElement>()
const simpleEditorContainer = ref<HTMLElement>()

watch(() => props.tab.sql, (newVal) => {
  sqlStore.addSqlIsCommand && editorInstance.setValue(newVal as string)
})

onMounted(() => {
  // try {
  //   await 
  // } catch (err) {
  //   console.log(err)
  // }
  setHints()
  initEditor()
})

const setHints = async () => {
  const res = await queryAllTables()
  const columnsRes = await queryAllColumns()
  // const database = res.data.map((item: any) => item.database)
  // const databaseDotTable = res.data.map((item: any) => `${item.database}.${item.name}`)
  // const realdata = sqlStore.visitNumber !== 1 ? [] : [...database, ...databaseDotTable]
  await registerTable(res.data, columnsRes.data)
}

const initEditor = () => {
  editorInstance = monaco.editor.create(editorRenderer.value as HTMLElement, {
    ...defaultOptions,
    language: 'sql',
    theme: 'vs'
  })
  editorInstance.setValue(props.tab.sql as string)
  editorInstance.focus()
  editorInstance.onDidChangeModelContent(() => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      emit('change', editorInstance.getValue())
    }, 300)
  })
}

const emitQueryAction = () => {
  emit('queryAction')
}

const getEditorContainer = () => {
  return simpleEditorContainer.value
}

const registerTable = async (table: any[], columns: any[]) => {
  // registerCompletionItemProvider
  monaco.languages.registerCompletionItemProvider(
    'sql',
    createSqlCompleter(getHints, table, columns) as any
  )
}

const getSelectionValue = () => {
  // editorInstance.getModel().getValueInRange(editorInstance.getSelection())
  return editorInstance.getModel()?.getValueInRange(editorInstance.getSelection() as monaco.IRange)
}

defineExpose({
  getEditorContainer,
  registerTable,
  getSelectionValue
})
</script>
<template>
  <section
    ref="simpleEditorContainer"
    class="simple-editor-container"
  >
    <div class="run-sidebar">
      <span
        class="run-btn"
        @click="emitQueryAction"
      >
        <el-icon>
          <CaretRight />
        </el-icon>
      </span>
    </div>
    <div
      ref="editorRenderer"
      :class="`editor-container-${tab.name} editor-container`"
    ></div>
  </section>
</template>
<style lang='scss' scoped>
.simple-editor-container {
  position: relative;
  width: calc(100% - 1px);
  height: 100%;
  padding-top: 10px;
  padding-left: 36px;
  text-align: left;
  background-color: #fff;
  box-sizing: border-box;

  .run-sidebar {
    position: absolute;
    left: 0;
    top: 0;
    width: 36px;
    height: 100%;
    background-color: #F0F0F0;
    box-sizing: border-box;
    border: 1px solid #E2E2E2;

    .run-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 33px;
      border-bottom: 1px solid #D8D8D8;
      cursor: pointer;

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
}
.editor-container {
  height: 100%;
}
</style>
