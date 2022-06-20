import React from 'react';
import { observer } from 'mobx-react';
import { typedInject } from 'module/mobx-utils';
import { List } from 'antd';
import { PaginationConfig } from 'antd/lib/pagination';
import { RootStore, SqlHistoryStore, Stores, TabsStore } from 'stores';
import { eventBus, EventType } from 'services/sqlHistoryStorage';
import ListItem, { ListItemProps } from './ListItem';
import css from './SqlHistoryTabPage.css';
import emptyImg from 'assets/images/empty.svg'
import { withRouter, RouteComponentProps } from 'react-router';
import { routePaths } from 'routes';

const paginationConfig: PaginationConfig = {
  pageSize: 5,
  hideOnSinglePage: true,
  size: 'small',
};

interface InjectedProps {
  store: SqlHistoryStore;
  tabStore: TabsStore
}

type Props = InjectedProps

type RoutedProps = Props & RouteComponentProps<any>;

@observer
class SqlHistoryTabPage extends React.Component<RoutedProps> {
  componentDidMount() {
    this.load();
    eventBus.on(EventType.UpdateHistory, this.load);
  }

  componentWillUnmount() {
    eventBus.off(EventType.UpdateHistory, this.load);
  }

  private load = () => {
    this.props.store.loadData();
  };

  private renderItem = (item: string) => <ListItem content={item} onEdit={(...rest) => {
    this.props.tabStore.openNewEditorTab(...rest)
    this.props.history.push(routePaths.dashboard.path)
  }} />;

  render() {
    const { store } = this.props;
    if (!store.history.length) {
      return <div className={css.historyEmpty}>
        <div>
          <img style={{width: '234px'}} src={emptyImg} alt="" />
          <span>No data</span>
        </div>
      </div>
    }

    return (
      <div className={css.root}>
        {/* store.history */}
        <List
          dataSource={store.history.filter(item => !!item)}
          renderItem={this.renderItem}
          pagination={paginationConfig}
        />
      </div>
    );
  }
}

export default withRouter(typedInject<InjectedProps, RoutedProps, Stores>(({ store }) => ({
  store: store.sqlHistoryStore,
  tabStore: store.tabsStore,
}))(SqlHistoryTabPage));
