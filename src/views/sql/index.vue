<route>
{
  name: "SQL",
  meta: { title: 'SQL' }
}
</route>
<script lang='ts' setup>
import FilterVue from '@/components/sql/Filter.vue';
// import SimpleEditorVue from '@/components/sql/SimpleEditor.vue';
import EditorTabsVue from '@/components/sql/EditorTabs.vue';
</script>
<template>
  <section class="SQL-container">
    <aside class="sidebar">
      <FilterVue />
    </aside>
    <section class="content">
      <EditorTabsVue />
    </section>
  </section>
</template>
<style lang='scss' scoped>
.SQL-container {
  display: grid;
  grid-template-columns: 290px 1fr;
  grid-template-rows: 1fr;
  width: 100%;
  height: 100%;

  & > aside.sidebar {
    height: 100%;
    background-color: #10223E;
    overflow-y: auto;
  }
  & > section.content {
    position: relative;
    height: 100%;
    background-color: #fff;
  }
}
</style>
