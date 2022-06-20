import React, { useState, useEffect } from 'react';
import style from './CountBanner.css';
import CommonCard from '../CommonCard';
import DataDecorator from 'services/api/DataDecorator';
import moment from 'moment'

interface Props {
  queryAction: () => Promise<DataDecorator> | undefined;
  banner: any,
  notThousands?: boolean,
  outerTitle?: string,
  showType?: string,
  numberStyle?: any
}

export const number2Other = (val: number, type?: string): number | string => {
  // 利用 toLocaleString 的特性将数字转成带 , 的字符串
  if (type === 'toLocaleString') {
    return val.toLocaleString()
  }
  // 将时间转换为天数
  if (type === 'duration') {
    // return moment.utc().startOf('year').add({ seconds: val }).format('D[Day]HH[Hour]');
    const duration = moment.duration(val, 'seconds')
    const days = duration.days()
    const hours = duration.hours()
    if (days === 0 && hours === 0) {
      const minute = duration.minutes()
      const second = duration.seconds()
      return `
        ${ minute ? minute + 'Minute' : '' }
        ${ second ? second + 'Second' : '' }
      `
    }
    return `
      ${ days ? days + ' day' : '' }
      ${ hours ? hours + ' hour' : '' }
    `
  }
  // 不传 type ，直接返回
  return val
}

export default function CountBanner(props: Props): JSX.Element {
  const [number, setNumber] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const { queryAction, banner, outerTitle, showType, numberStyle} = props;
  useEffect(() => {
    queryAction()?.then((res) => {
      const current = res.rows[0] ? res.rows[0] : {};
      const key = Object.keys(res.rows[0])[0];
      const value = current[key];
      const valueNum = +value
      setNumber(valueNum || value || 0);
      setTitle(key || '');
    });
  }, [queryAction]);
  return (
    <CommonCard>
      <div className={style.countBanner}>
        <div>
          <div style={numberStyle} className={`${style.number} ${style.dinBoldFont}`}>{
            number2Other(number, showType)
          }</div>
          {/* dinBold */}
          <div className={`${style.title}`}>{outerTitle || title}</div>
        </div>
        <img src={banner} alt="" className={style.icon} />
      </div>
    </CommonCard>
  );
}
