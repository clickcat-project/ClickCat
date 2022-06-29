<script lang='ts' setup>
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue';
import dayjs from 'dayjs';
import * as echarts from 'echarts/core'
import type { FormInstance, FormRules } from 'element-plus'

import sqls from '@/components/metrics/dataAnalysis/sqls';
import { query } from '@/utils/http';
import { formatBarOptions, generateBarInstance } from '@/components/metrics/charts/useBar';
import { addTraining as addTrainingQuery } from '../query'
import { useLoginStore } from '@/store';

type List = {name: string}[]

const emit = defineEmits(['toResult'])
const loginStore = useLoginStore()

const renderer = ref<HTMLElement>()
const ruleFormRef = ref<FormInstance>()
const database = ref<List>([])
const tables = ref<List>([])
const timeField = ref<List>([])
const step = ref<number>(1)
const formLabelAlign = reactive<{
  database: string,
  table: string,
  timeField: string,
  timeRange: any,
  jobName: string
}>({
  database: '',
  table: '',
  timeField: '',
  timeRange: '',
  jobName: ''
})

const rules = reactive<FormRules>({
  database: [
    { required: true, message: 'Please select database', trigger: 'change' }
  ],
  table: [
    {
      required: true,
      message: 'Please select table',
      trigger: 'change',
    },
  ],
  timeField: [
    {
      required: true,
      message: 'Please select time field',
      trigger: 'change',
    },
  ],
  jobName: [
    {
      required: true,
      message: 'Please input job name',
      trigger: 'blur',
    }
  ]
})
const title = computed(() => {
  if (step.value === 1) {
    return 'Select Table'
  }
  if (step.value === 2) {
    return 'Time Range'
  }
  return 'Job Name'
})

let chartInstance: echarts.ECharts

onBeforeMount(() => {
  queryDatabases()
  formLabelAlign.timeRange = [dayjs().subtract(7, 'day').valueOf(), dayjs().endOf('day').valueOf()]
})

onMounted(() => {
  if (renderer.value) {
    chartInstance = generateBarInstance(renderer.value)
    chartInstance.setOption(formatBarOptions());
  }
})

const previousStep = () => {
  if (step.value > 1) {
    step.value--
  }
}

const addTraining = (queryData: any) => {
  const { connectionUrl, username, password } = loginStore.connection
  return addTrainingQuery({
    connectionUrl,
    username,
    password,
    ...queryData
  })
}

const nextStep = async () => {
  if (step.value < 3) {
    console.log(ruleFormRef.value, 'ruleFormRef.value')
    await ruleFormRef.value?.validate((valid, fields) => {
      if (valid) {
        console.log('submit!')
        ++step.value
      } else {
        console.log('error submit!', fields)
      }
    })
  } else {
    const { database, table, timeField, timeRange, jobName } = formLabelAlign

    const queryData = {
      database,
      table,
      time_filed: timeField,
      start_time: dayjs(timeRange[0]).format('YYYY-MM-DD HH:mm:ss'),
      end_time: dayjs(timeRange[1]).format('YYYY-MM-DD HH:mm:ss'),
      job_name: jobName
    }

    const addReturnData = await addTraining(queryData)
    console.log(addReturnData, 'addReturnData')
    emit('toResult', addReturnData)
  }
}

const queryDatabases = () => {
  query(sqls.queryAllDatabases())
    .then(res => {
      database.value = res.data
    })
}
const queryTables = () => {
  query(sqls.queryTablesByDatabase(formLabelAlign.database))
    .then(res => {
      tables.value = res.data
    })
}

const queryTimeField = () => {
  query(sqls.queryTypeIsDate(formLabelAlign.database, formLabelAlign.table))
    .then(res => {
      timeField.value = res.data
    })
}

const queryDataForMlSecondStep = () => {
  query(sqls.queryDataForMlSecondStep(
    formLabelAlign.database,
    formLabelAlign.table,
    dayjs(formLabelAlign.timeRange[0]).format('YYYY-MM-DD HH:mm:ss'),
    dayjs(formLabelAlign.timeRange[1]).format('YYYY-MM-DD HH:mm:ss'),
    formLabelAlign.timeField
  ))
    .then(res => {
      const xKey = res.meta[0].name
      const dataKey = res.meta[1].name
      const data = res.data.map((item: any) => {
        return {
          name: item[xKey],
          value: item[dataKey]
        }
      })
      const options = formatBarOptions(data)
      const echartsInstance = echarts.init(renderer.value as HTMLElement)
      echartsInstance.setOption(options)
    })
}

const changeDatabase = () => {
  formLabelAlign.table = ''
  formLabelAlign.timeField = ''
  queryTables()
}

const changeTable = () => {
  formLabelAlign.timeField = ''
  queryTimeField()
}

const changeField = () => {
  queryDataForMlSecondStep()
}

const changeTimeRange = (val: any) => {
  queryDataForMlSecondStep()
}
</script>
<template>
  <section class="ml-add-container">
    <h3 class="title">{{ title }}</h3>
    <el-form
      label-position="right"
      label-width="100px"
      ref="ruleFormRef"
      :rules="rules"
      :model="formLabelAlign"
      class="ml-add-form"
      style="width: 700px"
      status-icon
    >
      <template v-if="step === 1">
        <el-form-item label="Database" prop="database">
          <el-select
            v-model="formLabelAlign.database"
            @change="changeDatabase"
            popper-class="primary-select-dropdown"
            placeholder="Select Database"
          >
            <el-option
              v-for="item in database"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Tables" prop="table">
          <el-select
            v-model="formLabelAlign.table"
            popper-class="primary-select-dropdown" 
            placeholder="Select Table"
            filterable
            @change="changeTable"
            style="width: 600px"
          >
            <el-option
              v-for="item in tables"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
      </template>
      
      <template v-if="step === 2">
        <el-form-item label="Time  Field" prop="timeField">
          <el-select
            v-model="formLabelAlign.timeField"
            popper-class="primary-select-dropdown" 
            placeholder="Select Table"
            filterable
            @change="changeField"
            style="width: 600px"
          >
            <el-option
              v-for="item in timeField"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Time  Range" prop="timeRange">
          <el-date-picker
            v-model="formLabelAlign.timeRange"
            type="daterange"
            :clearable="false"
            range-separator="-"
            start-placeholder="Start date"
            end-placeholder="End date"
            :size="'default'"
            @change="changeTimeRange"
          />
        </el-form-item>
      </template>
      <template v-if="step === 3">
        <el-form-item label="Job Name" prop="jobName">
          <el-input v-model="formLabelAlign.jobName" placeholder="Please input" />
        </el-form-item>
      </template>
    </el-form>

    <section v-if="step === 2" ref="renderer" class="charts-renderer-box"></section>

    <section class="btn">
      <el-button class="custom-default-btn" @click="previousStep">Previous</el-button>
      <el-button class="custom-primary-btn" type="primary" @click="nextStep">
        {{step !== 3 ? 'Next' : 'End'}}
      </el-button>
    </section>
  </section>
</template>
<style lang='scss' scoped>
.ml-add-container {
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
    margin: auto;
  }

  .charts-renderer-box {
    width: 100%;
    height: 450px;
    margin-bottom: 100px;
  }
}
</style>