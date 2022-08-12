<script lang='ts' setup>
import { onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import * as echarts from 'echarts/core'
import type { FormInstance, FormRules } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'

import sqls from '@/components/metrics/dataAnalysis/sqls'
import { query } from '@/utils/http'
import { formatBarOptions, generateBarInstance } from '@/components/metrics/charts/useBar'
import i18n from '@/i18n'

type List = {name: string}[]
type Link = {
  id: string,
  source_node: string,
  source_link_field: string,
  target_node: string,
  target_link_field: string,
  relationship: string

}

const emit = defineEmits(['toResult', 'toList'])

const t = i18n.global.t
const renderer = ref<HTMLElement>()
const ruleFormRef = ref<FormInstance>()
const database = ref<List>([])
const tables = ref<List>([])
const checkedList = ref<string[]>([])
const formLabelAlign = reactive<{
  database: string,
  jobName: string,
  desc: string,
  nodes: {primary: string, table: string, check: boolean, id: string}[]
  links: Link[]
}>({
  database: '',
  jobName: '',
  desc: '',
  nodes: [
    {
      id: '1',
      table: '1',
      primary: '2',
      check: false
    },
    {
      id: '1',
      table: '1',
      primary: '2',
      check: false
    },
    {
      id: '1',
      table: '1',
      primary: '2',
      check: false
    }
  ],
  links: [
    {
      id: '1',
      source_node: '1',
      source_link_field: '2',
      target_node: '1',
      target_link_field: '1',
      relationship: ''
    },
    {
      id: '2',
      source_node: '1',
      source_link_field: '2',
      target_node: '1',
      target_link_field: '1',
      relationship: ''
    },
    {
      id: '3',
      source_node: '1',
      source_link_field: '2',
      target_node: '1',
      target_link_field: '1',
      relationship: ''
    }
  ]
})

const rules = reactive<FormRules>({
  database: [
    { required: true, message: t('Please select database'), trigger: 'change' }
  ],
  jobName: [
    { required: true, message: t('Please input job name'), trigger: 'blur' }
  ]
})

let chartInstance: echarts.ECharts

onBeforeMount(() => {
  queryDatabases()
})

onMounted(() => {
  if (renderer.value) {
    chartInstance = generateBarInstance(renderer.value)
    chartInstance.setOption(formatBarOptions())
  }
})

const nextStep = async () => {
  await ruleFormRef.value?.validate((valid, fields) => {
    if (!valid) {
      console.log('error submit!', fields)
    }
  })
  emit('toResult')
}

const queryDatabases = () => {
  query(sqls.queryAllDatabases())
    .then(res => {
      database.value = res.data
    })
}

const changeDatabase = () => {
  console.log('change database')
  queryTables()
}

const toList = () => {
  emit('toList')
}

const queryTables = () => {
  query(sqls.queryTablesByDatabase(formLabelAlign.database))
    .then(res => {
      tables.value = res.data
    })
}

const changeTable = () => {
  console.log('change table')
}

const queryField = () => {
  console.log('queryField')
}

const addLinks = () => {
  formLabelAlign.links.push({
    id: +new Date() + '',
    source_node: '1',
    source_link_field: '2',
    target_node: '1',
    target_link_field: '1',
    relationship: ''
  })
}
const deleteLink = (id: string) => {
  const index = formLabelAlign.links.findIndex(item => item.id === id)
  if (index < 0) return
  formLabelAlign.links.splice(index, 1)
}
</script>
<template>
  <section class="graph-add-container">
    <h3 class="title">
      <el-icon
        style="margin-right: 10px"
        @click="toList"
      >
        <ArrowLeft />
      </el-icon>
      {{ $t('Add') }}
    </h3>
    <el-form
      ref="ruleFormRef"
      label-position="right"
      label-width="110px"
      :rules="rules"
      :model="formLabelAlign"
      class="ml-add-form"
      style="width: 100%"
      status-icon
    >
      <el-form-item
        :label="$t('Job Name')"
        prop="jobName"
      >
        <el-input
          v-model="formLabelAlign.jobName"
          style="width: 600px"
          placeholder="Please input"
        />
      </el-form-item>

      <el-form-item
        :label="$t('Describe')"
        prop="desc"
      >
        <el-input
          v-model="formLabelAlign.desc"
          style="width: 600px"
          type="textarea"
          placeholder="Please input"
        />
      </el-form-item>

      <el-form-item
        :label="$t('Database')"
        prop="database"
      >
        <el-select
          v-model="formLabelAlign.database"
          popper-class="primary-select-dropdown"
          placeholder="Select Database"
          @change="changeDatabase"
        >
          <el-option
            v-for="item in database"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        :label="$t('Nodes')"
        prop="nodes"
      >
        <el-table
          :data="formLabelAlign.nodes"
          style="width: 100%"
        >
          <el-table-column
            prop="check"
            label="Check"
          >
            <template #default="scope">
              <el-checkbox v-model="scope.row.check" />
            </template>
          </el-table-column>
          <el-table-column
            prop="table"
            label="Table"
          >
            <template #default="scope">
              <el-select
                v-model="scope.row.table"
                popper-class="primary-select-dropdown" 
                placeholder="Select Table"
                filterable
                @change="changeTable"
              >
                <el-option
                  v-for="item in tables"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="primary"
            label="Field"
          >
            <template #default="scope">
              <el-select
                v-model="scope.row.primary"
                popper-class="primary-select-dropdown" 
                placeholder="Select Field"
                filterable
              >
                <el-option
                  v-for="item in tables"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item
        :label="$t('Links')"
        prop="links"
      >
        <el-table
          :data="formLabelAlign.links"
          style="width: 100%;"
        >
          <el-table-column
            prop="source_node"
            label="source_node"
          >
            <template #default="scope">
              <el-select
                v-model="scope.row.source_node"
                popper-class="primary-select-dropdown" 
                placeholder="Select source_node"
                filterable
              >
                <el-option
                  v-for="item in tables"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="source_link_field"
            label="source_link_field"
          >
            <template #default="scope">
              <el-select
                v-model="scope.row.source_link_field"
                popper-class="primary-select-dropdown" 
                placeholder="Select Field"
                filterable
              >
                <el-option
                  v-for="item in tables"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="target_node"
            label="target_node"
          >
            <template #default="scope">
              <el-select
                v-model="scope.row.target_node"
                popper-class="primary-select-dropdown" 
                placeholder="Select Field"
                filterable
              >
                <el-option
                  v-for="item in tables"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="target_link_field"
            label="target_link_field"
          >
            <template #default="scope">
              <el-select
                v-model="scope.row.target_link_field"
                popper-class="primary-select-dropdown" 
                placeholder="Select Field"
                filterable
              >
                <el-option
                  v-for="item in tables"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="relationship"
            label="relationship"
          >
            <template #default="scope">
              <el-select
                v-model="scope.row.relationship"
                popper-class="primary-select-dropdown" 
                placeholder="Select Field"
                filterable
              >
                <el-option
                  v-for="item in tables"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="operation"
          >
            <template #default="scope">
              <span
                class="link-del-btn"
                @click="deleteLink(scope.row.id)"
              >{{ $t('delete') }}</span>
            </template>
          </el-table-column>
        </el-table>
        <span
          class="add-link-btn"
          @click="addLinks"
        >
          <el-icon :size="14">
            <Plus />
          </el-icon>
        </span>
      </el-form-item>
    </el-form>

    <section class="btn">
      <el-button
        class="custom-primary-btn"
        type="primary"
        @click="nextStep"
      >
        {{ ('End') }}
      </el-button>
    </section>
  </section>
</template>
<style lang='scss' scoped>
.graph-add-container {
  position: relative;
  width: 100%;
  min-height: 100%;
  padding: 0 30px 30px 30px;
  background-color: #fff;
  box-sizing: border-box;

  .btn {
    position: absolute;
    bottom: 30px;
    width: 100%;
    text-align: center;
  }

  .title {
    display: flex;
    align-items: center;
    height: 60px;
    font-size: 20px;
    font-weight: normal;
    color: rgba(0, 0, 0, 0.85);
    line-height: 60px;
    text-align: left;
    border-bottom: 1px solid #F0F0F0;
  }
  .ml-add-form {
    width: 750px;
    padding-top: 60px;
    padding-bottom: 70px;
    margin: auto;
  }

  .charts-renderer-box {
    width: 100%;
    height: 450px;
    margin-bottom: 100px;
  }
  .time-range-divider {
    display: inline-block;
    margin: 0 10px;
    color: #C9C9C9;
  }

  .width100>:deep(.el-input__wrapper) {
    max-width: 82px;
  }

  .add-link-btn {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 40px;
    margin-top: 20px;
    background-color: #FBFBFB;
    border: 1px solid #F4F4F4;
    cursor: pointer;
  }

  .link-del-btn {
    display: inline-block;
    text-align: center;
    color: var(--el-color-primary);
    cursor: pointer;
  }
}
</style>
