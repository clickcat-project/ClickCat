<route>
{
  name: "Processes",
  meta: { title: 'Processes' }
}
</route>
<script lang='ts' setup>
import { onMounted } from 'vue'
// import { testApi } from '../../api/index'

onMounted(() => {
  // testApi('1234').then(res => {
  //   console.log(res)
  // })
})
</script>
<template>
  <el-tabs type="border-card">
    <el-tab-pane label="Processes">
      
    </el-tab-pane>
    <el-tab-pane label="Mutations" :lazy="true">Config</el-tab-pane>
  </el-tabs>
</template>
<style lang='scss' scoped>
 
</style>
