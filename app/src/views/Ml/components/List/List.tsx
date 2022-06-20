import { CheckCircleFilled, Loading3QuartersOutlined, PlusOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { Query } from 'services'
import sqls from 'views/MetricsServer/sqls'
import { withRouter, RouteComponentProps } from 'react-router';

import css from './List.css'
import { AppStore, Stores } from 'stores'
import { typedInject } from 'module/mobx-utils'

enum ListStatus {
  Training = 'training',
  Finished = 'finished'
}

interface Props extends InjectedProps {
  setIsWhich: (val: number) => void
  setFinalValue: (val: any) => void
}

interface InjectedProps {
  store: AppStore;
}

export const List = ({ setIsWhich, store, setFinalValue }: Props) => {
  const [data, setData] = useState<any[]>([])
  useEffect(() => {
    (async function () {
      const { connectionUrl, username, password } = store.api.value?.provider.connection || {}
      // http://192.168.202.63
      const res = await fetch(`${clickCatConfig.serverHost}/list`, {
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
      setData(finalData)
    })()
  }, [])

  if (!data.length) {
    return <div className={css.empty}>
      No data
    </div>
  }

  return <div className={css.ListContianer}>
    {
      data.map((item, i) => {
        return <section key={i} className={css.listBox}>
          <div className={css.listTitleBox}>
            <p className={css.listTitle}>{item.job_name}</p>
            {/* <div className={css.listStatus}>
              { item.status === ListStatus.Training ?
                <Loading3QuartersOutlined className={css.listStatusTraining} /> :
                <CheckCircleFilled className={css.listStatusFinished} />
              } 
              { item.status }
            </div> */}
          </div>
          <div className={css.listBtnBox}>
            <span className={css.listBtn} onClick={() => {
              const { database, table, time_field, start_time, end_time, job_name, model_path } = item
              setIsWhich(3)
              setFinalValue({
                database,
                table,
                timeFiled: time_field,
                timeRange: [start_time, end_time],
                jobName: job_name,
                model_path
              })
            }}>view result</span>
          </div>
        </section>
      })
    }
    { data.length &&
      <section className={classNames(css.listBox, css.addBtn)} onClick={() => {
        setIsWhich(2)
      }}>
        <PlusOutlined className={css.addIcon} />
        <span className={css.addText}>NEW</span>
      </section>
    }
  </div>
}

export default typedInject<InjectedProps, Props, Stores>(props => {
  const { store } = props
  return {
    store: store.appStore
  }
})(List)