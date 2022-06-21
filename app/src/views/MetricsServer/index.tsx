import React from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { typedInject } from '../../module/mobx-utils';
import { Stores, AppStore } from '../../stores';
import { Query } from 'services/api/Query';
import { observer } from 'mobx-react';
import sqls from './sqls';
import CountBanner from 'components/MetricsBlocks/CountBanner';
import ProgressBanner from 'components/MetricsBlocks/ProgressBanner';
import ChartsBanner from 'components/MetricsBlocks/ChartsBanner';
import TableBanner from 'components/MetricsBlocks/TableBanner';
import { Filter } from 'components/MetricsBlocks/Filter/Filters';
import { Collapse } from 'antd';
import moment from 'moment'

import css from './index.css'
import versionImg from 'assets/images/metrics/version.svg'
import dataAnalysisServerUptime from 'assets/images/metrics/server_uptime.svg'
import dataAnalysisTotalRow from 'assets/images/metrics/data_analysis_total_row.svg'
import dataAnalysisTotalColumns from 'assets/images/metrics/data_analysis_total_columns.svg'
import databaseNumber from 'assets/images/metrics/database_number.svg'
import tableNumber from 'assets/images/metrics/table_number.svg'
import totalQueryAnalysis from 'assets/images/metrics/total_query_analysis.svg'
import ave_memory from 'assets/images/metrics/ave_memory.svg'
import ave_time from 'assets/images/metrics/ave_time.svg'
import { getUndefined, getStartAndEndTime, getRealSqlOfArr } from './utils'
import { RouteComponentProps, withRouter } from 'react-router';
import classNames from 'classnames';

// react grid layout
const ResponsiveGridLayout = WidthProvider(Responsive);
interface LayoutOptions {
  x: number;
  y: number;
  w: number;
  h: number;
  component: JSX.Element;
}

type RoutedProps = Props & RouteComponentProps<any>;

function getLayouts(layoutOptions: LayoutOptions[]): {
  layouts: Layout[];
  layoutElement: React.ReactNode;
} {
  const layout: Layout[] = [];
  const layoutElement = layoutOptions.map((item, index) => {
    const key = index.toString();
    layout.push({ i: key, x: item.x, y: item.y, w: item.w, h: item.h });
    return <div key={key}>{item.component}</div>;
  });
  return {
    layouts: layout,
    layoutElement,
  };
}

interface InjectedProps {
  store: AppStore;
}
type Props = InjectedProps;

interface State {
  databasesList: any[];
  tablesList: any[]
}
@observer
class MetricsServer extends React.Component<RoutedProps> {
  databasesList: any[] = [];
  tablesList: any[] = [];
  typeList: any[] = [];
  initialUserList: any[] = [];
  queryKindList: any[] = [];
  state = {
    updateAllList: 0,
    dataAnalysisValue: {
      database: ['All'],
      table: ['All'],
      time: moment.duration(24, 'hours').valueOf() as number
    },
    clusterAnalysisValue: {
      database: ['All'],
      table: ['All'],
      time: moment.duration(24, 'hours').valueOf() as number
    },
    queryAnalysisValue: {
      queryKind: ['All'],
      type: ['All'],
      initialUser: ['All'],
      time: moment.duration(24, 'hours').valueOf() as number
    },
    queryAnalysistTmeOption: { duration: '10 MINUTE' }
  }
  

  queryFn = (q: Query) => {
    const { store } = this.props;
    return () => store.api.value?.fetch(q);
  };

  componentDidMount () {
    const { store } = this.props;
    const promiseAllArr = [
      store.api.value?.fetch(sqls.queryAllDatabases()),
      store.api.value?.fetch(sqls.queryAllTables()),
      store.api.value?.fetch(sqls.queryTypeList()),
      store.api.value?.fetch(sqls.queryKindList()),
      store.api.value?.fetch(sqls.queryInitUserList())
    ]
    Promise.all(promiseAllArr)
      .then(resArr => {
        const listKey = ['databasesList', 'tablesList', 'typeList', 'queryKindList', 'initialUserList']
        listKey.forEach((key, i) => {
          this[key] = [
            {name: 'All'},
            ...(resArr[i]?.rows || [])
              .map(item => {
                const { type, query_kind, initial_user, name } = item
                return {
                  name: name || type || query_kind || initial_user
                }
              })
          ]
        })
      })
      .finally(() => {
        const { updateAllList } = this.state
        this.setState({
          updateAllList: updateAllList + 1
        })
      })
  }

