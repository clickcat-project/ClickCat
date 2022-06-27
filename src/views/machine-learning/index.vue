<route>
{
  name: "Machine Learning",
  meta: { title: '工作台' }
}
</route>
<script lang='ts' setup>
import ListVue from '@/components/machine-learning/List/List.vue';
</script>
<template>
  <section class="ml-container">
    <ListVue />
  </section>
</template>
<style lang='scss' scoped>
.ml-container {
  width: 100%;
  height: 100%;
  padding: 20px 30px;
  background-color: #f8f8f8;
  box-sizing: border-box;
  overflow-y: auto;
}
</style>
