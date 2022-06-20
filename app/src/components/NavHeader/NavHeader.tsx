import React from 'react';
import css from './NavHeader.css';
import { RootStore } from 'stores';
import { TabType } from 'models';
import { observer } from 'mobx-react';
import { typedInject } from 'module/mobx-utils';
import { AuthorizationContext } from 'module/react-auth';
import { LogoutOutlined } from '@ant-design/icons'
import { ActionType } from 'components/Dashboard/Tabs';
import { withRouter, RouteComponentProps } from 'react-router';
import { AppStore, Stores } from 'stores';
import logo from '../../assets/images/logo.svg'
import { routePaths } from 'routes';

// interface Props {
//   onMenuAction?: (action: ActionType) => void
// }

type RoutedProps = Props & RouteComponentProps<any>;

interface InjectedProps {
  store: AppStore;
}
type Props = {onMenuAction?: (action: ActionType) => void} & InjectedProps;

@observer
class Page extends React.Component<RoutedProps> {
  static contextType = AuthorizationContext;
  render() {
    const { location, store, history } = this.props
    return (
      <div className={css.root}>
        <div className={css.logo} onClick={() => {
          this.props.history.push('/metrics')
          // allStore.changeCurrentPage(TabType.Metrics)
        }}>
          <img src={logo} alt="" />
          <span className={`${css.systitle} ${css.logoText}`}>ClickCat</span>
        </div>

        <div className={css.funlist}>
          <span
          //  
            className={
              `${css.systitle} ${location.pathname !== routePaths.metrics.path ? '' : css.active} ${css.navHover}`
            }
            onClick={() => {
              // allStore.changeCurrentPage(TabType.Metrics)
              this.props.history.push(routePaths.metrics.path)
            }}
          >
            Metrics
          </span>
          {/* ${allStore.currentPage ? '' : css.active} */}
          <span className={`${css.systitle} ${location.pathname !== routePaths.dashboard.path ? '' : css.active} ${css.navHover}`} onClick={() => {
            // allStore.changeCurrentPage('')
            this.props.history.push(routePaths.dashboard.path)
          }}>
            SQL
          </span>
          {/*  ${allStore.currentPage !== TabType.Processes ? '' : css.active} */}
          <span className={
            `${css.systitle} ${location.pathname !== routePaths.processes.path ? '' : css.active} ${css.navHover}`
          } onClick={() => {
            // allStore.changeCurrentPage(TabType.Processes)
            this.props.history.push(routePaths.processes.path)
          }}>
            Processes
          </span>
          <span
            className={
              `${css.systitle} ${location.pathname !== routePaths.machineLearning.path ? '' : css.active} ${css.navHover}`
            }
            onClick={() => {
              this.props.history.push(routePaths.machineLearning.path)
            }}
          >
            Machine Learning
          </span>
           {/* ${allStore.currentPage  !== TabType.SqlHistory ? '' : css.active} */}
          <span
            className={
              `${css.systitle} ${location.pathname !== routePaths.sqlHistory.path ? '' : css.active} ${css.navHover}`
            }
            style={{ marginRight: '47px' }}
            onClick={() => {
              // allStore.changeCurrentPage(TabType.SqlHistory)
              this.props.history.push(routePaths.sqlHistory.path)
            }}
          >
            History SQL
          </span>
          <div className={css.userInfo} onClick={() => {
            // console.log(onMenuAction, 'onMenuAction')
            store.logout(history)
          }}>
            {/* <UserOutlined style={{ marginRight: '10px' }} />
            hello, { userInfo.connectionName }
            <SyncOutlined style={{ marginLeft: '23px', marginRight: '25px', color: 'var(--color-yellow-text)' }} />
            <SettingFilled style={{ color: 'var(--color-yellow-text)' }} /> */}
            <LogoutOutlined style={{ marginRight: '10px' }} />
            Sign out
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(
  typedInject<InjectedProps, RoutedProps, Stores>(({ store }) => ({
    store: store.appStore,
  }))(Page)
)
