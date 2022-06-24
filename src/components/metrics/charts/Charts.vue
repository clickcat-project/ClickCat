<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

import Card from '../Card.vue'
import { dealWithLineData, getCurrentChart } from './utils'
import { CommonData, CommonObj, DataQueryFunc } from '../types'

const props = defineProps<{
  title: string,
  height?: number,
  queryFunc: DataQueryFunc,
  type: 'pie' | 'bar' | 'line'
  grid?: CommonObj,
  legend?: CommonObj,
  index?: string,
  sqlFuncName: string,
  database?: string,
  table?: string,
  timeRange?: string[],
  user?: string,
  sqltype?: string,
  queryKind?: string,
  timeDuration?: string,
}>()

const chartInstanceOuter = ref<echarts.ECharts | null>(null)
const formatOptionouter = ref<(data: CommonData, grid?: CommonObj, legend?: CommonObj) => echarts.EChartsOption>()

watch([
  () => props.database,
  () => props.table,
  () => props.timeRange,
  () => props.type,
  () => props.user,
  () => props.queryKind,
  () => props.timeDuration,
], () => {
  getData()
})

onMounted(() => {//需要获取到element,所以是onMounted的Hook
  const {chartInstance, formatOption} = getCurrentChart(props.type, document.querySelector(`.chart-render-container-${props.index}`) as HTMLElement)
  chartInstanceOuter.value = chartInstance as unknown as echarts.ECharts
  formatOptionouter.value = formatOption as any
  getData()
})

const getData = () => {
  const { database, table, sqltype, user, queryKind, timeDuration, timeRange = [] } = props
  props.queryFunc(
    props.sqlFuncName,
    {
      database,
      table,
      type: sqltype,
      initial_user: user,
      query_kind: queryKind,
      startTime: timeRange[0],
      endTime: timeRange[1],
      timeDuration
    }
  )
    .then((res) => {
      let nameCol = ''
      let valueCol = ''
      let data: CommonData = []
      if (res.meta.length === 3) {
        data = dealWithLineData(res)
      } else if (res.meta.length === 2) {
        res.meta.forEach((col: CommonObj, index: number) => {
          if (index === 0) {
            nameCol = col.name
          } else {
            valueCol = col.name
          }
        })
        data = res.data.map((item: CommonObj) => {
          return {
            name: item[nameCol],
            value: item[valueCol],
          }
        })
      } else if (res.meta.length === 1) {
        nameCol = res.meta[0].name
        valueCol = res.meta[0].name
        data = res.data.map((item: CommonObj) => {
          return {
            name: nameCol,
            value: item[valueCol],
          }
        })
      }
      if (!data || !data.length) {
        chartInstanceOuter.value?.dispose()
      } else {
        if (formatOptionouter.value) {
          if (chartInstanceOuter.value) {
            const options = formatOptionouter.value(data, props.grid, props.legend)
            chartInstanceOuter.value?.setOption(options)
          }
        }
      }
    })
}

</script>
<template>
  <Card
    :title="title"
    :height="height || 310"
  >
    <section class="chart-content">
      <div :class="`chart-render-container-${index}`"></div>
    </section>
  </Card>
</template>
<style lang='scss' scoped>
.chart-content {
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;

  & > div {
    width: 100%;
    height: 100%;
  }
}
</style>