<script lang='ts' setup>
import { onMounted, ref } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import * as echarts from 'echarts/core'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, ScatterChart } from 'echarts/charts'

import { useLoginStore } from '@/store'

import { queryResultForMl } from './query'
import { formatResultLineOption } from './utils'

echarts.use([LineChart, ScatterChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const loginStore = useLoginStore()

const props = defineProps<{
  selectedItem: any
}>()
const emit = defineEmits(['toList'])

const renderer = ref<HTMLElement>()
const loading = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)
const timeIntervalUnit = ref<string>('day')
const timeInterval = ref<string>('1')

onMounted(() => {
  queryDataAndShowCharts()
})

const queryDataAndShowCharts = async () => {
  loading.value = true
  try {
    const {realData, forecastData, realKey, diff} = await queryResultForMl(loginStore.connection, props.selectedItem)
    const echartsInstance = echarts.init(renderer.value as HTMLElement)
    echartsInstance.setOption(formatResultLineOption(realData, forecastData, realKey, diff))
    loading.value = false
  } catch (error) {
    loading.value = false
  }
}

const toList = () => {
  emit('toList')
}

const changeDialogVisible = () => {
  dialogVisible.value = !dialogVisible.value
}

const runForecast = () => {
  queryDataAndShowCharts()
}
</script>
<template>
  <section class="result-container">
    <div class="line-charts">
      <div class="header-btn-box">
        <div
          class="return-btn"
          @click="toList"
        >
          <el-icon>
            <ArrowLeft />
          </el-icon>
          Back
        </div>
        <span
          class="forecast-btn"
          @click="changeDialogVisible"
        >Forecast</span>
      </div>
      <div
        v-loading="loading"
        class="charts-box"
      >
        <div
          ref="renderer"
          style="height: 548px; width: 100%"
          class="charts-renderer"
        ></div>
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="Run a new forecast"
      width="600px"
      custom-class="change-title-css"
    >
      <div class="choose-interval-box">
        <el-input
          v-model="timeInterval"
          placeholder="Please input"
          class="input-with-select-with-gap width100"
          :disabled="true"
        >
          <template #append>
            <el-select
              v-model="timeIntervalUnit"
              placeholder="Select"
              style="width: 100px"
              :disabled="true"
            >
              <el-option
                label="day"
                value="day"
              />
              <el-option
                label="hours"
                value="hours"
              />
            </el-select>
          </template>
        </el-input>
        <span
          class="forecast-btn"
          style="margin-left: 20px;"
          @click="runForecast"
        >Run</span>
      </div>
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >Confirm</el-button
          >
        </span>
      </template> -->
    </el-dialog>
  </section>
</template>
<style lang='scss' scoped>
.result-container {
  width: 100%;
}
.line-charts {
  padding: 20px;
  padding-bottom: 20px;
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;
}
.header-btn-box {
  display: flex;
  justify-content: space-between;
}
.return-btn {
  display: flex;
  align-items: center;
  height: 22px;
  color: rgba(0, 0, 0, 0.85);
  cursor: pointer;
}
.charts-box {
  width: 100%;
  height: 548px;
}
.forecast-btn {
  height: 32px;
  padding: 0 24px;
  color: #fff;
  line-height: 32px;
  border-radius: 2px;
  background: var(--el-color-primary);
  cursor: pointer;
}
.choose-interval-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 180px;
  padding-bottom: 60px;

  .input-with-select-with-gap {
    height: 32px;
  }
  .width100 {
    width: 205px;
  }
  .width100>:deep(.el-input__wrapper) {
    max-width: 82px;
  }
}
</style>
