<route>
{
  name: "Processes",
  meta: { title: 'Processes' }
}
</route>
<script lang='ts' setup>
import { ref } from 'vue'
import { Close, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import CommonTableVue from '@/components/CommonTable.vue'
import { queryProcesses, queryMutations } from '@/components/processes/query'
import { query } from '@/utils/http'

type ListItem = {
  name: string,
  database: string,
  table: string,
  query_id: string,
  mutation_id: string
}

const processesRef = ref<any>(null)
const mutationsRef = ref<any>(null)
const defaultCard = ref('Processes')
let selectedProcesses: ListItem[] = []
let selectedMutations: ListItem[] = []

const changeProcesses = (val: ListItem[]) => {
  selectedProcesses = val
}
const changeMutations = (val: ListItem[]) => {
  selectedMutations = val
}

const kill = async () => {
  let sql = ''
  if (defaultCard.value === 'Processes') {
    if (!selectedProcesses.length) {
      return ElMessage({
        message: 'Please select at least one piece of "Processes" data.',
        grouping: true,
        type: 'error',
      })
    }
    const idArr = selectedProcesses.map(item => {
      return `query_id ='${item.query_id}'`
    })
    // KILL QUERY WHERE query_id='2-857d-4a57-9ee0-327da5d60a90' or  query_id='2-857d-4a57-9ee0-327da5d60a90'
    sql = `KILL QUERY WHERE ${idArr?.join(' or ')}`
  } else if (defaultCard.value === 'Mutations') {
    if (!selectedProcesses.length) {
      return ElMessage({
        message: 'Please select at least one piece of "Mutations" data.',
        grouping: true,
        type: 'error',
      })
    }
    // KILL MUTATION WHERE database = 'default' AND table = 'table' AND mutation_id = 'mutation_3.txt'
    const idArr = selectedMutations.map(item => {
      return `database = '${item.database}' AND table = '${item.table}' AND mutation_id='${item.mutation_id}'`
    })
    sql = `KILL MUTATION WHERE ${idArr?.join(' or ')}`
  }
  await ElMessageBox.confirm(
    'Kill selected data?',
    'Kill',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
      customClass: 'show-custom-primary-color',
    }
  )
  await query(sql)
  if (defaultCard.value === 'Processes') {
    await processesRef.value.refresh()
  } else {
    await mutationsRef.value.refresh()
  }
}

const refresh = () => {
  if (defaultCard.value === 'Processes') {
    processesRef.value.refresh()
  } else {
    mutationsRef.value.refresh()
  }
}
</script>
<template>
  <section class="processes-container">
    <section class="table-btn">
      <div
        class="btn"
        @click="kill"
      >
        <el-icon
          color="#FF4D4F"
          style="margin-right: 8px;"
        >
          <Close />
        </el-icon>
        <span>Kill</span>
      </div>
      <el-divider direction="vertical" />
      <div
        class="btn"
        @click="refresh"
      >
        <el-icon
          color="#59595F"
          style="margin-right: 8px;"
        >
          <Refresh />
        </el-icon>
        <span>Refresh</span>
      </div>
    </section>
    <el-tabs
      v-model="defaultCard"
      type="border-card"
    >
      <el-tab-pane
        label="Processes"
        name="Processes"
      >
        <CommonTableVue
          ref="processesRef"
          :query-func="queryProcesses"
          @selection-change="changeProcesses"
        ></CommonTableVue>
      </el-tab-pane>
      <el-tab-pane
        label="Mutations"
        :lazy="true"
        name="Mutations"
      >
        <CommonTableVue
          ref="mutationsRef"
          :query-func="queryMutations"
          @selection-change="changeMutations"
        ></CommonTableVue>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<style lang='scss' scoped>
.processes-container {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px 30px;
  background-color: #f8f8f8;
  box-sizing: border-box;

  .table-btn {
    position: absolute;
    right: 60px;
    top: 20px;
    display: flex;
    height: 39px;
    display: flex;
    align-items: center;
    z-index: 10;

    & > div.btn {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    span {
      font-size: 14px;
      color: rgba(62, 62, 69, 0.65);
    }
  }

  & > .el-tabs--border-card {
    border: unset;
  }
  & > .el-tabs {
    width: 100%;
    height: 100%;
  }

  :deep(.el-tabs--border-card>.el-tabs__header) {
    background-color: #f0f0f0;
  }

  :deep(.el-tabs__content) {
    min-height: calc(100% - 36px);
    height: calc(100% - 36px);
    box-sizing: border-box;
  }

  :deep(.el-tab-pane) {
    height: 100%;
  }
  :deep(.el-tabs--border-card>.el-tabs__header .el-tabs__item) {
    border: unset;
  }
  :deep(.el-tabs__item) {
    background-color: #E1E0DD;
  }
  :deep(.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active) {
    background-color: #FFB300;
    color: #fff;
  }
  :deep(.el-popper) {
    max-width: 600px;
  }
  :deep(.el-table th.el-table__cell) {
    background-color: #fbfbfb;
  }
}
</style>
