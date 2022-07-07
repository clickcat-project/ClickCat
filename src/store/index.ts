import { createPinia } from 'pinia'
import { useAppStore } from './modules/app'
import { useLoginStore } from './modules/login'
import { useSqlStore } from './modules/sql'
import piniaPersist from 'pinia-plugin-persist'

const pinia = createPinia()
pinia.use(piniaPersist)

export { useAppStore, useLoginStore, useSqlStore }
export default pinia
