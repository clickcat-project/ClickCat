import React from 'react';
import { Select, Divider, Space, Modal, Table, ConfigProvider } from 'antd';
import { typedInject } from 'module/mobx-utils';
import { Stores, TabsStore } from 'stores';
import { observer } from 'mobx-react';
import { DataDecorator } from 'services';
import { CloseOutlined, UndoOutlined, InfoCircleOutlined } from '@ant-design/icons';
import css from './ProcessesTabPage.css'
import {
  Tabs,
  TabsTabPane,
} from 'components/Dashboard';
import { Query } from 'services/api/Query';
import { formatJson } from 'views/MetricsServer/sqls';
import classNames from 'classnames';
import { RouteComponentProps, withRouter } from 'react-router';
import { getColumns } from './utils'
import { TableEmpty } from 'components/MetricsBlocks/TableBanner/TableBanner';
// import { useVT } from 'virtualizedtableforantd4'

interface InjectedProps {
  store: TabsStore;
}
enum ListOptions {
  LOG = 'Log mode',
  CLUSTER = 'Talk Cluster',
  SELECT = 'Only Select',
  PROFILE = 'Detail Profile',
}
type Props = InjectedProps;

type RoutedProps = Props & RouteComponentProps<any>;

const IOption = Select.Option;

@observer
class ProcessesTabPage extends React.Component<RoutedProps> {
  protected data: DataDecorator = new DataDecorator();
  protected mutationData: DataDecorator = new DataDecorator();
  selectedRows: any[] = [];
  selectedMutationRows: any[] = [];
  private tableHeight: number | undefined = 400

  PresetOptions = {
    [ListOptions.LOG]: true,
    [ListOptions.CLUSTER]: false,
    [ListOptions.SELECT]: true,
    [ListOptions.PROFILE]: false,
  };

  state = {
    intervalId: undefined,
    settingsOptions: [] as Array<string>,
    dataUpdate: Date.now(),
    columns: [],
    interval: 0.1,
    isPlaying: false,
    countError: 0,
    countSuccess: 0,
    size: 10,
    processRows: [] as any[],
    mutationRows: [] as any[],
    activeKey: ''
  };
  constructor(props: any) {
    super(props);

    const set: Array<string> = [];
    for (const [key, value] of Object.entries(this.PresetOptions)) {
      if (value) set.push(key);
    }
    this.state.settingsOptions = set;
    this.update();
  }

  componentDidMount() {
    this.tableHeight = (document.querySelector('.ProcessesTabPageSelector .ant-tabs-content')?.getBoundingClientRect().height || 400) - 45
    this.play();
    //
  }

  componentWillUnmount() {
    this.cleanTimer();
  }

  private handleChange = (value: string) => {
    const v = parseFloat(value);
    this.setState({ interval: v });
  };

  private onChangeSettings = (settingsOptions: any) => {
    this.setState({ settingsOptions });
  };

  private cleanTimer = () => {
    if (this.state.intervalId) {
      clearTimeout(this.state.intervalId);
    }
  };

  private stop = () => {
    this.setState({ isPlaying: false });
    this.cleanTimer();
  };

  private runTimer = (interval: number) => {
    // this.cleanTimer();
    const intervalId = setTimeout(this.update, 1000 * interval);
    this.setState({ intervalId });
  };

  private reset = () => {
    this.counterSet(0, 0);
    this.data.reset();
    this.setState({ dataUpdate: this.data.dataUpdate });
  };

  private playStop = () => {
    // if Play & Stop
    if (this.state.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  };

  private play = () => {
    this.reset();
    this.setState({ isPlaying: true });
    this.update();
  };

  private timerTic() {
    if (this.state.isPlaying) {
      this.runTimer(this.state.interval);
    }
  }

  private sortingSet = (coll: any) => {
    if (typeof coll === 'object') {
      const dcoll = coll;
      const sort = ['bytes', 'memory_usage', 'bytes_read', 'bytes_written'];
      if (sort.indexOf(dcoll.name) !== -1) {
        dcoll.useHumanSort = true;
      }
      return dcoll;
    }
    return true;
  };

  private counterSet(error: number, ok: number) {
    // Set
    this.setState({ countError: error, countSuccess: ok });
  }
  private is(n: string): boolean {
    return this.state.settingsOptions.indexOf(n) !== -1;
  }
  private update = () => {
    const { store } = this.props;
    store
      .getProcessLists(this.is(ListOptions.SELECT), this.is(ListOptions.CLUSTER))
      .then((data) => {
        // Inc
        if (data.isError) {
          throw Error(data.error ?? 'Error1');
        }
        data.response.data = data.response.data.map((item: any) => {
          return {
            ...item,
            choosed: false
          }
        })
        this.data.apply(data.response);
      })
      .catch((e) => {
        console.log('Error', e);
      })
      .finally(() => {
        this.setState({ dataUpdate: this.data.dataUpdate });
      })

    store
      .getMutationLists(this.is(ListOptions.SELECT), this.is(ListOptions.CLUSTER))
      .then((data) => {
        // Inc
        if (data.isError) {
          throw Error(data.error ?? 'Error1');
        }
        data.response.data = data.response.data.map((item: any) => {
          return {
            ...item,
            choosed: false
          }
        })
        this.mutationData.apply(data.response);

      })
      .catch((e) => {
        console.log('Error', e);
      });
  };

  render() {
    // const [ vt, set_components ] = useVT(() => ({ scroll: { y: 600 } }), []);
    const ratesOptions = [
      // { label: '0.1 seconds', value: 0.1 },
      { label: '0.5 seconds', value: 0.5 },
      { label: '1 seconds', value: 1 },
      { label: '2 seconds', value: 2 },
      { label: '5 seconds', value: 5 },
    ];
    const { store } = this.props;
    //
    const { activeKey } = this.state;

    const children: Array<React.ReactElement> = [];
    const settings: Array<React.ReactElement> = [];

    ratesOptions.forEach((item) => {
      children.push(<IOption key={item.value.toString()}>{item.label}</IOption>);
    });
    for (const [key] of Object.entries(this.PresetOptions)) {
      settings.push(<IOption key={key}>{key}</IOption>);
    }
    const rowSelection = {
      onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
        this.selectedRows = selectedRows
      },
    };
    const rowMutationSelection = {
      onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
        this.selectedMutationRows = selectedRows
      },
    };
    const dataColumns = getColumns(this.data)
    const mutationColumns = getColumns(this.mutationData)

