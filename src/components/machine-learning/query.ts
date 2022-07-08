import { Connection } from '@/store/modules/login/types'
import { formatData } from './utils'

export const queryList = async (connection: any = {}) => {
  const { connectionUrl, username, password } = connection
  // http://192.168.202.63
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/list`, {
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
      conn_database: ''
    }) // body data type must match "Content-Type" header
  })
  const data = await res.json()
  const finalData = data.map((item: any) => {
    return JSON.parse(item[1])
  })
  return finalData
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
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/train`, {
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

export async function queryResultForMl (connection: Connection, finalValue: any) {
  const { connectionUrl, username, password } = connection
  const {
    database,
    table,
    time_field,
    start_time,
    end_time,
    job_name,
    model_path
  } = finalValue
  // http://192.168.202.63
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/back_testing`, {
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
      time_field,
      start_time,
      end_time,
      job_name,
      model_path
    }) // body data type must match "Content-Type" header
  })
  const data = await res.json()
  const {
    realData,
    forecastData,
    realKeyFormat: realKey,
    diff,
    lessForecast,
    biggerForecast,
  } = formatData(data)
  // if (renderer?.current) {
  //   setTimeout(() => {
  //     const echartsInstance = echarts.init(renderer.current as HTMLElement);
  //     echartsInstance.setOption(formatLineOptions(realData, forecastData, realKey, diff));
  //   })
  // }
  return {
    realData, forecastData, realKey, diff,
    lessForecast,
    biggerForecast,
  }
}