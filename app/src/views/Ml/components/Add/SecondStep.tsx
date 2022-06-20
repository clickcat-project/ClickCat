import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, ConfigProvider, DatePicker, Form, FormInstance, InputNumber, Select } from 'antd';
import * as echarts from 'echarts/core';
import { formatBarOptions } from './utils';
import { AppStore } from '../../../../stores';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';

import sqls from '../../../MetricsServer/sqls';

import css from './Add.css'
import moment, { Moment } from 'moment';
import { TableEmpty } from 'components/MetricsBlocks/TableBanner/TableBanner';

interface Props {
  initialValues: {
    timeFiled: string,
    timeRange: any[] | undefined,
    database: string,
    table: string
  },
  store: AppStore,
  // onValuesChange: (changedValues: any, allValues: any) => void
  // step: number
  // setStep: (bal: number) => void
}

echarts.use([PieChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

export const SecondStep = ({
  initialValues,
  store,
  // onValuesChange,
  // setStep,
  // step
}: Props) => {
  const [form] = Form.useForm();
  const refForm = useRef<FormInstance>(null)
  const renderer = useRef<HTMLDivElement | null>(null);
  // let chartInstance: echarts.ECharts | null = null;
  const [timeFiledList, setTimeFiledList] = useState<any[]>([])
  const [currentTimeFiled, setCurrentTimeFiled] = useState<string>(initialValues.timeFiled)
  const [currentDate, setCurrentDate] = useState<string[]>([
    moment((initialValues?.timeRange || [])[0]).format('YYYY-MM-DD HH:mm:ss'),
    moment((initialValues?.timeRange || [])[1]).format('YYYY-MM-DD HH:mm:ss')
  ])

  useEffect(() => {
    (async () => {
      if (currentTimeFiled) {
        const res = await store.api.value?.fetch(sqls.queryDataForMlSecondStep(
          initialValues.database,
          initialValues.table,
          currentDate[0],
          currentDate[1],
          currentTimeFiled
        ))
        const xKey = res?.meta.columns[0].name
        const dataKey = res?.meta.columns[1].name
        let xKeyData = []
        let data = []
        if (xKey) {
          xKeyData = res?.rows.map(item => item[xKey]) || []
        }
        if (dataKey) {
          data = res?.rows.map(item => item[dataKey]) || []
        }
        const echartsInstance = echarts.init(renderer.current as HTMLElement);
        echartsInstance.setOption(formatBarOptions(xKeyData, data));
        // chartInstance?.setOption(formatBarOptions(xKeyData, data))
        // const xKeyData = res?.rows.map(item => item[xKey || ''])
      }
    })()
  }, [currentTimeFiled, currentDate])

  useEffect(() => {
    store.api.value?.fetch(sqls.queryTypeIsDate(initialValues.database, initialValues.table))
      .then(res => {
        setTimeFiledList(res?.rows || [])
      })
    if (renderer?.current) {
      setTimeout(() => {
        const echartsInstance = echarts.init(renderer.current as HTMLElement);
        echartsInstance.setOption(formatBarOptions());
        // chartInstance = echartsInstance
      })
    }
  }, []);
  
  return <>
    {/* <Form
      ref={refForm}
      form={form}
      labelAlign={'right'}
      labelCol={{span: 4}}
      onValuesChange={onValuesChange}
      layout='horizontal'
      initialValues={initialValues}
    > */}
      <Form.Item
        name="timeFiled"
        label="Time  Field"
        initialValue={initialValues}
        rules={[{ required: true }]}
      >
        {/* <ConfigProvider renderEmpty={
          () => {
            return <div style={{height: '100px',paddingTop: '40px'}}><TableEmpty /></div>
          }
        }> */}
          <Select
            placeholder="Select a option"
            style={{width: '564px'}}
            className={'light-select'}
            onChange={(val) => {
              setCurrentTimeFiled(val)
            }}
            dropdownClassName={'light-dropdown no-img-empty'}
          >
            {
              timeFiledList?.map(item => {
                return <Select.Option key={item.name} value={item.name}>{item.name}</Select.Option>
              })
            }
          </Select>
        {/* </ConfigProvider> */}
      </Form.Item>
      <Form.Item name="timeRange" label="Time  Range" rules={[{ required: true }]}>
        <DatePicker.RangePicker
          className='light-ant-picker light-clear'
          style={{width: '564px'}}
          onChange={(dates, dateStrings) => {
            setCurrentDate(dateStrings)
          }}
          dropdownClassName='light-calendar'
          allowClear={false}
        >
        </DatePicker.RangePicker>
      </Form.Item>
      {/* <Form.Item name="timeIntreval" label="Time  Interval" rules={[{ required: true }]}>
        <InputNumber className='light-input-number' style={{ width: 210 }} addonAfter={
          <Select className={'light-select'} dropdownClassName={'light-dropdown'} style={{ width: 100, marginLeft: 3 }}>
            <Select.Option value="USD">$</Select.Option>
            <Select.Option value="EUR">€</Select.Option>
            <Select.Option value="GBP">£</Select.Option>
            <Select.Option value="CNY">¥</Select.Option>
          </Select>
        } />
      </Form.Item> */}
    {/* </Form> */}
    <div className={css.chartsContainer} style={{marginBottom: 80, height: 450}}>
      <div
        ref={renderer}
        style={{
          position: 'absolute',
          top: 358,
          left: 0,
          height: '450px',
          width: '100%',
        }}
        className={css.chartsRenderer}></div>
    </div>
    {/* <div className={css.btnBox} style={{marginTop: '40px'}}>
      <Button className={css.previous} onClick={() => {
        setStep(step - 1)
      }} style={{marginRight: '10px'}}>Previous</Button>
      <Button type="primary" onClick={() => {
        refForm.current?.validateFields()
        .then(() => {
          setStep(step + 1)
        })
        .catch(err => {
          console.log(err)
        })
      }}>{step === 3 ? 'End' : 'Next'}</Button>
    </div> */}
  </>
}