import * as echarts from 'echarts/core'
import { generatePieInstance, formatPieOptions } from './usePie'
import { generateBarInstance, formatBarOptions } from './useBar'
import { generateLineInstance, formatLineOptions } from './useLine'
import { CommonObj, CommonResType } from '../types'

type chartsType = 'pie' | 'bar' | 'line';

export function getCurrentChart(type: chartsType, renderer: HTMLElement) {
  let chartInstance: echarts.ECharts | null = null
  let formatOption
  switch (type) {
    case 'pie':
      chartInstance = generatePieInstance(renderer)
      formatOption = formatPieOptions
      break
    case 'bar':
      chartInstance = generateBarInstance(renderer)
      formatOption = formatBarOptions
      break
    case 'line':
      chartInstance = generateLineInstance(renderer)
      formatOption = formatLineOptions
      break
    default:
      break
  }
  return {
    chartInstance: chartInstance as echarts.ECharts,
    formatOption,
  }
  //
}

export const dealWithLineData = (res: CommonResType) => {
  let category = ''
  if (res.meta.length > 2) {
    category =  res.meta[1].name as string
  }
  let nameCol = ''
  let valueCol = ''
  res.meta.forEach((col: CommonObj, index: number) => {
    if (index === 0) {
      nameCol = col.name as string
    } else {
      valueCol = col.name as string
    }
  })
  if (category === 'read_rows') {
    const firstName = res.meta[1].name
    const secondName = res.meta[2].name
    return [
      res.data.map((item: any) => {
        return {
          category: res.meta[1].name,
          name: item[nameCol],
          value: item[firstName]
        }
      }),
      res.data.map((item: any) => {
        return {
          category: res.meta[2].name,
          name: item[nameCol],
          value: item[secondName]
        }
      })
    ]
  } else {
    const categoryObj: any = {}
    res.data.forEach((item: any) => {
      categoryObj[item[category]] = 1
    })
    const categoryList = Object.keys(categoryObj)
    return categoryList.map(cate => {
      return res.data.map((row: any) => {
        return {
          name: row[nameCol],
          category: cate,
          value: cate === row[category] ? row[valueCol] : 0
        }
      })
    })
  }
}