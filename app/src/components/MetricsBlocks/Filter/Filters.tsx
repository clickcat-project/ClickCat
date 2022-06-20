import { Divider, Select } from "antd";
import React from "react";

import css from './Filter.css'
import { getTimeFilterList, getRealVal } from './utils'
import { ClockCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import classNames from "classnames";

type ValueForSelect = {
  database?: string[]
  table?: string[]
  time?: number | string | undefined
  queryKind?: string[]
  type?: string[]
  initialUser?: string[]
}

type Props = {
  databasesList?: {name: string}[]
  tablesList?: {name: string}[]
  typeList?: {name: string}[]
  initialUserList?: {name: string}[]
  queryKindList?: {name: string}[]
  value: ValueForSelect,
  onChange: (obj: ValueForSelect, option?: any) => void,
  updateAllList?: number
}

export const Filter: React.FC<Props> = (props) => {
  const timeFilterList = getTimeFilterList()
  const {
    databasesList,
    tablesList,
    value: { database, table, time, type, queryKind, initialUser },
    onChange,
    typeList,
    initialUserList,
    queryKindList
  } = props
  return <section className={classNames(css.filter, 'filter-dorpdown-fender-container')}>
    { databasesList && <>
        <span className={css.filterTip}>Database</span>
        <Select value={database} dropdownClassName={'light-dropdown'} onChange={(val: string[]) => {
          // const realVal = getRealVal(val)
          onChange({ database: val, table, time })
        }} showArrow style={{ width: 120 }} bordered={false}>
          {
            databasesList.map((item, i) => {
              return <Select.Option key={item.name + i} value={item.name}>{item.name}</Select.Option>
            })
          }
        </Select>
        <Divider type='vertical' />
      </>
    }
    { tablesList && <>
        <span className={css.filterTip}>Table</span>
        <Select value={table} dropdownClassName={'light-dropdown'} onChange={val => {
          // const realVal = getRealVal(val)
          onChange({ database, table: val, time })
        }} showArrow style={{ width: 120 }} bordered={false}>
          {
            tablesList.map(item => {
              return <Select.Option key={item.name} value={item.name}>{item.name}</Select.Option>
            })
          }
        </Select>
        <Divider type='vertical' />
      </>
    }
    { queryKindList && <>
        <span className={css.filterTip}>Query kind</span>
        <Select value={queryKind} dropdownClassName={'light-dropdown'} onChange={val => {
          // const realVal = getRealVal(val)
          onChange({ queryKind: val, type, initialUser, time })
        }} showArrow style={{ width: 120 }} bordered={false}>
          {
            queryKindList.map(item => {
              return <Select.Option key={item.name} value={item.name}>{item.name}</Select.Option>
            })
          }
        </Select>
        <Divider type='vertical' />
      </>
    }
    { typeList && <>
        <span className={css.filterTip}>Query status</span>
        <Select value={type} dropdownClassName={'light-dropdown'} onChange={val => {
          // const realVal = getRealVal(val)
          onChange({ queryKind, type: val, initialUser, time })
        }} showArrow style={{ width: 120 }} bordered={false}>
          {
            typeList.map(item => {
              return <Select.Option key={item.name} value={item.name}>{item.name}</Select.Option>
            })
          }
        </Select>
        <Divider type='vertical' />
      </>
    }
    { initialUserList && <>
        <span className={css.filterTip}>User</span>
        <Select value={initialUser} dropdownClassName={'light-dropdown'} onChange={val => {
          // const realVal = getRealVal(val)
          onChange({ queryKind, type, initialUser: val, time })
        }} showArrow style={{ width: 120 }} bordered={false}>
          {
            initialUserList.map(item => {
              return <Select.Option key={item.name} value={item.name}>{item.name}</Select.Option>
            })
          }
        </Select>
        <Divider type='vertical' />
      </>
    }
    <ClockCircleOutlined className={css.filterIcon} />
    <Select defaultValue={time} dropdownClassName={'light-dropdown'} onChange={(val) => {
      const option = timeFilterList.find(item => item.value === val)
      if (databasesList) {
        onChange({ database, table, time: val }, option)
      } else {
        onChange({ queryKind, type, initialUser, time: val }, option)
      }
    }} showArrow style={{ width: 150 }} bordered={false}>
      {
        timeFilterList.map(item => {
          return <Select.Option key={item.name} value={item.value}>{item.name}</Select.Option>
        })
      }
    </Select>
  </section>
}