import React, { useEffect, useRef } from 'react';
import style from './ChartsBanner.css';
import CommonCard from '../CommonCard';
import DataDecorator from 'services/api/DataDecorator';
import * as echarts from 'echarts/core';
import {
  generatePieInstance,
  formatPieOptions,
  generateBarInstance,
  formatBarOptions,
  generateLineInstance,
  formatLineOptions,
} from './echarts';
import { dealWithLineData } from './utils'

type chartsType = 'pie' | 'bar' | 'line';
interface Props {
  queryAction: () => Promise<DataDecorator> | undefined;
  title: string;
  type: chartsType;
  grid?: { [key: string]: string },
  legend?: { [key: string]: string },
}
export default function ChartsBanner(props: Props): JSX.Element {
  const { queryAction, title, type, grid, legend } = props;
  const renderer = useRef<HTMLDivElement | null>(null);
  let formatOption: any;
  let chartInstance: echarts.ECharts | null = null;
  useEffect(() => {
    if (renderer.current !== null) {
      ({ chartInstance, formatOption } = getCurrentChart(type, renderer.current));
    }
  });
  useEffect(() => {
    queryAction()?.then((res) => {
      let nameCol = '';
      let valueCol = '';
      let data: any = []
      if (res.meta.columns.length === 3) {
        data = dealWithLineData(res)
      } else if (res.meta.columns.length === 2) {
        res.meta.columns.forEach((col) => {
          if (col.index === 0) {
            nameCol = col.name;
          } else {
            valueCol = col.name;
          }
        });
        data = res.rows.map((item) => {
          return {
            name: item[nameCol],
            value: item[valueCol],
          };
        });
      } else if (res.meta.columns.length === 1) {
        nameCol = res.meta.columns[0].name;
        valueCol = res.meta.columns[0].name;
        data = res.rows.map((item) => {
          return {
            name: nameCol,
            value: item[valueCol],
          };
        });
      }
      setTimeout(() => {
        if (!data || !data.length) {
          chartInstance?.dispose()
        } else {
          chartInstance?.setOption(formatOption(data, grid, legend));
        }
      })
    });
  }, [queryAction]);
  return (
    <CommonCard title={title}>
      <div ref={renderer} className={style.chartsRenderer}></div>
    </CommonCard>
  );
}

export function getCurrentChart(type: chartsType, renderer: HTMLElement) {
  let chartInstance: echarts.ECharts | null = null;
  let formatOption: (data: any) => void = () => undefined;
  switch (type) {
    case 'pie':
      chartInstance = generatePieInstance(renderer);
      formatOption = formatPieOptions;
      break;
    case 'bar':
      chartInstance = generateBarInstance(renderer);
      formatOption = formatBarOptions;
      break;
    case 'line':
      chartInstance = generateLineInstance(renderer);
      formatOption = formatLineOptions;
      break;
    default:
      break;
  }
  return {
    chartInstance,
    formatOption,
  };
  //
}
