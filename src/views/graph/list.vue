<route>
{
  name: "GraphList",
  meta: { title: 'Graph' }
}
</route>
<template>
  <section class="graph-list-container">
    <ListVue @to-result="toResult" />
  </section>
</template>

<script lang='ts' setup>
import ListVue from '@/components/graph/List/List.vue'

const toResult = () => {
  console.log('跳转关系图')
}
</script>
<style lang='scss' scoped>
.graph-list-container {
  width: 100%;
  height: 100%;
  padding: 20px 30px;
  background-color: #f8f8f8;
  box-sizing: border-box;
  overflow-y: auto;
}
</style>