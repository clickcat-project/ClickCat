<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { ScrollbarInstance } from 'element-plus'

import { queryAllDatabases, queryAllColumns, queryAllTables } from './query'
import { createTree } from './utils'
import { ColumnCommand } from './types'
import tableImg from '@/assets/images/sql/table.svg'
import databaseImg from '@/assets/images/sql/database.svg'
import openInNewImg from '@/assets/icons/svg/open_in_new.svg'
import SvgIcon from '../SvgIcon/index.vue'
import { ElTreeV2 } from 'element-plus'
import { ColumnItem, DatabaseItem, TableItem } from './types'

const emit = defineEmits(['tableCommand'])
// const loginStore = useLoginStore()

const treeLoading = ref(false)
const tree = ref<any[]>([])
const defaultExpandKeys = ref<string[]>([])
const treeInstance = ref<InstanceType<typeof ElTreeV2>>()
const dataloading = ref<boolean>(false)
const dragEle = ref<HTMLElement>()
const treeContainerHeight = ref<number>()
const br = '\n'
const scrollBar = ref<ScrollbarInstance>()
const query = ref<string>()
const hideEmptyTables = ref<boolean>()

const filterTreeNodes = (query: string, node: any) => {  
  let show = true
  if (query != '') {
    const label = node.name
    show = show && label.includes(query)
  }
  if (hideEmptyTables.value && node.total_rows>=0) {
    const total_rows = node.total_rows
    show = show && (total_rows > 0)
  }
  return show
}

const onHideEmptyChanged = () => {
  const filter: string = query?.value !== undefined ? query?.value : ''
  onFilterChanged(filter)
}

const onFilterChanged = (query: string) => {
  // TODO: fix typing when refactor tree-v2
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  treeInstance.value?.filter(query)
}

onBeforeMount(() => {
  getTreeData()
})

onMounted(() => {
  const height = Number(document.querySelector('.tree-content')?.getBoundingClientRect().height)
  treeContainerHeight.value = height - 0
  // closeTooltip()
})

const getTreeData = () => {
  treeLoading.value = true
  
  Promise.all([queryAllColumns(), queryAllTables(), queryAllDatabases()])
    .then(res => {
      const dataArr = res.map(item => item.data)
      tree.value = createTree(
        dataArr[0],
        dataArr[1],
        dataArr[2]
      )
      defaultExpandKeys.value = [tree.value[0].name]
    })
    .finally(() => {
      treeLoading.value = false
    })
}

const clickCommand = (node: any, command: string) => {
  emit('tableCommand', {
    node,
    command
  })
}


const getDragEle = () => {
  return dragEle.value
}

const refreshTree = () => {
  getTreeData()
}

const shrinkAll = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  treeInstance.value?.setExpandedKeys([])
}

defineExpose({
  getDragEle
})
</script>

