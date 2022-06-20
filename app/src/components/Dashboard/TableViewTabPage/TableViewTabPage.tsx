import React from 'react';
import { DataDecorator, Query, RequestPool, ServerStructure } from 'services';
import { TableViewTabModel } from 'models';
import { DataTable } from '../index';
import { Row, Button, Drawer, Tabs, Table, notification, ConfigProvider } from 'antd';
import { typedInject } from '../../../module/mobx-utils';
import SimpleEditor from '../EditorTabPage/SqlEditor/SimpleEditor';
import { TableFilter } from './TableFilter';
import { Flex } from 'reflexy';
import css from './TableViewTabPage.css'
import Actions from '../EditorTabPage/Tabs/Actions';

import { Stores, TabsStore } from '../../../stores';
import { ResultTabActionType } from '../EditorTabPage/Tabs';
import { ExportData } from '../EditorTabPage/DataTable';
import FullScreener from '../EditorTabPage/FullScreener';
import { TableEmpty } from 'components/MetricsBlocks/TableBanner/TableBanner';
import { getColumns } from 'views/ProcessesView/utils';

const { TabPane } = Tabs;
interface InjectedProps {
  store: TabsStore;
  serverStructure?: ServerStructure.Server;
  model: TableViewTabModel;
}

type Props = InjectedProps;

export class TableViewTabPage extends React.Component<Props> {
  state = {
    dataUpdate: Date.now(),
    describe: '',
    visibleTableFilter: false,
    rows: 100,
    enterFullScreen: false,
    dataTabData: new DataDecorator(),
    statsData: new DataDecorator(),
    tableHeight: 400
  };
  private columnsTableHeight: number | undefined = 400
  private data: DataDecorator = new DataDecorator();

  // statsData: DataDecorator = new DataDecorator();
  // dataTabData: DataDecorator = new DataDecorator();

  private getPool = (tableName: string): RequestPool => {
    const { api } = this.props.store;
    return {
      DESCRIBE: api.prepared().template('DESCRIBE TABLE ' + tableName),
      SHOWCREATE: api.prepared().template('SHOW CREATE TABLE ' + tableName),
    };
  };
  componentDidMount() {
    this.setState({
      tableHeight: (document.querySelector('.table-view-tab-page-table-container')?.getBoundingClientRect().height || 400) - 45
    })
    this.columnsTableHeight = (document.querySelector('.table-view-tab-page-columns-table-container')?.getBoundingClientRect().height || 400) - 35
    this.loadDescribe();
    this.getStats()
    this.getTabsDataData()
    // const screen = document.querySelector('.tableViewTabPageInnerTabs')?.querySelector('.fullscreen') as HTMLBaseElement
    // screen.style.height = '100%'
  }
  onTab = (activeKey: string) => {
    console.log('ON TAB Open', activeKey);
  };

  private loadDescribe = () => {
    this.requestTableDescribe().then((e) => {
      // console.log('ON TAB', e);
      let describe = 'Error can`t fetch:SHOW CREATE TABLE';

      if (!e['SHOWCREATE'].isError) {
        const d = new DataDecorator(e['SHOWCREATE']);
        describe = d.getStatementResponse();
      }
      if (!e['DESCRIBE'].isError) {
        this.data = new DataDecorator(e['DESCRIBE']);
      }

      this.setState({ describe: describe, dataUpdate: Date.now() });
    });
  };
  private getStats () {
    const { api } = this.props.store;
    const tableId = this.props.model.tableId;
    const [database, table] = tableId.split('.')
    api.fetch(new Query(
      `SELECT table,
      sum(rows)    AS rows,
      formatReadableSize(sum(bytes)) as size,
      min(min_date) as min_date,
      max(max_date) as max_date
      FROM system.parts
      WHERE active
      and database = '${database}' and table = '${table}'
      GROUP BY table FORMAT JSON;`
    ))
      .then(res => {
        this.setState({
          statsData: res
        })
      })
  }
  private getTabsDataData (subEvent: number | string = 100) {
    const { api } = this.props.store;
    // const { rows } = this.state
    const tableId = this.props.model.tableId;
    const [database, table] = tableId.split('.')
    // `sql = 'select * from ${database}.${table}'
    //   sql = require("sql-limiter").limit(sql, ['limit'], +rows)
    //   FORMAT JSON;`
    let sql = `select * from ${database}.${table}`
    sql = require("sql-limiter").limit(sql, ['limit'], +subEvent)
    api.fetch(new Query(
      `${sql}
      FORMAT JSON;`
    ))
      .then(res => {
        this.setState({
          dataTabData: res
        })
      })
  }
  private requestTableDescribe = async () => {
    const { api } = this.props.store;
    const { model } = this.props;
    const tableId = model.tableId;
    return await api.fetchPool(this.getPool(tableId));
  };
  private onResultTabAction = (action: ResultTabActionType, subEvent = '') => {
    const { model } = this.props;

    switch (action) {
      case ResultTabActionType.Fullscreen: {
        const v = this.state.enterFullScreen;
        this.setState({
          enterFullScreen: !v,
        });
        // this.tableHeight = (document.querySelector('.table-view-tab-page-table-container')?.getBoundingClientRect().height || 400) - 45
        break;
      }
      case ResultTabActionType.Export: {
        try {
          if (!this.state.dataTabData.rows.length) {
            notification.error({
              key: 'exportError',
              message: 'Export',
              description: 'No data',
              duration: 2
            })
          } else {
            ExportData(this.state.dataTabData, subEvent, model.title);
          }
        } catch (error) {
          notification.error({
            key: 'exportError',
            message: 'Export',
            description: 'No data',
            duration: 2
          })
        }
        break;
      }
      case ResultTabActionType.ChangeRows: {
        this.setState({
          rows: subEvent
        })
        this.getTabsDataData(subEvent)
        break;
      }
      default:
        break;
    }
  };

