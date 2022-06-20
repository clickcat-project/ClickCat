import React from 'react'
import { Button, Form, FormInstance, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { AppStore } from 'stores';
import sqls from '../../../MetricsServer/sqls';

import css from './Add.css'
// import { TableEmpty } from 'components/MetricsBlocks/TableBanner/TableBanner';

interface Props {
  initialValues: {
    database: string,
    table: string
  }
  store: AppStore
}

export const FirstStep: React.FC<Props> = ({
  initialValues,
  store,
}) => {
  const [currentDatabase, setCurrentDatabase] = useState<string>(initialValues.database)
  const [databases, setDatabase] = useState<any[]>([])
  const [tables, setTables] = useState<any[]>([])

  useEffect(() => {
    store.api.value?.fetch(sqls.queryAllDatabases())
      .then(res => {
        setDatabase(res.rows)
      })
    // fetch(sqls.queryAllDatabases())
  }, [])

  useEffect(() => {
    if (!currentDatabase) return
    store.api.value?.fetch(sqls.queryTablesByDatabase(currentDatabase))
      .then(res => {
        setTables(res.rows)
      })
  }, [currentDatabase])
  
  return <>
      <Form.Item name="database" label="Database" rules={[{ required: true }]}>
        <Select
          placeholder="Select a option and change input text above"
          className={'light-select'}
          style={{width: '180px'}}
          onChange={(val) => {
            setCurrentDatabase(val)
          }}
          dropdownClassName={'light-dropdown no-img-empty'}
        >
          {
            databases.map(item => {
              return <Select.Option key={item.name} value={item.name}>{item.name}</Select.Option>
            })
          }
        </Select>
      </Form.Item>
      <Form.Item name="table" label="table" rules={[{ required: true }]}>
        {/* <ConfigProvider renderEmpty={
          () => {
            return <div style={{height: '100px',paddingTop: '40px'}}><TableEmpty /></div>
          }
        }> */}
          <Select
            placeholder="Select a option and change input text above"
            showSearch
            optionFilterProp="children"
            style={{width: "564px"}}
            className={'light-select'}
            dropdownClassName={'light-dropdown no-img-empty'}
            filterOption={(input, option) =>
              (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            {
              tables.map(item => {
                return <Select.Option key={item.name} value={item.name}>{item.name}</Select.Option>
              })
            }
          </Select>
        {/* </ConfigProvider> */}
      </Form.Item>
  </>
}