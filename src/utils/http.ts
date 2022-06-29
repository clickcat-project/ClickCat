import { useLioginOutsideStore } from '@/store/modules/login'

function getRequestInit(query?: string, isLogin: boolean = false): RequestInit {
  const init: RequestInit = {
    mode: 'cors',
    method: isLogin ? 'get' : 'post',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept-Encoding': 'gzip',
    },
    body: query,
    // credentials: 'include', // Error : The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.
  }
  return init
}

function request(request: Request | string, init?: RequestInit) {
  return fetch(request, init)
    .then((response) => {
      const contentType = response.headers.get('content-type')
      if (
        contentType &&
        response.status === 200 &&
        response.statusText.toLowerCase() === 'ok' &&
        (contentType.includes('text/plain') ||
          contentType.includes('application/xml') ||
          contentType.includes('text/csv') ||
          contentType.includes('text/tab-separated-values'))
      ) {
        // if create table && drop table
        return Promise.resolve(response.text())
      }
      if (
        contentType &&
        contentType.includes('application/json') &&
        response.status >= 200 &&
        response.status < 300
      ) {
        // return Promise.resolve(response);
        return response.json()
      }
      return response.text().then(Promise.reject.bind(Promise)) // refactor ???
      // return response.text();
    })
    .then(
      (response) => {
        if (response === 'OK' || !response) {
          return 'OK'
        }
        return response
      },
      // refactor: use catch
      (responseBody) => Promise.reject(responseBody)
    )
}

type Connection = {
  connectionUrl: string,
  password: string,
  username: string
}

function getRequestUrl(connection?: Connection, settings?: string): string {
  if (!connection) {
    throw new Error('No Connection')
  }
  const httpProto = connection.connectionUrl.indexOf('//') === -1 ? 'http://' : ''
  // this.connection.connectionUrl.indexOf('/') > 0

  let url = `${httpProto}${connection.connectionUrl}`
  // add /?
  url = `${url}/?output_format_json_quote_denormals=1&output_format_json_quote_64bit_integers=1&log_queries=1&enable_http_compression=1&add_http_cors_header=1&result_overflow_mode=throw&timeout_overflow_mode=throw&max_execution_time=10&max_result_rows=90000&max_result_bytes=10000000`
  // output_format_json_quote_denormals=1&output_format_json_quote_64bit_integers=1&log_queries=1&enable_http_compression=1&add_http_cors_header=1&result_overflow_mode=throw&timeout_overflow_mode=throw&max_execution_time=10&max_result_rows=90000&max_result_bytes=10000000
  // const settings: object = this.getPresetSettings(extendSettings, this.connection.params);

  // url += Object.entries(settings)
  //   .map(([key, val]) => `${key}=${val}`)
  //   .join('&');
  if (connection.password) {
    url += `&user=${encodeURIComponent(connection.username)}&password=${encodeURIComponent(
      connection.password
    )}`
  } else {
    url += `&user=${encodeURIComponent(connection.username)}`
  }

  if (settings) {
    url += settings
  }

  // if (withDatabase) {
  //   url += `&database=${encodeURIComponent(withDatabase)}`;
  // }

  return url
}

export function query(sql?: string, settings?: string, connection?: Connection, isLogin: boolean = false): Promise<any> {
  const sqlStr = sql ? (sql.includes('FORMAT JSON') ? sql : sql + '\n\n FORMAT JSON') : undefined

  const init = getRequestInit(sqlStr, isLogin)
  const loginStore = useLioginOutsideStore()
  const connectionData = connection ?? loginStore.connection
  const url = getRequestUrl(connectionData, settings)
  return request(url, init)
    .then((r) => {
      return r
    })
    .catch((e) => {
      // return { response: null, query: q as Query, error: e, isError: true } as QueryResponse;
    })
}