<script lang='ts' setup>
import { computed, onBeforeMount, ref } from 'vue'
import { useSqlStore } from '@/store'

import { TabsType } from './types'

import EditorTabPane from './EditorTabPane.vue'
import TableTabPane from './TableTabPane.vue'

const sqlStore = useSqlStore()

const tabs = computed(() => {
  return sqlStore.tabs
})

const editableTabsValue = ref<string>()
const tabType = TabsType

onBeforeMount(() => {
  const currentActive = tabs.value.find(item => item.name === sqlStore.activeTabs)
  if (currentActive) {
    editableTabsValue.value = sqlStore.activeTabs
  } else {
    editableTabsValue.value = tabs.value[0].name
    sqlStore.setActiveTabs(tabs.value[0].name)
  }
})

const changeTabs = (val: any) => {
  sqlStore.setActiveTabs(val)
}
const addTabs = () => {
  sqlStore.addEditorTabs()
  const name = tabs.value[tabs.value.length - 1].name
  sqlStore.setActiveTabs(name)
  editableTabsValue.value = name
}
const removeTabs = (val: any) => {
  if (tabs.value.length === 1) return
  const index = tabs.value.findIndex(item => item.name === val)
  if (index > 0) {
    const activetabIndex = tabs.value.findIndex(item => item.name === sqlStore.activeTabs)
    if (activetabIndex === index) {
      const activeTab = tabs.value[index - 1]
      editableTabsValue.value = activeTab.name
      sqlStore.setActiveTabs(activeTab.name)
    }
    sqlStore.removeTabs(index)
  }
}
</script>
<template>
  <section class="editor-tabs-container">
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      editable
      class="editor-tabs"
      @tab-remove="removeTabs"
      @tab-add="addTabs"
      @tab-change="changeTabs"
    >
      <el-tab-pane
        v-for="item in tabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
        :class="`tabs-${item.name}`"
        lazy
      >
        <EditorTabPane
          v-if="item.type === tabType.Editor"
          :tab="item"
        />
        <TableTabPane
          v-else
          :tab="item"
        />
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<style lang='scss' scoped>
.editor-tabs-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .editor-tabs {
    height: 100%;
  }
  .el-tabs--card.editor-tabs > :deep(.el-tabs__header) {
    margin-bottom: 0;
  }
  .el-tabs--card.editor-tabs > :deep(.el-tabs__header .el-tabs__nav) {
    border: unset;
  }
  .el-tabs--card.editor-tabs > :deep(.el-tabs__header .el-tabs__item.is-active) {
    border: unset;
  }
  .el-tabs--card.editor-tabs > :deep(.el-tabs__header .el-tabs__nav-wrap) {
    background: #f0f0f0;
  }
  .el-tabs--card.editor-tabs > :deep(.el-tabs__content) {
    width: 100%;
    height: calc(100% - 41px);
  }
  .el-tabs--card.editor-tabs > :deep(.el-tabs__content > .el-tab-pane) {
    height: 100%;
  }
  .el-tabs--card.editor-tabs :deep(.el-tabs__new-tab) {
    margin: 10px 10px 0 10px;
    border: unset;
  }
}

</style>