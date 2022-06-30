<script lang='ts' setup>
import { computed, ref } from 'vue'
import { useSqlStore } from '@/store';

import { TabsType } from './types'

import EditorTabPane from './EditorTabPane.vue'

const sqlStore = useSqlStore()

const tabs = computed(() => {
  return sqlStore.tabs
})

const editableTabsValue = ref<string>()
const tabType = TabsType

const handleTabsEdit = () => {

}
const changeTabs = () => {

}
</script>
<template>
  <section class="editor-tabs-container">
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      editable
      class="demo-tabs"
      @tab-change="changeTabs"
      @edit="handleTabsEdit"
    >
      <el-tab-pane
        v-for="item in tabs"
        :key="item.name"
        :label="item.name"
        :name="item.name"
      >
        <EditorTabPane v-if="item.type === tabType.Editor" />
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<style lang='scss' scoped>
.editor-tabs-container {
  width: 100%;
  height: 100%;
}
</style>
