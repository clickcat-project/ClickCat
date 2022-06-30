<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { CommonObj } from './metrics/types';

const props = defineProps<{
  queryFunc: () => Promise<any>,
}>()

const columns = ref<{name: string}[]>([])
const tableData = ref<CommonObj[]>([])
const loading = ref<boolean>(true)

const getData = () => {
  loading.value = true
  props.queryFunc()
    .then((res) => {
      columns.value = res.meta.map((item: { name: string; }) => {
        return {
          name: item.name
        }
      })
      tableData.value = res.data
    })
    .finally(() => {
      loading.value = false
    })
}

onBeforeMount(() => {
  getData()
})

const emit = defineEmits(['selectionChange'])

const handleSelectionChange = (val: any[]) => {
  emit('selectionChange', val)
}

const refresh = () => {
  getData()
}

defineExpose({
  refresh
})
</script>
<template>
<section class="common-table-container" v-loading="loading">
  <el-table
    v-if="!loading"
    :data="tableData"
    style="width: 100%;"
    height="100%"
    tooltip-effect="dark"
    :border="true"
    @selection-change="handleSelectionChange"
  >
    <el-table-column fixed="left" type="selection" width="55" />
    <template
      v-for="col in columns"
      :key="col.name"
    >
      <el-table-column
        :show-overflow-tooltip="true"
        :prop="col.name"
        :label="col.name"
        min-width="150"
      />
    </template>
  </el-table>
</section>
</template>
<style lang='scss' scoped>
.common-table-container {
  width: 100%;
  height: 100%;
}
</style>