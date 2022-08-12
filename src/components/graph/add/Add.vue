<script lang='ts' setup>
import { onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import dayjs from 'dayjs'
import * as echarts from 'echarts/core'
import type { FormInstance, FormRules } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'

import sqls from '@/components/metrics/dataAnalysis/sqls'
import { query } from '@/utils/http'
import { formatBarOptions, generateBarInstance } from '@/components/metrics/charts/useBar'
import i18n from '@/i18n'

type List = {name: string}[]

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
  describe: string,
  nodes: {filed: string, table: string, check: boolean, id: string}[]
  links: any[]
}>({
  database: '',
  jobName: '',
  describe: '',
  nodes: [
    {
      id: '1',
      table: '1',
      filed: '2',
      check: false
    },
    {
      id: '1',
      table: '1',
      filed: '2',
      check: false
    },
    {
      id: '1',
      table: '1',
      filed: '2',
      check: false
    }
  ],
  links: [
    {
      id: '1',
      table: '1',
      filed: '2',
      check: false
    },
    {
      id: '1',
      table: '1',
      filed: '2',
      check: false
    },
    {
      id: '1',
      table: '1',
      filed: '2',
      check: false
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
        prop="describe"
      >
        <el-input
          v-model="formLabelAlign.describe"
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
        prop="nodes"
        label-width="0"
      >
        <el-table
          :data="formLabelAlign.nodes"
          style="width: 100%"
        >
          <el-table-column
            prop="date"
            label="Date"
          >
            <template #default="scope">
              <el-checkbox v-model="scope.row.check" />
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="Name"
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
            prop="address"
            label="Address"
          >
            <template #default="scope">
              <el-select
                v-model="scope.row.table"
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
        prop="nodes"
        label-width="0"
      >
        <el-table
          :data="formLabelAlign.links"
          style="width: 100%;"
        >
          <el-table-column
            prop="date"
            label="Date"
          >
            <template #default="scope">
              <el-checkbox v-model="scope.row.check" />
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="Name"
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
            prop="address"
            label="Address"
          >
            <template #default="scope">
              <el-select
                v-model="scope.row.table"
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
}
</style>
