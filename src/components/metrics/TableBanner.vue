<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'

import Card from './Card.vue'
import { CommonObj, DataQueryFunc } from './types'

const props = defineProps<{
  title: string,
  height?: number,
  queryFunc: DataQueryFunc,
  sqlFuncName: string,
  database?: string,
  table?: string,
  timeRange?: string[],
  type?: string,
  user?: string,
  queryKind?: string,
  timeDuration?: string,
}>()

const columns = ref<{name: string}[]>([])
const tableData = ref<CommonObj[]>()

const getData = () => {
  const { database, table, type, user, queryKind, timeDuration, timeRange = [] } = props
  props.queryFunc(
    props.sqlFuncName,
    {
      database,
      table,
      type,
      initial_user: user,
      query_kind: queryKind,
      startTime: timeRange[0],
      endTime: timeRange[1],
      timeDuration
    }
  )
    .then((res) => {
      columns.value = res.meta.map(item => {
        return {
          name: item.name
        }
      })
      tableData.value = res.data
    })
}

watch([
  () => props.database,
  () => props.table,
  () => props.timeRange,
  () => props.type,
  () => props.user,
  () => props.queryKind,
  () => props.timeDuration,
], () => {
  getData()
})

onBeforeMount(() => {
  getData()
})

</script>
<template>
  <Card
    :title="title"
    :height="height || 310"
  >
    <section class="table-content">
      <el-table
        :data="tableData"
        style="width: 100%"
        height="100%"
        tooltip-effect="dark"
        :border="true"
      >
        <template
          v-for="col in columns"
          :key="col.name"
        >
          <el-table-column
            v-if="col.name !== 'Used'"
            :show-overflow-tooltip="true"
            :prop="col.name"
            :label="col.name"
            min-width="150"
          >
            <template #header>
              <el-tooltip
                placement="top"
                :content="col.name"
              >
                <div class="table-header ellipsis">
                  {{ col.name }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :show-overflow-tooltip="true"
            :prop="col.name"
            :label="col.name"
            min-width="150"
          >
            <template #default="scope">
              <span>{{ (scope.row[col.name] * 100).toFixed(2) + '%' }}</span>
            </template>
          </el-table-column>
        </template>
        
        <!-- <template #default="scope">
            <div class="ellipsis">
              {{ scope.row[col.name] }}
            </div>
          </template>
        </el-table-column> -->
      </el-table>
    </section>
  </Card>
</template>
<style lang='scss' scoped>
.card-container {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.table-content {
  width: 100%;
  height: 100%;
  padding: 30px 20px;
  box-sizing: border-box;
}
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>