<template>
  <section
    v-loading="treeLoading"
    class="siderbar-content"
  >
    <div
      ref="dragEle"
      class="drag-box"
    ></div>
    <div
      v-if="dataloading"
      v-loading="true"
      class="loading"
    ></div>
    <div class="search-box">
      <el-input
        v-model="query"
        placeholder="Search for any name (e.g. columns)"
        @input="onFilterChanged"
      />
      <div class="search-btn">
        <el-icon color="#fff">
          <Search />
        </el-icon>
      </div>
    </div>
    <div class="search-checkbox">
      <el-checkbox
        v-model="hideEmptyTables"
        label="Hide empty tables"
        size="large"
        @change="onHideEmptyChanged"
      />
    </div>
    <div class="tree-content">
      <el-scrollbar
        ref="scrollBar"
        :noresize="true"
      >
        <el-tree-v2
          ref="treeInstance"
          :filter-method="filterTreeNodes"
          :data="tree"
          node-key="name"
          :default-expanded-keys="defaultExpandKeys"
          render-after-expand
          auto-expand-parent
          :props="{children: 'children', label: 'name', value: 'name'}"
          :expand-on-click-node="false"
          :height="treeContainerHeight"
        >
          <template #default="{ node }">
            <template v-if="node.data.database && !node.data.table">
              <span
                class="custom-tree-node has-dropdown"
              >
                <img
                  :src="tableImg"
                  alt=""
                >
                <span>{{ node.label }}</span>
                <img
                  :src="openInNewImg"
                  class="open-btn"
                  alt=""
                  @click="() => clickCommand(node, ColumnCommand.OpenTable)"
                >
              </span>
            </template>
            <template v-else-if="node.data.database && node.data.table">
              <span
                :id="`${node.data.database}-${node.data.table}-${node.label}`"
                class="custom-tree-node has-dropdown"
              >
                <span>{{ node.label }}</span>
              </span>
              <span class="column-type">{{ node.data.type }}</span>
              <div :class="`absolute-back ${node.data.selected ? 'active' : ''}`"></div>
            </template>
            <template v-else>
              <span class="custom-tree-node">
                <img
                  :src="databaseImg"
                  alt=""
                >
                <span>{{ node.label }}</span>
              </span>
              <span
                v-if="!node.data.isRoot"
                class="suffix"
              >{{ node.data.children.length }}</span>
              <span
                v-else
                class="root-btn"
              >
                <el-icon
                  color="#C4C4C4"
                  :size="16"
                  @click="refreshTree"
                ><Refresh /></el-icon>
                <SvgIcon
                  name="svg-shrink"
                  color="#C4C4C4"
                  size="smaller"
                  @click="shrinkAll"
                ></SvgIcon>
              </span>
            </template>
          </template>
        </el-tree-v2>
      </el-scrollbar>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.siderbar-content {
  position: relative;
  height: 100%;
  padding: 30px 10px;
  box-sizing: border-box;
  --el-mask-color: #10223E;
  .drag-box {
    position: absolute;
    right: 4px;
    top: calc(50% - 15px);
    width: 8px;
    height: 30px;
    border-left: 3px solid rgba(255, 255, 255, 0.2);
    border-right: 3px solid rgba(255, 255, 255, 0.2);
    box-sizing: border-box;
    cursor: ew-resize;
  }
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // background-color: rgba(0,0,0, .6);
    z-index: 3000;

    // :deep(.el-loading-mask) {
    //   background-color: unset;
    // }
  }
  .el-tree {
    background-color: unset;
  }
  .custom-tree-node {
    display: flex;
    color: rgba(255, 255, 255, .85);
    img {
      margin-right: 3px;
    }
  }
  // :deep(.no-back > .el-tree-node__content){
  //   height: 56px;
  //   background-color: unset;
  // }
}
.filter-select :deep(.el-select-v2__wrapper) {
  border-radius: unset;
  border-bottom-left-radius: 4px;
  border-top-left-radius: 4px;
  background-color: rgba(255, 255, 255, .2);
  box-shadow: unset;
  border-color: rgba(255, 255, 255, 0.2);
}
.filter-select :deep(.el-select-v2__suffix) {
  display: none;
}
.filter-select :deep(.el-select-v2__combobox-input) {
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
.search-checkbox {
  display: flex;
  justify-content: left;
  align-items: left;
  height: 32px;
}
.custom-tree-node {
  position: relative;
  font-size: 16px;
  z-index: 2;
}
.tree-content {
  height: calc(100% - 32px);
  overflow-y: auto;

  :deep(.el-tree-node__content) {
    background-color: unset;
  }
  .suffix {
    position: absolute;
    top: 0px;
    right: 0px;
    color: rgba(255, 255, 255, 0.45);
    z-index: 2;
  }
  .column-type {
    margin-left: 20px;
    color: rgba(255, 255, 255, 0.45);
  }

  .root-btn {
    position: absolute;
    top: 5px;
    right: 0px;
    display: flex;
    z-index: 2;

    *:hover {
      color: var(--el-color-primary) !important;
    }
  }
  .absolute-back {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .absolute-back.active{
    background: rgba(255, 179, 0, 0.1);
  }
  :deep(.el-tree-node__content i) {
    position: relative;
    z-index: 2;
  }
  .open-btn {
    margin-left: 2px;

    *:hover {
      color: var(--el-color-primary) !important;
    }
  }
}
</style>