  render() {
    const {
      dataAnalysisValue,
      clusterAnalysisValue,
      queryAnalysisValue,
      queryAnalysistTmeOption,
      updateAllList
    } = this.state
    // ('COLUMNS','SCHEMATA')
    const databaseDataAnalysis = getRealSqlOfArr(getUndefined(dataAnalysisValue.database))
    const tableDataAnalysis = getRealSqlOfArr(getUndefined(dataAnalysisValue.table))
    const databaseClusterAnalysis = getRealSqlOfArr(getUndefined(clusterAnalysisValue.database))
    const [startQueryAnalysis, endQueryAnalysis] = getStartAndEndTime(queryAnalysisValue.time)
    const [startDataAnalysis, endDataAnalysis] = getStartAndEndTime(dataAnalysisValue.time)
    const type = getRealSqlOfArr(getUndefined(queryAnalysisValue.type))
    const queryKind = getRealSqlOfArr(getUndefined(queryAnalysisValue.queryKind))
    const initialUser = getRealSqlOfArr(getUndefined(queryAnalysisValue.initialUser))
    const {duration: timeDuration} = queryAnalysistTmeOption

    const options: LayoutOptions[] = [
      {
        x: 0,
        y: 0,
        w: 6,
        h: 1,
        component: <CountBanner
          // notThousands={true}
          banner={versionImg}
          queryAction={this.queryFn(sqls.queryVersion())}
          outerTitle={'Version'}
        ></CountBanner>,
      },
      {
        x: 6,
        y: 0,
        w: 6,
        h: 1,
        component: <CountBanner
          banner={dataAnalysisServerUptime}
          showType={'duration'}
          outerTitle={'Server uptime'}
          queryAction={this.queryFn(sqls.queryServerUptime())}
        ></CountBanner>,
      },
      {
        x: 12,
        y: 0,
        w: 6,
        h: 1,
        component: <CountBanner
          banner={dataAnalysisTotalRow}
          showType={'toLocaleString'}
          queryAction={this.queryFn(sqls.queryTotalRows())}
        ></CountBanner>,
      },
      {
        x: 18,
        y: 0,
        w: 6,
        h: 1,
        component: <CountBanner
          banner={dataAnalysisTotalColumns}
          showType={'toLocaleString'}
          queryAction={this.queryFn(sqls.queryTotalColumns(
            databaseDataAnalysis,
            tableDataAnalysis
          ))}
        ></CountBanner>,
      },
      {
        x: 0,
        y: 0,
        w: 12,
        h: 2.5,
        component: (
          <ProgressBanner
            queryAction={this.queryFn(sqls.queryTopTablesByRows(
              databaseDataAnalysis,
              tableDataAnalysis
            ))}
            title="Top tables by rows"
          ></ProgressBanner>
        ),
      },
      {
        x: 12,
        y: 0,
        w: 12,
        h: 2.5,
        component: (
          <ProgressBanner
            queryAction={this.queryFn(sqls.queryTopTablesByColumns(
              databaseDataAnalysis,
              tableDataAnalysis
            ))}
            backType={'green'}
            title="Top tables by columns"
          ></ProgressBanner>
        ),
      },
      {
        x: 0,
        y: 0,
        w: 12,
        h: 2,
        component: (
          <ChartsBanner
            queryAction={this.queryFn(sqls.queryDatabaseEngines(databaseDataAnalysis))}
            title="Database engines"
            type="pie"
          ></ChartsBanner>
        ),
      },
      {
        x: 12,
        y: 0,
        w: 12,
        h: 2,
        component: (
          <ChartsBanner
            queryAction={this.queryFn(sqls.queryTableEngines(
              databaseDataAnalysis,
              tableDataAnalysis
            ))}
            title="Table engines"
            type="bar"
          ></ChartsBanner>
        ),
      },
      {
        x: 0,
        y: 1,
        w: 24,
        h: 3,
        component: (
          <ChartsBanner
            queryAction={this.queryFn(sqls.queryPartsOverTimeWithRowCount(
              databaseDataAnalysis,
              tableDataAnalysis,
              startDataAnalysis,
              endDataAnalysis
            ))}
            title="Parts over time with row count"
            type="line"
          ></ChartsBanner>
        ),
      },
      {
        x: 0,
        y: 2,
        w: 12,
        h: 2,
        component: (
          <TableBanner
            queryAction={this.queryFn(sqls.queryDiskUsage())}
            title="Disk usage"
            scroll={{x: '100%', y: 240}}
          ></TableBanner>
        ),
      },
      {
        x: 12,
        y: 2,
        w: 12,
        h: 2,
        component: (
          <TableBanner
            queryAction={this.queryFn(sqls.queryDictionaries())}
            title="Dictionaries"
          ></TableBanner>
        ),
      },
      {
        x: 0,
        y: 3,
        w: 24,
        h: 2.5,
        component: (
          <TableBanner
            queryAction={this.queryFn(sqls.queryDatabaseSummary(
              databaseDataAnalysis,
              tableDataAnalysis
            ))}
            title="Database summary"
            scroll={{y: 240}}
          ></TableBanner>
        ),
      },
      {
        x: 0,
        y: 3,
        w: 12,
        h: 2.5,
        component: (
          <TableBanner
            queryAction={this.queryFn(sqls.queryDetachedPartitions())}
            title="Detached partitions"
            scroll={{y: 240}}
          ></TableBanner>
        ),
      },
      {
        x: 12,
        y: 3,
        w: 12,
        h: 2.5,
        component: (
          <ProgressBanner
            queryAction={this.queryFn(sqls.queryMaxPartsPerPartition())}
            title="Max parts per partition"
          ></ProgressBanner>
        ),
      },
      {
        x: 0,
        y: 4,
        w: 24,
        h: 3,
        component: (
          <TableBanner
            queryAction={this.queryFn(sqls.queryTableSummary(
              databaseDataAnalysis,
              tableDataAnalysis
            ))}
            title="Table summary"
            scroll={{y: 320}}
          ></TableBanner>
        ),
      },
      {
        x: 0,
        y: 5,
        w: 24,
        h: 3,
        component: (
          <TableBanner
            queryAction={this.queryFn(sqls.queryRecentPartAnalysis(
              databaseDataAnalysis,
              tableDataAnalysis
            ))}
            title="Recent part analysis"
            scroll={{y: 320}}
          ></TableBanner>
        ),
      },
    ];

    const clusterAnalysisOptions: LayoutOptions[] = [
      {
        x: 0,
        y: 0,
        w: 4,
        h: 1,
        component: <CountBanner
          numberStyle={{fontSize: 24}}
          banner={versionImg}
          queryAction={this.queryFn(sqls.queryVersion())}
          outerTitle={'Version'}
        ></CountBanner>,
      },
      {
        x: 4,
        y: 0,
        w: 4,
        h: 1,
        component: <CountBanner
          numberStyle={{fontSize: 24}}
          banner={dataAnalysisServerUptime}
          outerTitle={'Server uptime'}
          showType={'duration'}
          queryAction={this.queryFn(sqls.queryServerUptime())}
        ></CountBanner>,
      },
      {
        x: 8,
        y: 0,
        w: 4,
        h: 1,
        component: <CountBanner
          numberStyle={{fontSize: 24}}
          banner={databaseNumber}
          queryAction={this.queryFn(sqls.queryDatabaseNumber(databaseClusterAnalysis))}
          showType={'toLocaleString'}
        ></CountBanner>,
      },
      {
        x: 12,
        y: 0,
        w: 4,
        h: 1,
        component: <CountBanner
          banner={tableNumber}
          queryAction={this.queryFn(sqls.queryTableNumber(databaseClusterAnalysis))}
          showType={'toLocaleString'}
          numberStyle={{fontSize: 24}}
        ></CountBanner>,
      },
      {
        x: 16,
        y: 0,
        w: 4,
        h: 1,
        component: <CountBanner
          // numberStyle={{fontSize: '1rem'}}
          banner={dataAnalysisTotalRow}
          queryAction={this.queryFn(sqls.queryRowNumber(databaseClusterAnalysis))}
          showType={'toLocaleString'}
          numberStyle={{fontSize: 24}}
        ></CountBanner>,
      },
      {
        x: 20,
        y: 0,
        w: 4,
        h: 1,
        component: <CountBanner
          banner={dataAnalysisTotalColumns}
          queryAction={this.queryFn(sqls.queryColumnNumber(databaseClusterAnalysis))}
          showType={'toLocaleString'}
          numberStyle={{fontSize: 24}}
        ></CountBanner>,
      },
      {
        x: 0,
        y: 1,
        w: 24,
        h: 3,
        component: (
          <TableBanner
            queryAction={this.queryFn(sqls.queryClusterOverview())}
            title="Cluster Overview"
            scroll={{y: 320}}
          ></TableBanner>
        ),
      },
      {
        // Merge progress per table
        x: 0,
        y: 2,
        w: 8,
        h: 2,
        component: <ProgressBanner
          queryAction={this.queryFn(sqls.queryMergeProgressPerTable(databaseClusterAnalysis))}
          title="Merge progress per table"
        ></ProgressBanner>,
      },
      {
        x: 8,
        y: 2,
        w: 16,
        h: 2,
        component: <TableBanner
          queryAction={this.queryFn(sqls.queryCurrentMerges(databaseClusterAnalysis))}
          title="Current Merges"
          scroll={{y: 160, x: '100%'}}
        ></TableBanner>,
      },
      {
        x: 0,
        y: 3,
        w: 8,
        h: 2,
        component: <ProgressBanner
          queryAction={this.queryFn(sqls.queryMutattionsPartsRemaining())}
          title="Muations parts remaining"
        ></ProgressBanner>,
        // <ChartsBanner
        //   queryAction={this.queryFn(sqls.queryMutattionsPartsRemaining())}
        //   title="Muations parts remaining"
        //   type="bar"
        // ></ChartsBanner>,
      },
      {
        x: 8,
        y: 3,
        w: 16,
        h: 2,
        component: <TableBanner
          queryAction={this.queryFn(sqls.queryCurrentMutations(databaseClusterAnalysis))}
          title="Current Mutations"
          scroll={{y: 160}}
        ></TableBanner>,
      },
      {
        x: 0,
        y: 4,
        w: 8,
        h: 2,
        component: <ProgressBanner
          queryAction={this.queryFn(sqls.queryReplicatedTablesByDelay(databaseClusterAnalysis))}
          title="Replicated tables by delay"
        ></ProgressBanner>,
      },
      {
        x: 8,
        y: 4,
        w: 16,
        h: 2,
        component: <TableBanner
          queryAction={this.queryFn(sqls.queryReplicatedTablesByDelay(databaseClusterAnalysis))}
          title="Replicated tables by delay"
          scroll={{y: 160}}
        ></TableBanner>,
      },
    ];

    const queryAnalysisOptions: LayoutOptions[] = [
      {
        x: 0,
        y: 0,
        w: 8,
        h: 1,
        component: <CountBanner
          banner={totalQueryAnalysis}
          showType={'toLocaleString'}
          queryAction={
            this.queryFn(
              sqls.queryTotalQueryAnalysis(
                startQueryAnalysis,
                endQueryAnalysis,
                type,
                initialUser,
                queryKind
              )
            )
          }></CountBanner>,
      },
      {
        x: 8,
        y: 0,
        w: 8,
        h: 1,
        component: <CountBanner
          banner={ave_memory}
          showType={'toLocaleString'}
          queryAction={this.queryFn(sqls.queryAveMemoryQueryAnalysis(
            startQueryAnalysis,
            endQueryAnalysis,
            type,
            initialUser,
            queryKind,
            timeDuration
          ))}></CountBanner>,
      },
      {
        x: 16,
        y: 0,
        w: 8,
        h: 1,
        component: <CountBanner
          banner={ave_time}
          showType={'toLocaleString'}
          queryAction={this.queryFn(sqls.queryAveTimeQueryAnalysis(
            startQueryAnalysis,
            endQueryAnalysis,
            type,
            initialUser,
            queryKind,
            timeDuration
          ))}></CountBanner>,
      },
      {
        x: 0,
        y: 1,
        w: 12,
        h: 2,
        component: <ChartsBanner
          queryAction={this.queryFn(sqls.queryTimeDistributionQueryAnalysis(
            startQueryAnalysis,
            endQueryAnalysis,
            type,
            initialUser,
            queryKind
          ))}
          title="Query time distribution"
          type="bar"
        ></ChartsBanner>,
      },
      {
        x: 12,
        y: 1,
        w: 12,
        h: 2,
        component: (
          <ChartsBanner
            queryAction={this.queryFn(sqls.queryTopUsersQueryAnalysis(
              type,
              initialUser,
              queryKind
            ))}
            title="Top users"
            type="pie"
          ></ChartsBanner>
        ),
      },
      {
        x: 0,
        y: 2,
        w: 24,
        h: 3,
        component: (
          <ChartsBanner
            queryAction={this.queryFn(sqls.queryTopOverTimeQueryAnalysis(
              startQueryAnalysis,
              endQueryAnalysis,
              type,
              initialUser,
              queryKind,
              timeDuration
            ))}
            grid={{ height: '65%' }}
            legend={{left: 'top'}}
            title="Top query types over time"
            type="line"
          ></ChartsBanner>
        ),
      },
      {
        x: 0,
        y: 3,
        w: 24,
        h: 5,
        component: (
          <ChartsBanner
            queryAction={this.queryFn(sqls.queryPerformanceQueryAnalysis(
              startQueryAnalysis,
              endQueryAnalysis,
              type,
              initialUser,
              queryKind,
              timeDuration
            ))}
            grid={{ height: '55%' }}
            legend={{left: 'top'}}
            title="Query performance by type over time"
            type="line"
          ></ChartsBanner>
        ),
      },
      {
        x: 0,
        y: 4,
        w: 24,
        h: 3,
        component: (
          <ChartsBanner
            queryAction={this.queryFn(sqls.queryRequestsQueryAnalysis(
              startQueryAnalysis,
              endQueryAnalysis,
              type,
              queryKind,
              timeDuration
            ))}
            title="Query requests by user"
            type="line"
          ></ChartsBanner>
        ),
      },
      {
        x: 0,
        y: 5,
        w: 12,
        h: 3,
        component: (
          <ChartsBanner
            queryAction={this.queryFn(sqls.queryMemoryUsageQueryAnalysis(
              startQueryAnalysis,
              endQueryAnalysis,
              timeDuration
            ))}
            title="Memory usage over time"
            type="line"
          ></ChartsBanner>
        ),
      },
      {
        x: 12,
        y: 5,
        w: 12,
        h: 3,
        component: (
          <ChartsBanner
            queryAction={this.queryFn(sqls.queryReadWriteQueryAnalysis(
              startQueryAnalysis,
              endQueryAnalysis
            ))}
            title="Read vs Write Rows"
            type="line"
          ></ChartsBanner>
        ),
      },
      {
        x: 0,
        y: 6,
        w: 24,
        h: 3,
        component: <TableBanner
          queryAction={this.queryFn(sqls.queryOverviewQueryAnalysis(
            startQueryAnalysis,
            endQueryAnalysis,
            timeDuration
          ))}
          title="Query overview"
          scroll={{y: 320}}
        ></TableBanner>,
      },
    ];
    const { layouts, layoutElement } = getLayouts(options);
    const { layouts: lusterAnalysisLayouts, layoutElement: lusterAnalysisLayoutElement } = getLayouts(clusterAnalysisOptions);
    const { layouts: queryAnalysisLayouts, layoutElement: queryAnalysisLayoutElement } = getLayouts(queryAnalysisOptions);
    return (
      <Collapse className={css.metricsServer} defaultActiveKey={['1']}>
        <Collapse.Panel header="Data Analysis" key="1">
          <>
            <Filter updateAllList={updateAllList} value={dataAnalysisValue} onChange={(value) => {
                this.setState({
                  dataAnalysisValue: value
                })
              }}
              databasesList={this.databasesList}
              tablesList={this.tablesList}
            ></Filter>
            <ResponsiveGridLayout
              className="layout"
              isDraggable={false}
              style={{ background: '#F8F8F8' }}
              isResizable={false}
              layouts={{ lg: layouts, xxs: layouts }}
              cols={{ lg: 24, xxs: 24 }}
            >
              {layoutElement}
            </ResponsiveGridLayout>
          </>
        </Collapse.Panel>
        <Collapse.Panel header="Query Analysis" key="3">
          <>
            <Filter updateAllList={updateAllList} value={queryAnalysisValue} onChange={(value, option) => {
                this.setState({
                  queryAnalysisValue: value,
                  queryAnalysistTmeOption: option ? option : queryAnalysistTmeOption
                })
              }}
              typeList={this.typeList}
              initialUserList={this.initialUserList}
              queryKindList={this.queryKindList}
            ></Filter>
            <ResponsiveGridLayout
              className="layout"
              style={{ background: '#F8F8F8' }}
              isDraggable={false}
              isResizable={false}
              // margin={[8, 8]}
              layouts={{ lg: queryAnalysisLayouts, xxs: queryAnalysisLayouts }}
              cols={{ lg: 24, xxs: 24 }}
            >
              {queryAnalysisLayoutElement}
            </ResponsiveGridLayout>
          </>
        </Collapse.Panel>
        <Collapse.Panel header="Cluster Analysis" key="2">
          <>
            <Filter updateAllList={updateAllList} value={clusterAnalysisValue} onChange={(value) => {
              this.setState({
                clusterAnalysisValue: value
              })
            }} databasesList={this.databasesList} tablesList={this.tablesList}></Filter>
            <ResponsiveGridLayout
              className="layout"
              isDraggable={false}
              style={{ background: '#F8F8F8' }}
              isResizable={false}
              // margin={[8, 8]}
              layouts={{ lg: lusterAnalysisLayouts, xxs: lusterAnalysisLayouts }}
              cols={{ lg: 24, xxs: 24 }}
            >
              {lusterAnalysisLayoutElement}
            </ResponsiveGridLayout>
          </>
        </Collapse.Panel>
      </Collapse>
    );
  }
}

export default withRouter(typedInject<InjectedProps, RoutedProps, Stores>(({ store }) => ({
  store: store.appStore,
}))(MetricsServer));
