import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Flex } from 'reflexy';
import { Tabs, Row, Col, Badge } from 'antd';
import { observer } from 'mobx-react';
import { typedInject } from 'module/mobx-utils';
import { SignInStore, Stores } from 'stores';
import { Connection, ConnectionType, isDemoConnection, isDirectConnection } from 'services';
import { ConnectionModel } from 'models';
import Page from 'components/Page';
import { DirectSignInForm } from 'components/SignIn';
import {
  ClockCircleOutlined,
} from '@ant-design/icons';
import css from './SignInView.css';
import loginLeftBottom from '../../assets/images/login-left-bottom.png'
import loginLeftTop from '../../assets/images/login-left-top.png'
import loginRight from '../../assets/images/login-right.png'
import logo from '../../assets/images/logo.svg'
import appStorage from 'services/appStorage';

interface InjectedProps {
  store: SignInStore;
}
export type Props = InjectedProps;
type RoutedProps = Props & RouteComponentProps<any>;

@observer
class SignInView extends React.Component<RoutedProps> {
  componentDidMount() {
    const { store } = this.props;
    store.loadConnections();
    // store.checkVersionUpdateTabix();
  }

  private onSelectConnection = (connection: Connection) => {
    const { store } = this.props;
    store.setSelectedConnection(connection);
  };

  private hasField () {
    const { store } = this.props;
    const { connectionName, connectionUrl, username, password } = store.selectedConnection
    return !!(connectionName || connectionUrl || username || password)
  }

  private onChangeTab = async (key: string) => {
    const { store } = this.props;
    // const connection = await appStorage.getItem('clickCatLastLogin')
    // if (ConnectionType.Direct === key && connection && !this.hasField()) {
    //   store.setSelectedConnection(connection as Connection);
    // } else {
      const con =
        ConnectionType.Direct === key ? ConnectionModel.DirectEmpty : ConnectionModel.ServerEmpty;
      
      store.setSelectedConnection(key === ConnectionType.Demo ? ConnectionModel.Demo : con);
    // }
  };

  private signIn = () => {
    const { store, history } = this.props;
    store.signIn(history);
  };

  renderFooter() {
    const { store } = this.props;
    return (
      <div style={{ textAlign: 'center' }}>
        Tabix ©{new Date().getFullYear()} Version: {store.tbxUpdate.currentVersion}&nbsp;
        {store.tbxUpdate.needUpdate ? (
          <Badge count={<ClockCircleOutlined style={{ color: '#f5222d' }} />}>
            ,
            <a target="_blank" href={store.tbxUpdate.link} rel="noreferrer">
              Update new version {store.tbxUpdate.newVersion}
            </a>
          </Badge>
        ) : (
          'is last'
        )}
      </div>
    );
  }

  render() {
    const { store } = this.props;
    //pass:checkVersionUpdateTabix123
    return (
      <Page className={css.loginContainer}
        column={false} uiStore={store.uiStore}>
        <img className={css.loginLeftBottom} src={loginLeftBottom} alt="" />
        <img className={css.loginLeftTop} src={loginLeftTop} alt="" />
        <img className={css.loginRight} src={loginRight} alt="" />

        <Flex shrink={false} center fill>
          <Flex column>
            <Col>
              <section className={css.loginTitle}>
                <img style={{width: '63px', marginRight: '16px'}} src={logo} alt="" />
                ClickCat
              </section>
              <Row>
                <Tabs
                  type="line"
                  activeKey={
                    isDirectConnection(store.selectedConnection)
                      ? (isDemoConnection(store.selectedConnection) ? ConnectionType.Demo : ConnectionType.Direct)
                      : (isDemoConnection(store.selectedConnection) ? ConnectionType.Demo : ConnectionType.Server)
                  }
                  onChange={this.onChangeTab}
                  className={css.form}
                >
                  <Tabs.TabPane tab="DIRECT CH" key={ConnectionType.Direct}>
                    {isDirectConnection(store.selectedConnection) && (
                      <DirectSignInForm
                        className={css.directSignInForm}
                        model={store.selectedConnection}
                        onDelete={store.deleteSelectedConnection}
                        onSignIn={this.signIn}
                        deleteEnabled={!!store.selectedConnection.connectionName}
                      />
                    )}
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="DEMO" key={ConnectionType.Demo}>
                    {isDemoConnection(store.selectedConnection) && (
                      <DirectSignInForm
                        className={css.directSignInForm}
                        model={store.selectedConnection}
                        onDelete={store.deleteSelectedConnection}
                        onSignIn={this.signIn}
                        deleteEnabled={!!store.selectedConnection.connectionName}
                      />
                    )}
                  </Tabs.TabPane>
                </Tabs>
              </Row>
            </Col>
          </Flex>
        </Flex>
      </Page>
    );
  }
}

export default withRouter(
  typedInject<InjectedProps, RoutedProps, Stores>(({ store }) => ({ store: store.signInStore }))(
    SignInView
  )
);
