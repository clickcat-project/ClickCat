<script lang='ts' setup>
import { ref } from 'vue'
import ListVue from '@/components/machine-learning/List/List.vue'
import Add from '@/components/machine-learning/add/Add.vue'
import ResultVue from '@/components/machine-learning/Result.vue'

enum PageType {
  List = 'list',
  Add = 'add',
  Result = 'result'
}

const current = ref<'list' | 'add' | 'result'>('list')
const selectedItem = ref<any>(null)

const add = () => {
  current.value = PageType.Add
}

const toResult = (item: any) => {
  selectedItem.value = item
  current.value = PageType.Result
}

const toList = () => {
  current.value = PageType.List
}
</script>
<template>
  <section class="ml-container">
    <ListVue
      v-if="current === PageType.List"
      @add="add"
      @to-result="toResult"
    />
    <Add
      v-if="current === PageType.Add"
      @toResult="toResult"
      @toList="toList"
    />
    <ResultVue
      v-if="current === PageType.Result"
      :selected-item="selectedItem"
      @toList="toList"
    />
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
