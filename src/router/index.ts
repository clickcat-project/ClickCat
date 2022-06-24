import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import menuRoutes from 'virtual:generated-pages'
type RouteItem = RouteRecordRaw & { meta: AppRoute.RouteMeta }

const routes: RouteItem[] = [
  {
    path: '',
    component: () => import('@/layout/index.vue'),
    meta: {},
    redirect: '/metrics',
    children: menuRoutes
  },
  {
    path: '/login',
    component: () => import('@/views/login.vue'),
    meta: {}
  }
]

export const menuRoutesList = menuRoutes

export const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteItem[]
})