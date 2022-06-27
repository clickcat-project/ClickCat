<route>
{
  name: "Processes",
  meta: { title: 'Processes' }
}
</route>
<script lang='ts' setup>
import CommonTableVue from '@/components/CommonTable.vue';
import { queryProcesses, queryMutations } from './query';
</script>
<template>
  <section class="processes-container">
    <el-tabs type="border-card">
      <el-tab-pane label="Processes">
        <CommonTableVue :query-func="queryProcesses"></CommonTableVue>
      </el-tab-pane>
      <el-tab-pane label="Mutations" :lazy="true">
        <CommonTableVue :query-func="queryMutations"></CommonTableVue>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<style lang='scss' scoped>
.processes-container {
  width: 100%;
  height: 100%;
  padding: 20px 30px;
  background-color: #f8f8f8;
  box-sizing: border-box;

  & > .el-tabs--border-card {
    border: unset;
  }
  & > .el-tabs {
    width: 100%;
    height: 100%;
  }

  :deep(.el-tabs__content) {
    min-height: calc(100% - 36px);
    box-sizing: border-box;
  }

  :deep(.el-tab-pane) {
    height: 100%;
  }
  :deep(.el-tabs--border-card>.el-tabs__header .el-tabs__item) {
    border: unset;
  }
  :deep(.el-tabs__item) {
    background-color: #E1E0DD;
  }
  :deep(.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active) {
    background-color: #FFB300;
    color: #fff;
  }
  :deep(.el-popper) {
    max-width: 600px;
  }
  :deep(.el-table th.el-table__cell) {
    background-color: #fbfbfb;
  }
}
</style>
