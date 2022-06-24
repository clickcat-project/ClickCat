import { ProxyOptions } from 'vite'
type ProxyTargetList = Record<string, ProxyOptions>;

const init: ProxyTargetList = {
  '/server': {
    target: 'http://192.168.9.114:8080',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/server/, '')
  },
}

export default init
