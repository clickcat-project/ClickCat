import { resolve } from 'path'
import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import VitePages from 'vite-plugin-pages'
import proxy from './config/vite/proxy'
import { APP_TITLE, VITE_PORT } from './config/constant'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: /@\//,
        replacement: pathResolve('src') + '/',
      },
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.cjs.js'
        // 'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      }
    ],
  },
  // server配置
  server: {
    hmr: { overlay: true }, // 禁用或配置 HMR 连接 设置 server.hmr.overlay 为 false 可以禁用服务器错误遮罩层
    // 服务配置
    port: VITE_PORT, // 类型： number 指定服务器端口;
    open: true, // 类型： boolean | string在服务器启动时自动在浏览器中打开应用程序；
    cors: true, // 类型： boolean | CorsOptions 为开发服务器配置 CORS。默认启用并允许任何源
    host: '0.0.0.0', // IP配置，支持从IP启动
    proxy,
  },
  plugins: [
    vue(), 
    monacoEditorPlugin(),
    VitePages({
      dirs: 'src/views',
      exclude: ['**/components/*.vue', '**/views/**/login.vue']
    }),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    })
  ],
  build: {
    outDir: APP_TITLE,
    rollupOptions: {
      output: {
        manualChunks(id, other) {
          if (!id.includes('node_modules')) {
            if (id.includes('components/sql')) {
              return id.split('components/sql')[1].split('/')[1].replace('.vue', '')
            }
          }
        }
      }
    }
  },
})