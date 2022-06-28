import echarts from "echarts";
import dayjs from 'dayjs'

export function formatResultLineOption (realData: number[], forecastData: number[], realKey: string[], diff: number[]): echarts.EChartsCoreOption {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: realKey,
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        data: diff,
        type: 'scatter',
        z: 10,
        itemStyle:{
          color: '#F53F3F',
          borderColor: '#FFFFFF'
        }
      },
      {
        data: realData,
        type: 'line',
        symbol: 'none',
        lineStyle: {
          color: '#4ECBB4',
          width: 2
        },
        z: 9
      },
      {
        data: forecastData,
        type: 'line',
        symbol: 'none',
        z: 8,
        lineStyle: {
          color: 'rgba(78, 203, 180, 0.3)',
          width: 30
        }
      },
    ],
  };
}

export const formatData = (data: { '0': { '0': any, '1': any } }) => {
  const {0: {count: real}, 1: {pred: forecast}} = data['0']
  const realKey = Object.keys(real).sort()
  const realData = realKey.map(key => real[key])
  const forecastData = realKey.map((key, i) => {
    return forecast[i] || real[key]
  })
  const diff = Object.keys(forecast).map((key: any) => {
    return [dayjs(+realKey[key]).format('YYYY-MM-DD HH:mm:ss'), real[realKey[key]]]
  })
  const realKeyFormat = realKey.map(item => {
    return dayjs(+item).format('YYYY-MM-DD HH:mm:ss')
  })
  return [realData, forecastData, realKeyFormat, diff]
}