import { Connection } from '@/store/modules/login/types'

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
    const other = JSON.parse(item[1])
    return {
      job_id: item[0],
      ...other
    }
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
  job_name,
  time_interval
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
      job_name,
      time_interval
    }) // body data type must match "Content-Type" header
  })
  const data = await res.json()
  return data
}

export async function deleteOne (connection: Connection, data: any) {
  const { connectionUrl, username, password } = connection
  const {
    job_id,
    model_path
  } = data
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/delete`, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({
      job_id,
      model_path,
      conn_host: connectionUrl?.replace(':8123', '').replace('http://', ''),
      conn_user: username,
      conn_password: password,
      conn_database: '',
    }) // body data type must match "Content-Type" header
  })
  return res
}