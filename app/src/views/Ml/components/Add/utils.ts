import * as echarts from 'echarts/core';

interface dataItem {
  name: string;
  value: number;
}

export function formatBarOptions(category: string[] = [], value: number[] = []): echarts.EChartsCoreOption {
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
        data: category,
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
        name: 'Direct',
        type: 'bar',
        barWidth: '60%',
        data: value,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#FFB300' },
            { offset: 1, color: '#FFD778' }
          ])
        },
      },
    ],
  };
}

export async function addTraining({
  connectionUrl,
  username,
  password,
  database,
  table,
  time_filed,
  start_time,
  end_time,
  job_name
}: any) {
  const res = await fetch(`${clickCatConfig.serverHost}/train`, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({
      conn_host: connectionUrl?.replace(':8123', '').replace('http://', ''),
      conn_user: username,
      conn_password: password,
      conn_database: '',
      database,
      table,
      time_field: time_filed,
      start_time,
      end_time,
      job_name
    }) // body data type must match "Content-Type" header
  })
  const data = await res.json()
  return data
}