import { Omit } from 'typelevel-ts';

export interface ConnectionLike {
  connectionName: string;
  connectionUrl: string;
  username: string;
  password: string;
  version: string;
}

export enum ConnectionType {
  Direct = 'direct',
  Server = 'server',
  Demo = 'DEMO'
}

export interface DirectConnection extends ConnectionLike {
  type: string;
  params?: string;
}

export interface DemoConnection extends ConnectionLike {
  type: string;
  params?: string;
}

export interface ServerConnection extends ConnectionLike {
  type: string;
  configKey?: string;
}

type Connection = DirectConnection | ServerConnection | DemoConnection;

export type ConnectionInit = Partial<Omit<Connection, 'type'>> & Pick<Connection, 'type'>;

export function isDirectConnection(connection: ConnectionInit): connection is DirectConnection {
  return ConnectionType.Direct === connection.type;
}

export function isDemoConnection(connection: ConnectionInit): connection is DemoConnection {
  return ConnectionType.Demo === connection.type;
}

// Just to avoid warnings when reexporting types when compile with webpack and tsc module option is 'esnext'.
const Connection = {};

export default Connection;
