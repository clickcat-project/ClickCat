import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);
const colorList: string[] = ['#5CB9FF', '#4ECBB4', '#FAD337', '#83B3D6'];
export function generateLineInstance(root: HTMLElement): echarts.ECharts {
  const echartsInstance = echarts.init(root);
  echartsInstance.setOption(formatLineOptions());
  return echartsInstance;
}

export function formatLineOptions(data?: any, grid?: any, legend?: any): echarts.EChartsCoreOption {
  let nameList = []
  let dataList = []
  const isMulLine = Array.isArray(data && data[0])
  if (isMulLine && data) {
    nameList = data[0].map((item: any) => item.name)
    dataList = data.map((da: any[]) => {
      return {
        name: da[0].category,
        type: 'line',
        data: da.map(item => item.value)
      }
    })
  } else if (data?.length) {
    dataList = data?.map((item: any) => item.value)
    nameList = data?.map((item: any) => item.name)
  } else {
    dataList = []
    nameList = []
  }
  return {
    grid: {
      ...{
        right: 40,
        bottom: 40,
        left: 100,
        height: '70%'
      },
      ...(grid || {})
    },
    ...isMulLine && {
      legend: {
        ...{
          left: 'center',
          itemHeight: 12,
          itemWidth: 12,
          icon: 'rect',
          // formatter: (name: string) => {
          //   return (name.length > 4 ? (name.slice(0,4) + '...') : name );
          // }
        },
        ...(legend || {})
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        params = params[0];
        return params.name + ' ' + params.value
      },
      axisPointer: {
        animation: false
      }
    },
    xAxis: {
      type: 'category',
      data: nameList,
    },
    yAxis: {
      type: 'value',
    },
    series: !isMulLine ? [
      {
        data: dataList,
        type: 'line',
      }
    ] : [...dataList],
  };
}
