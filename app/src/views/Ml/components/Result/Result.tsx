import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, ScatterChart } from 'echarts/charts';

import css from './Result.css'
import { LeftOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';
import { AppStore, Stores } from 'stores';
import sqls from 'views/MetricsServer/sqls';
import { Query } from 'services';
import { formatLineOptions, formatData } from './utils'
import { typedInject } from 'module/mobx-utils';

echarts.use([LineChart, ScatterChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

interface Props extends InjectedProps {
  finalValue: any,
  setIsWhich: (val: number) => void
}

interface InjectedProps {
  store: AppStore;
}

const Result = ({finalValue, store, setIsWhich}: Props) => {
  const renderer = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    (async function () {
      const { connectionUrl, username, password } = store.api.value?.provider.connection || {}
      const {
        database,
        table,
        timeFiled: time_field,
        timeRange: [start_time, end_time],
        jobName: job_name,
        model_path
      } = finalValue
      // http://192.168.202.63
      const res = await fetch(`${clickCatConfig.serverHost}/back_testing`, {
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
      const [realData, forecastData, realKey, diff] = formatData(data)
      if (renderer?.current) {
        setTimeout(() => {
          const echartsInstance = echarts.init(renderer.current as HTMLElement);
          echartsInstance.setOption(formatLineOptions(realData, forecastData, realKey, diff));
        })
      }
    })()
  }, []);

  return <section className={css.resultContainer}>
    <div className={css.lineCharts}>
      <div className={css.headerBtnBox}>
        <div className={css.returnBtn} onClick={() => {
          setIsWhich(1)
        }}>
          <LeftOutlined />
          Back
        </div>
        {/* <Button type='primary'>Forecast</Button> */}
      </div>
      <div className={css.chartsBox}>
        <div ref={renderer} style={{height: '548px', width: '100%'}} className={css.chartsRenderer}></div>
      </div>
    </div>
    {/* <div className={css.tableBox}>
      <h3 className={css.tableBoxTitle}>Anomalies</h3>
      <Table
        columns={columns}
        rowSelection={{ ...rowSelection, checkStrictly }}
        dataSource={data}
      />
    </div> */}
  </section>
}

export default typedInject<InjectedProps, Props, Stores>(props => {
  const { store } = props
  return {
    store: store.appStore
  }
})(Result)