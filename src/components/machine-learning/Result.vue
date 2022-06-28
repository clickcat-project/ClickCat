<script lang='ts' setup>
import { onMounted, ref } from 'vue';
import { ArrowLeft } from '@element-plus/icons-vue'
import * as echarts from 'echarts/core';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, ScatterChart } from 'echarts/charts';

import { useLoginStore } from '@/store';

import { queryResultForMl } from './query';
import { formatResultLineOption } from './utils';

echarts.use([LineChart, ScatterChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

const loginStore = useLoginStore()

const props = defineProps<{
  selectedItem: any
}>()
const emit = defineEmits(['toList'])

const renderer = ref<HTMLElement>()

onMounted(() => {
  queryDataAndShowCharts()
})

const queryDataAndShowCharts = async () => {
  const {realData, forecastData, realKey, diff} = await queryResultForMl(loginStore.connection, props.selectedItem)
  const echartsInstance = echarts.init(renderer.value as HTMLElement);
  echartsInstance.setOption(formatResultLineOption(realData, forecastData, realKey, diff));
}

const toList = () => {
  emit('toList')
}
</script>
<template>
<section class="result-container">
  <div class="line-charts">
    <div class="header-btn-box">
      <div class="return-btn" @click="toList">
        <el-icon>
          <ArrowLeft />
        </el-icon>
        Back
      </div>
      <!-- <Button type='primary'>Forecast</Button> -->
    </div>
    <div class="charts-box">
      <div ref="renderer" style="height: 548px; width: 100%" class="charts-renderer"></div>
    </div>
  </div>
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
</style>
