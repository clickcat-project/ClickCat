<script lang='ts' setup>
import { onMounted, ref, watch } from 'vue'
import { CaretRight } from '@element-plus/icons-vue'
import * as monaco from 'monaco-editor'

import { defaultOptions } from './editorConfig'
import { themeCobalt } from './theme/Cobalt';
import createSqlCompleter from './utils/sql-completion'
import { TabItem } from '@/store/modules/sql/types';
import { useSqlStore } from '@/store';

let editorInstance: monaco.editor.IStandaloneCodeEditor

monaco.editor.defineTheme('cobalt', themeCobalt)

const global: any = {};
let timer: any = null

const getHints = (model: any) => {
  let id = model.id.substring(6);
  return (global[id] && global[id].hints) || [];
}

monaco.languages.registerCompletionItemProvider(
  "sql",
  createSqlCompleter(getHints) as any
);

const sqlStore = useSqlStore()
const props = defineProps<{
  tab: TabItem,
}>()

const emit = defineEmits(['change', 'queryAction'])

const editorRenderer = ref<HTMLElement>()

watch(() => props.tab.sql, (newVal) => {
  sqlStore.addSqlIsCommand && editorInstance.setValue(newVal as string)
})
onMounted(() => {
  initEditor()
})

const initEditor = () => {
  editorInstance = monaco.editor.create(editorRenderer.value as HTMLElement, {
    ...defaultOptions,
    language: 'sql',
    theme: 'vs'
  });
  editorInstance.setValue(props.tab.sql as string)
  editorInstance.focus()
  editorInstance.onDidChangeModelContent(() => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      emit('change', editorInstance.getValue())
    }, 300)
  });
}

const emitQueryAction = () => {
  emit('queryAction')
}
</script>
<template>
  <section class="simple-editor-container">
    <div class="run-sidebar">
      <span class="run-btn" @click="emitQueryAction">
        <el-icon>
          <CaretRight />
        </el-icon>
      </span>
    </div>
    <div ref="editorRenderer" :class="`editor-container-${tab.name} editor-container`"></div>
  </section>
</template>
<style lang='scss' scoped>
.simple-editor-container {
  position: relative;
  width: 100%;
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
