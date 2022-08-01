import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { router } from './router'
import i18n from './i18n'

// reset css
import '@/assets/scss/common.scss'
import '@/assets/scss/resetvar.scss'

// 支持SVG
import 'virtual:svg-icons-register'

// pinia
import piniaStore from './store'
import { addRouteHooks } from './router/utils'

const app = createApp(App)
app.use(i18n)
app.use(ElementPlus)
app.use(addRouteHooks(router))
app.use(piniaStore)
app.mount('#app')
