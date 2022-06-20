import React, { useEffect, useState } from 'react';
import style from './TableBanner.css';
import { ConfigProvider, Table } from 'antd';
import CommonCard from '../CommonCard';
import DataDecorator from 'services/api/DataDecorator';
import tableEmpty from 'assets/images/table-empty.svg'
import css from './TableBanner.css'

interface Props {
  queryAction: () => Promise<DataDecorator> | undefined;
  title: string;
  scroll?: any
}
export default function TableBanner(props: Props): JSX.Element {
  const [columns, setColumns] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([]);
  const { queryAction, title, ...rest } = props;

  useEffect(() => {
    queryAction()?.then((res) => {
      const columns = res.meta.columns.map((col) => {
        return {
          title: col.name,
          dataIndex: col.name,
          ellipsis: true,
          width: 150,
          key: col.name,
          ...col.name === 'Used' && {
            render: (text: string) => {
              const data = ((+text) * 100).toFixed(2) + '%'
              return <span>{ data }</span>
            }
          }
        };
      });
      setColumns(columns);
      setList(res.rows);
    });
    //
  }, [queryAction]);

  return (
    <CommonCard title={title}>
      <div className={style.tableBanner}>
        <ConfigProvider renderEmpty={
          TableEmpty
        }>
          <Table
            className={style.lightTable}
            columns={columns}
            bordered
            dataSource={list}
            pagination={false}
            {...rest}
          ></Table>
        </ConfigProvider>
      </div>
    </CommonCard>
  );
}

export const TableEmpty = () => (
  <div className={css.tableEmpty}>
    {/* <img src={tableEmpty} alt="" /> */}
    <span>No data</span>
  </div>
)
