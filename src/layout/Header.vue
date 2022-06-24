<script setup lang="ts">
import logo from '@/assets/images/logo.svg'
import logout from '@/assets/images/login/logout.svg'
import { useRoute, useRouter } from 'vue-router'
import { useGoTo } from './hooks'

const router = useRouter()
const route = useRoute()
const goTo = useGoTo()

const nvaList = ['Metrics', 'SQL', 'Processes', 'Machine Learning', 'History SQL']
const logoutFunc = () => {
  router.push({
    path: '/login'
  })
}
</script>

<template>
  <div class="header">
    <div class="logo-container">
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
          {{ item }}
        </span>
      </nav>
      <div
        class="logout"
        @click="logoutFunc"
      >
        <img
          :src="logout"
          alt="logout"
          title="logout"
        />
        <span>Sign out</span>
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
  z-index: 1;
}
.logo-container {
  display: flex;
  align-items: center;

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
    margin-right: 10px;
  }
  &:hover span {
    color: var(--el-color-primary);
  }
  span {
    font-size: 14px;
    color: rgba(62, 62, 69, 0.65);
  }
}
</style>
