<script lang='ts' setup>
import { Edit } from '@element-plus/icons-vue'
import { useSqlStore } from '@/store';
import { useGoTo } from '@/layout/hooks';

const sqlStore = useSqlStore()
const goto = useGoTo()

const props = defineProps<{
  sql: string
}>()

const addEditorTabs = () => {
  sqlStore.addEditorTabs({
    sql: props.sql
  })
  const name = sqlStore.tabs[sqlStore.tabs.length - 1].name
  sqlStore.setActiveTabs(name)
  goto('SQL')
}
</script>
<template>
  <section class="list-item-container">
    <div>{{ sql }}</div>
    <div class="btn-box" @click="addEditorTabs">
      <el-icon>
        <Edit />
      </el-icon>
      <span>编辑</span>
    </div>
  </section>
</template>
<style lang='scss' scoped>
.list-item-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  padding-left: 30px;
  padding-right: 50px;
  margin-bottom: 10px;
  font-size: 16px;
  border: 1px solid #fff;
  background-color: #fff;
  box-sizing: border-box;
  border-radius: 2px;
  cursor: pointer;

  .btn-box {
    display: flex;
    align-items: center;

    span {
      margin-left: 10px;
    }
  }

  &:hover {
    color: var(--el-color-primary);
  }
}
</style>
