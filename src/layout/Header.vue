<script setup lang="ts">
import logo from '@/assets/images/logo.svg'
import logout from '@/assets/images/login/logout.svg'
import { useRoute, useRouter } from 'vue-router'
import { useGoTo } from './hooks'
import { RouteName } from './types'
import i18n from '@/i18n'

import.meta.env.VITE_SOME_KEY

const router = useRouter()
const route = useRoute()
const goTo = useGoTo()

const getNavList = () => {
  const routes= [RouteName.Metrics,
  RouteName.SQL,
  RouteName.Processes]
  if (import.meta.env.VITE_ENABLE_GRAPH == 'true') {
    routes.push(RouteName.Graph)
  }
  if (import.meta.env.VITE_ENABLE_ML == 'true') {
    routes.push(RouteName.Ml)
  }
  routes.push(RouteName.HistorySQL)
  return routes
}

const nvaList = [RouteName.SQL]

const hasRouteName = (item: string) => {
  return (route.name as string)?.startsWith(item)
}

const logoutFunc = () => {
  router.push({
    path: '/login'
  })
}
const goMetrics = () => {
  goTo(RouteName.Metrics)
}

const handleChangeLocale = (locale: 'zh' | 'en') => {
  localStorage.setItem('locale', locale)
  i18n.global.locale = locale
}
const goGithub = () => {
  window.open('https://github.com/clickcat-project/ClickCat', '_blank')
}
</script>

<template>
  <div class="header">
    <div
      class="logo-container"
      @click="goMetrics"
    >
      <img
        :src="logo"
        alt="ClickCat"
        title="ClickCat"
      />
      <span>ClickCat</span>
    </div>
    <div class="nav-container">
      <nav class="nav">
        <span
          v-for="item in getNavList()"
          :key="item"
          :class="{active: hasRouteName(item)}"
          @click="goTo(item)"
        >
          {{ $t(item) }}
        </span>
      </nav>
      <div
        class="logout"
      >
        <span
          style="margin-right: 15px"
          @click="goGithub"
        >
          <img
            style="height: 18px;width: auto;"
            src="https://img.shields.io/github/stars/clickcat-project/clickcat?style=social"
            alt=""
          >
          <!-- <svg
            preserveAspectRatio="xMidYMid meet" 
            viewBox="0 0 24 24" width="1.2em" 
            height="1.2em" data-v-6c8d2bba="">
            <path fill="currentColor" d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.338 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.688c-.1-.25-.45-1.275.1-2.65c0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337c1.912-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.562 4.938c.362.312.675.912.675 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z"></path>
          </svg> -->
        </span>
        
        <el-dropdown @command="handleChangeLocale">
          <svg
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
            width="1.2em"
            height="1.2em"
            data-v-dd9c9540=""
          >
            <path
              fill="currentColor"
              d="m18.5 10l4.4 11h-2.155l-1.201-3h-4.09l-1.199 3h-2.154L16.5 10h2zM10 2v2h6v2h-1.968a18.222 18.222 0 0 1-3.62 6.301a14.864 14.864 0 0 0 2.336 1.707l-.751 1.878A17.015 17.015 0 0 1 9 13.725a16.676 16.676 0 0 1-6.201 3.548l-.536-1.929a14.7 14.7 0 0 0 5.327-3.042A18.078 18.078 0 0 1 4.767 8h2.24A16.032 16.032 0 0 0 9 10.877a16.165 16.165 0 0 0 2.91-4.876L2 6V4h6V2h2zm7.5 10.885L16.253 16h2.492L17.5 12.885z"
            ></path>
          </svg>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="en">
                En
              </el-dropdown-item>
              <el-dropdown-item command="zh">
                Zh
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        

        <img
          :src="logout"
          alt="logout"
          style="margin-left: 15px;"
          title="logout"
          @click="logoutFunc"
        />
        <span @click="logoutFunc">{{ $t('Sign out') }}</span>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  width: 100%;
  height: 64px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
  z-index: 10;
}
.logo-container {
  display: flex;
  align-items: center;
  cursor: pointer;

  span {
    font-size: 20px;
    color: #10223E;
  }
}
.nav-container {
  display: flex;
  height: 100%;
}
.nav {
  margin-right: 30px;

  span {
    display: inline-block;
    margin-left: 10px;
    padding: 0 20px;
    font-weight: bold;
    line-height: 62px;
    cursor: pointer;
    box-sizing: border-box;

    &.active {
      color: #FFB300;
      border-bottom: #FFB300 2px solid;
    }
  }
}
.logout {
  display: flex;
  align-items: center;
  cursor: pointer;
  img {
    width: 20px;
  }
  img:hover + span {
    color: var(--el-color-primary);
  }
  span:hover {
    color: var(--el-color-primary);
  }
  span {
    display: inline-block;
    padding-left: 10px;
    font-size: 14px;
    color: rgba(62, 62, 69, 0.65);
  }
}
</style>
