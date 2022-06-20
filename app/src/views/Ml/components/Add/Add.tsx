import { Button, Form, FormInstance, Input } from 'antd';
import { typedInject } from 'module/mobx-utils'
import React, { useRef, useState } from 'react'
import { AppStore, Stores } from 'stores';
import { FirstStep } from './FirstStep'
import { SecondStep } from './SecondStep'
import { addTraining } from './utils'

import css from './Add.css'
import moment, { Moment } from 'moment';

interface Props extends InjectedProps {
  setFinalValue: (val: any) => void
  onEnd: (data: any) => void
}

interface InjectedProps {
  store: AppStore;
}

type FormData = {
  database: string,
  table: string,
  timeFiled: string,
  timeRange: Moment[],
  jobName: ''
}

const Add = ({store, onEnd}: Props) => {
  const [formData, setFormData] = useState<FormData>({
    database: '',
    table: '',
    timeFiled: '',
    timeRange: [moment().startOf('month'), moment().endOf('month')],
    jobName: ''
  })
  const [step, setStep] = useState<number>(1)
  const [form] = Form.useForm();

  return <section className={css.AddContainer}>
    <h3 className={css.title}>Select Table</h3>
    <Form
      form={form}
      onValuesChange={(changed, all) => {
        setFormData({
          ...formData,
          ...changed
        })
        if (changed.database) {
          form.setFieldsValue({
            table: '',
            timeFiled: ''
          })
        }
        if (changed.table) {
          form.setFieldsValue({
            timeFiled: '',
          })
        }
      }}
      initialValues={formData}
      labelCol={{span: 4}}
      layout='horizontal'
    >
      {
        step === 1 &&
        <FirstStep
          initialValues={formData}
          store={store}
        ></FirstStep>
      }
      {
        step === 2 && 
        <SecondStep
          initialValues={formData}
          store={store}
        ></SecondStep>
      }
      {
        step === 3 && <>
            <Form.Item name="jobName" label="Job Name" rules={[{ required: true }]}>
              <Input className='light-input' placeholder='input job name' style={{width: 564}}/>
            </Form.Item>
        </>
      }
      <div className={css.btnBox}>
        <Button className={css.previous} onClick={() => {
          setStep(step - 1)
        }} style={{marginRight: '10px'}}>Previous</Button>
        <Button type="primary" onClick={async () => {
          // form.validateFields()
          //   .then(() => {
              try {
                await form.validateFields()
                if (step < 3) {
                  setStep(step + 1)
                } else {
                  const { connectionUrl, username, password } = store.api.value?.provider.connection || {}
                  const { database, table, timeFiled, timeRange, jobName } = formData
                  const start_time = timeRange[0].format('YYYY-MM-DD HH:mm:ss')
                  const end_time = timeRange[1].format('YYYY-MM-DD HH:mm:ss')
                  const addReturnData = await addTraining({
                    connectionUrl,
                    username,
                    password,
                    database,
                    table,
                    time_filed: timeFiled,
                    start_time,
                    end_time,
                    job_name: jobName
                  })
                  onEnd({...formData, timeRange: [start_time, end_time], model_path: addReturnData.model_path})
                }
              } catch (err) {
                console.log(err)
              }
        }}>{step === 3 ? 'End' : 'Next'}</Button>
      </div>
    </Form>
  </section>
}

export default typedInject<InjectedProps, Props, Stores>(props => {
  const { store } = props
  return {
    store: store.appStore
  }
})(Add)