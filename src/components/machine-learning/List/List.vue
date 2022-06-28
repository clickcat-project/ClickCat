<script lang='ts' setup>
import { onBeforeMount, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useLoginStore } from '@/store';

import ListItemVue from './ListItem.vue';

import { queryList } from '../query'

const loginStore = useLoginStore()
const emit = defineEmits(['add', 'toResult'])
const list = ref<{job_name: string}[]>([])

onBeforeMount(async () => {
  const data = await queryList(loginStore.connection)
  list.value = data
})

const add = () => {
  emit('add')
}
const toResult = (item: any) => {
  emit('toResult', item)
}
</script>
<template>
  <section class="ml-list-container" :style="!list.length ? {gridTemplateColumns: 'repeat(auto-fit, 300px)'} : {}">
    <section class="list-box add-btn" @click="add">
      <el-icon :size="18">
        <Plus />
      </el-icon>
      <span class="add-text">NEW</span>
    </section>
    <ListItemVue v-for="(item, i) in list" :item="item" :key="i" @to-result="toResult"></ListItemVue>
  </section>
</template>
<style lang='scss' scoped>
.ml-list-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-auto-rows: 162px;;
  grid-gap: 20px;
  width: 100%;
}
.list-box {
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 6px;
}
.list-title-box {
  width: 100%;
  padding: 26px 20px;
}
.list-title {
  margin-bottom: 26px;
  font-size: 16px;
  line-height: 16px;
  color: rgba(0, 0, 0, 0.85);
}
.list-btn-box {
  display: flex;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid #F0F0F0;
}
.list-btn {
  width: 276px;
  height: 32px;
  color: var(--color-yellow-text);
  line-height: 30px;
  border: 1px solid var(--tab-bg);
  border-radius: 2px;
  text-align: center;
  cursor: pointer;
}
.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 1.6px dashed #ABABAB;
  cursor: pointer;
}

.add-btn .add-text {
  color: rgba(0, 0, 0, 0.85);
}
.add-icon {
  font-size: 18px;
  color: rgba(0, 0, 0, 0.85);
}
.empty {
  width: 100%;
  height: 300px;
  text-align: center;
  line-height: 300px;
  color: rgba(0, 0, 0, 0.85);
}
</style>
