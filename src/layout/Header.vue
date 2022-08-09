<script setup lang="ts">
import logo from '@/assets/images/logo.svg'
import logout from '@/assets/images/login/logout.svg'
import { useRoute, useRouter } from 'vue-router'
import { useGoTo } from './hooks'
import { RouteName } from './types'
import i18n from '@/i18n'

const router = useRouter()
const route = useRoute()
const goTo = useGoTo()

const nvaList = [
  RouteName.Metrics,
  RouteName.SQL,
  RouteName.Processes,
  RouteName.Graph,
  RouteName.Ml,
  RouteName.HistorySQL
]
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
          v-for="item in nvaList"
          :key="item"
          :class="{active: route.name === item}"
          @click="goTo(item)"
        >
          {{ $t(item) }}
        </span>
      </nav>
      <div
        class="logout"
      >
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
          style="margin-left: 30px;"
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
  margin-right: 66px;

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