    return (
      <div className={classNames(css.ProcessesTabPage, 'ProcessesTabPageSelector')}>
        <Tabs
          defaultActiveKey='Processes'
          onEdit={() => {}}
          onChange={(key) => {
            this.selectedRows = []
            this.setState({
              activeKey: key
            })
          }}
          onMenuAction={() => {}}
          hideAdd={true}
          tabBarExtraContent={
            <Space style={{paddingRight: '26px'}}>
              <span className={css.tableBtnHover} onClick={() => {
                let query = ''
                if (activeKey === 'Processes') {
                  const idArr = this.selectedRows.map(item => {
                    return `query_id ='${item.query_id}'`
                  })
                  // KILL QUERY WHERE query_id='2-857d-4a57-9ee0-327da5d60a90' or  query_id='2-857d-4a57-9ee0-327da5d60a90'
                  query = `KILL QUERY WHERE ${idArr?.join(' or ')}`
                } else if (activeKey === 'Mutations') {
                  // KILL MUTATION WHERE database = 'default' AND table = 'table' AND mutation_id = 'mutation_3.txt'
                  const idArr = this.selectedMutationRows.map(item => {
                    return `database = '${item.database}' AND table = '${item.table}' AND mutation_id='${item.mutation_id}'`
                  })
                  query = `KILL MUTATION WHERE ${idArr?.join(' or ')}`
                }
                Modal.confirm({
                  title: 'Kill',
                  icon: <InfoCircleOutlined />,
                  okText: 'Confirm',
                  content: 'Kill selected data?',
                  cancelText: 'Cancel',
                  style: {
                    zIndex: 10000
                  },
                  onOk: () => {
                    store.api.fetch(new Query(formatJson(query)))
                      .then(res => {
                        this.play()
                      })
                  }
                })
              }} style={{cursor: 'pointer'}}>
                <CloseOutlined style={{color: '#FF4D4F', marginRight: '10px'}} />
                Kill
              </span>
              <Divider type="vertical" />
              <span className={css.tableBtnHover} style={{cursor: 'pointer'}} onClick={this.play}>
                <UndoOutlined style={{ marginRight: '10px' }} />
                Refresh
              </span>
            </Space>
          }
        >
          <TabsTabPane
            key={'Processes'}
            tab={'Processes'}
            closable={false}
          >
            <ConfigProvider renderEmpty={
              TableEmpty
            }>
              <Table
                rowSelection={{
                  type: 'checkbox',
                  ...rowSelection,
                }}
                className={'light-table'}
                pagination={false}
                bordered
                scroll={{x: '100%', y: '100%'}}
                columns={dataColumns}
                dataSource={this.data.rows.map((item, index) => ({...item, key: index}))}
              />
            </ConfigProvider>
            {/* <DataTable checkbox={true} ref={this.processTableRef} dataUpdate={dataUpdate} data={this.data} fill /> */}
          </TabsTabPane>

          <TabsTabPane
            key={'Mutations'}
            tab={'Mutations'}
            closable={false}
          >
            <ConfigProvider renderEmpty={
              TableEmpty
            }>
              <Table
                rowSelection={{
                  type: 'checkbox',
                  ...rowMutationSelection,
                }}
                style={{height: '100%'}}
                className={'light-table'}
                pagination={false}
                bordered
                scroll={{x: '100%', y: this.tableHeight}}
                columns={mutationColumns}
                dataSource={this.mutationData.rows.map((item, index) => ({...item, key: index}))}
              />
            </ConfigProvider>
            {/* <DataTable checkbox={true} ref={this.mutationTableRef} dataUpdate={dataUpdate} data={this.mutationData} fill /> */}
          </TabsTabPane>
        </Tabs>
      </div>
    );
  }
}
export default withRouter(typedInject<InjectedProps, RoutedProps, Stores>(({ store }) => ({
  store: store.tabsStore,
}))(ProcessesTabPage));
