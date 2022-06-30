<script lang='ts' setup>
import { onMounted } from 'vue'
import * as monaco from 'monaco-editor'

import { defaultOptions } from './editorConfig'
import { themeCobalt } from './theme/Cobalt';
import createSqlCompleter from './utils/sql-completion'

let editorInstance: monaco.editor.IStandaloneCodeEditor

monaco.editor.defineTheme('cobalt', themeCobalt)

const global: any = {};

const getHints = (model: any) => {
  let id = model.id.substring(6);
  return (global[id] && global[id].hints) || [];
}

monaco.languages.registerCompletionItemProvider(
  "sql",
  createSqlCompleter(getHints) as any
);

onMounted(() => {
  initEditor()
})

const initEditor = () => {
  editorInstance = monaco.editor.create(document.querySelector('.editor-container') as HTMLElement, {
    ...defaultOptions,
    language: 'sql'
  });
}
</script>
<template>
  <section class="simple-editor-container">
    <div class="editor-container"></div>
  </section>
</template>
<style lang='scss' scoped>
.simple-editor-container {
  width: 100%;
  height: 330px;
}
.editor-container {
  height: 330px
}
</style>