  render() {
    const { serverStructure } = this.props;
    const { describe, dataTabData } = this.state;
    const statsDataList = this.state.statsData.rows.length ?
      this.state.statsData.meta.columns.map(item => {
        return {
          key: item.name,
          name: item.name,
          value: this.state.statsData.rows[0][item.name]
        }
      }) :
      []
    const columns = getColumns(dataTabData)
    const columnsTabColumns = getColumns(this.data)

    return (
      <div style={{ height: '100%' }}>
        {/* <Divider orientation="left" style={{ margin: ' 5px 0' }} plain>
          <TableOutlined /> {tableId}
        </Divider> */}

        <Tabs
          type="card"
          defaultActiveKey="3"
          className={css.TableViewTabPageOuterTabs}
          onTabClick={this.onTab}
          onChange={this.onTab}
          style={{ height: '100%' }}
        >
          <TabPane tab="Properties" key="1">
            <Tabs
              className={`${css.TableViewTabPageInnerTabs} tableViewTabPageInnerTabs`}
              tabPosition={'left'}
              style={{height: '100%'}}
              defaultActiveKey={'Columns'}
            >
              <TabPane tab="Columns" key="Columns">
                <div style={{height: '100%'}} className={'table-view-tab-page-columns-table-container'}>
                  <ConfigProvider renderEmpty={
                    TableEmpty
                  }>
                    <Table
                      className='light-table'
                      bordered
                      dataSource={this.data.rows.map((item, index) => ({...item, key: index}))}
                      pagination={false}
                      scroll={{x: '100%', y: this.columnsTableHeight}}
                      columns={columnsTabColumns}
                    />
                  </ConfigProvider>
                </div>
              </TabPane>
              <TabPane tab="Statistics" key="Statistics">
                <ConfigProvider renderEmpty={
                  TableEmpty
                }>
                  <Table
                    bordered
                    dataSource={statsDataList}
                    className='light-table'
                    pagination={false}
                    columns={
                      [
                        {
                          title: 'Name',
                          dataIndex: 'name',
                          key: 'name',
                          width: 328,
                        },
                        {
                          title: 'Value',
                          dataIndex: 'value',
                          key: 'value',
                        }
                      ]
                    }   
                  />
                </ConfigProvider>
              </TabPane>
              <TabPane tab="DDL" key="DDL">
                <SimpleEditor content={describe} serverStructure={serverStructure} />
              </TabPane>
            </Tabs>
          </TabPane>

          <TabPane className='table-view-full-screen-container' tab="Data" key="3">
            <FullScreener enter={this.state.enterFullScreen} afterChange={() => {
              setTimeout(() => {
                this.setState({
                  tableHeight: (document.querySelector('.table-view-tab-page-table-container')?.getBoundingClientRect().height || 400) - 45
                })
              })
            }}>
              <Actions containerClass={'table-view-full-screen-container'} className={css.actions} onAction={this.onResultTabAction}></Actions>
              <div className={'table-view-tab-page-table-container'} style={{ height: 'calc(100% - 36px)' }}>
                <ConfigProvider renderEmpty={
                  TableEmpty
                }>
                  <Table
                    className='light-table'
                    bordered
                    dataSource={dataTabData.rows.map((item, index) => ({...item, key: index}))}
                    pagination={false}
                    scroll={{x: '100%', y: this.state.tableHeight}}
                    columns={columns}   
                  />
                </ConfigProvider>
                {/* <DataTable flexStyle={{height: '100%'}} dataUpdate={dataUpdate} data={this.state.dataTabData} /> */}
              </div>
            </FullScreener>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default typedInject<InjectedProps, Props, Stores>(({ store }, { model }) => ({
  store: store.tabsStore,
  model,
}))(TableViewTabPage);
