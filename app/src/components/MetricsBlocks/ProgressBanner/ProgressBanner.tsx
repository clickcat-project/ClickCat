import React, { useState, useEffect, useMemo } from 'react';
import style from './ProgressBanner.css';
import CommonCard from '../CommonCard';
import DataDecorator from 'services/api/DataDecorator';
import { TableEmpty } from '../TableBanner/TableBanner';

interface Props {
  queryAction: () => Promise<DataDecorator> | undefined;
  title: string;
  backType?: string
}
interface countDataItem {
  name: string;
  value?: number
}
export default function ProgressBanner(props: Props): JSX.Element {
  const { queryAction, title, backType } = props;
  const [countList, setCountList] = useState<countDataItem[]>([]);
  // const [max, setMax] = useState(0);
  useEffect(() => {
    queryAction()?.then((res) => {
      console.log(res);
      setCountList(res.rows.map(item => {
        const { total_rows, total_columns, max_parts_per_partition, name, dbTable } = item
        return {
          name: name || dbTable,
          value: total_rows || total_columns || max_parts_per_partition
        }
      }) as countDataItem[]);
    });
  }, [queryAction]);

  const maxValue = useMemo(() => {
    if (countList.length) {
      const valueArr = countList.map(item => item.value)
      return Math.max(...valueArr as number[])
    }
    return 0
  }, [countList])

  return (
    <CommonCard title={title}>
      { !countList.length ? 
        <div className={style.tableEmptyBox}><TableEmpty></TableEmpty></div> :
        <div className={style.progressBanner}>{countList.map((item) => ProgressItem(item, maxValue, backType))}</div>
      }
    </CommonCard>
  );
}

function ProgressItem(props: countDataItem, maxValue: number, backType?: string): JSX.Element {
  const { name, value = 0 } = props;
  return (
    <div key={name} className={style.progressRow}>
      <div className={style.name}>{name}</div>
      <div className={style.progressLine}>
        <div className={`${style.line} ${backType === 'green' ? style.green : style.yellow}`} style={{width: `${(value/maxValue) * 100}%`}}></div>
      </div>
      <div className={style.number}>{value}</div>
    </div>
  );
}
