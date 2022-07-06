<script setup lang="ts">
import { onBeforeMount, onMounted, reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

import { useSqlStore } from '@/store/modules/sql';

import { queryAllDatabases, queryAllColumns, queryAllTables } from './query'
import { createTree } from './utils'
import { ColumnCommand } from './types'

const sqlStore = useSqlStore()
const emit = defineEmits(['tableCommand'])

const columns = ref<any[]>([])
const tree = ref<any[]>([])
const defaultExpandKeys = ref<string[]>([])
const br = '\n';

onBeforeMount(() => {
  Promise.all([queryAllColumns(), queryAllTables(), queryAllDatabases()])
    .then(res => {
      const dataArr = res.map(item => item.data)
      columns.value = dataArr[0]
      tree.value = createTree(
        dataArr[0],
        dataArr[1],
        dataArr[2]
      )
      defaultExpandKeys.value = [tree.value[0].name]
    })
})

const clickCommand = (node: any, command: string) => {
  emit('tableCommand', {
    node,
    command
  })
}

const loadChildren = (node: any, resolve: (val: any) => void) => {
  if (node.data.children) {
    resolve(node.data.children)
  }
}
</script>

<template>
  <section class="siderbar-content">
    <div class="search-box">
      <el-select filterable placeholder="Select" class="filter-select">
        <el-option
          v-for="item in columns"
          :key="item.name"
          :label="item.name"
          :value="item.name"
        >
        <span>{{ item.name }}</span>
        </el-option>
      </el-select>
      <div class="search-btn">
        <el-icon color="#fff">
          <Search />
        </el-icon>
      </div>
    </div>
    <div class="tree-content">
      <el-tree
        :data="tree"
        node-key="name"
        :default-expanded-keys="defaultExpandKeys"
        render-after-expand
        lazy
        :load="loadChildren"
        auto-expand-parent
        :props="{children: 'children', label: 'name', class: () => 'no-back'}"
        :expand-on-click-node="false"
      >
        <template #default="{ node, data }">
          <template v-if="node.data.database && !node.data.table">
            <el-tooltip
              class="box-item"
              effect="dark"
              popper-class="click-cat-dark"
              :content="`${node.data.engine}${br}${node.data.size}`"
              placement="right"
            >
              <el-dropdown trigger="contextmenu" @command="(command) => clickCommand(node, command)" popper-class="dark">
                <span class="custom-tree-node has-dropdown">
                  <span>{{ node.label }}</span>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="ColumnCommand.OpenTable">Open table</el-dropdown-item>
                    <el-dropdown-item :command="ColumnCommand.MakeSelect">Make SELECT</el-dropdown-item>
                    <el-dropdown-item :command="ColumnCommand.MakeSqlDescribe">Make SQL Describe</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-tooltip>
          </template>
          <template v-else-if="node.data.database && node.data.table">
             <el-tooltip
              class="box-item"
              effect="dark"
              popper-class="click-cat-dark"
              :content="`${node.data.name}${br}${node.data.type}${node.data.defaultType ? `${br}${node.data.defaultType}`:''}`"
              placement="right"
            >
              <span class="custom-tree-node has-dropdown">
                <span>{{ node.label }}</span>
              </span>
            </el-tooltip>
          </template>
          <span v-else class="custom-tree-node">
            <span>{{ node.label }}</span>
          </span>
        </template>
      </el-tree>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.siderbar-content {
  height: 100%;
  padding: 30px 10px;
  box-sizing: border-box;
  .el-tree {
    background-color: unset;
  }
  .custom-tree-node {
    color: rgba(255, 255, 255, .85);
  }
  :deep(.no-back > .el-tree-node__content){
    height: 56px;
    background-color: unset;
  }
}
.filter-select :deep(.el-input__wrapper) {
  border-radius: unset;
  border-bottom-left-radius: 4px;
  border-top-left-radius: 4px;
  background-color: rgba(255, 255, 255, .2);
  box-shadow: unset;
}
.filter-select :deep(.el-input__suffix) {
  display: none;
}
.filter-select :deep(.el-input__inner) {
  color: #fff;
}
.search-box {
  display: flex;
  width: 100%;
}
.filter-select {
  flex-grow: 1;
}
.el-select.filter-select :deep(.el-input.is-focus .el-input__wrapper) {
  box-shadow: unset !important;
}
.search-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 46px;
  height: 32px;
  background-color: var(--el-color-primary);
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
}
.custom-tree-node {
  font-size: 14px;
  line-height: 56px;
}
.tree-content {
  height: calc(100% - 32px);
  overflow-y: auto;
}
</style>
