<route>
{
  name: "SQL",
  meta: { title: 'SQL' }
}
</route>
<script lang='ts' setup>
import FilterVue from '@/components/sql/Filter.vue';
import SimpleEditorVue from '@/components/sql/SimpleEditor.vue';
</script>
<template>
  <section class="SQL-container">
    <aside class="sidebar">
      <FilterVue />
    </aside>
    <section class="content">
      <SimpleEditorVue />
    </section>
  </section>
</template>
<style lang='scss' scoped>
.SQL-container {
  display: grid;
  grid-template-columns: 290px auto;
  grid-template-rows: auto;
  width: 100%;
  height: 100%;

  & > aside.sidebar {
    background-color: #10223E;
    overflow-y: auto;
  }
  & > section.content {
    background-color: #fff;
  }
}
</style>
