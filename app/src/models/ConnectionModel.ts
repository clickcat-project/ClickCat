/* global clickCatConfig */
import { observable } from 'mobx';
import { None } from 'funfix-core';
import { required } from 'valtors';
import { ValidableStoreModel, SerializableModel, JSONModel } from 'module/mobx-utils';
import {
  ConnectionLike,
  Connection,
  DirectConnection,
  ServerConnection,
  isDirectConnection,
  ConnectionType,
  ConnectionInit,
  DemoConnection,
  isDemoConnection,
} from 'services';
import appStorage from 'services/appStorage';

export abstract class BaseConnectionModel<T extends Connection> extends ValidableStoreModel<T>
  implements ConnectionLike, SerializableModel<T> {
  @required()
  @observable
  connectionName: string = '';

  @required()
  @observable
  connectionUrl: string = '';

  @required()
  @observable
  username: string = '';

  @observable
  password: string = '';

  version: string = '';

  abstract toJSON(): JSONModel<T>;
}

export class DirectConnectionModel extends BaseConnectionModel<DirectConnection>
  implements DirectConnection {
  type: ConnectionType.Direct = ConnectionType.Direct;

  @observable
  params?: string;

  constructor({
    connectionName = '',
    connectionUrl = '',
    username = '',
    password = '',
    params,
  }: Partial<DirectConnection>) {
    super({
      type: { error: None },
      connectionName: { error: None },
      connectionUrl: { error: None },
      username: { error: None },
      password: { error: None },
      params: { error: None },
      version: { error: None },
    });

    appStorage.getItem('clickCatLastLogin')
      .then((res) => {
        if (res) {
          this.connectionName = (res as Connection).connectionName;
          this.connectionUrl = (res as Connection).connectionUrl;
          this.username = (res as Connection).username;
          this.password = (res as Connection).password;
        } else {
          this.connectionName = connectionName;
          this.connectionUrl = connectionUrl;
          this.username = username;
          this.password = password;
          this.params = params;
        }
      })
  }

  toJSON(): JSONModel<DirectConnection> {
    return {
      type: this.type,
      connectionName: this.connectionName,
      connectionUrl: this.connectionUrl,
      username: this.username,
      password: this.password,
      params: this.params,
      version: this.version,
    };
  }
}

declare global {
  const clickCatConfig: any
}

export class DemoConnectionModel extends BaseConnectionModel<DirectConnection>
  implements DirectConnection {
  type: ConnectionType.Demo = ConnectionType.Demo;

  @observable
  params?: string;

  constructor({
    connectionName = '',
    connectionUrl = '',
    username = '',
    password = '',
    params,
  }: Partial<DirectConnection>) {
    super({
      type: { error: None },
      connectionName: { error: None },
      connectionUrl: { error: None },
      username: { error: None },
      password: { error: None },
      params: { error: None },
      version: { error: None },
    });
    this.connectionName = 'ck';
    this.connectionUrl = clickCatConfig.defaultLoginHost;
    this.username = 'default';
    this.password = clickCatConfig.defaultLoginSecret;
    this.params = '';
  }

  toJSON(): JSONModel<DirectConnection> {
    return {
      type: this.type,
      connectionName: this.connectionName,
      connectionUrl: this.connectionUrl,
      username: this.username,
      password: this.password,
      params: this.params,
      version: this.version,
    };
  }
}

export class ServerConnectionModel extends BaseConnectionModel<ServerConnection>
  implements ServerConnection {
  type: ConnectionType.Server = ConnectionType.Server;

  @observable
  configKey?: string;

  constructor({
    connectionName = '',
    connectionUrl = '',
    username = '',
    password = '',
    configKey,
  }: Partial<ServerConnection>) {
    super({
      type: { error: None },
      connectionName: { error: None },
      connectionUrl: { error: None },
      username: { error: None },
      password: { error: None },
      configKey: { error: None },
      version: { error: None },
    });

    this.connectionName = connectionName;
    this.connectionUrl = connectionUrl;
    this.username = username;
    this.password = password;
    this.configKey = configKey;
  }

  toJSON(): JSONModel<ServerConnection> {
    return {
      type: this.type,
      connectionName: this.connectionName,
      connectionUrl: this.connectionUrl,
      username: this.username,
      password: this.password,
      configKey: this.configKey,
      version: this.version,
    };
  }
}

const ConnectionModel = {
  // Can edited and saved
  DirectEmpty: new DirectConnectionModel({ type: ConnectionType.Direct }),
  Demo: new DemoConnectionModel({ type: ConnectionType.Demo }),
  ServerEmpty: new ServerConnectionModel({ type: ConnectionType.Server }),

  of(connection: ConnectionInit) {
    if ((connection as ConnectionModel).changeField) {
      return connection as ConnectionModel;
    }
    // Ds
    return isDirectConnection(connection)
      ? (isDemoConnection(connection) ? new DemoConnectionModel(connection) : new DirectConnectionModel(connection))
      : new ServerConnectionModel(connection);
  },
};

type ConnectionModel = DirectConnectionModel | ServerConnectionModel | DemoConnectionModel;

export default ConnectionModel;
