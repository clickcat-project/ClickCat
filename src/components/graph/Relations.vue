<template>
  <div class="relation-details">
    <el-radio-group
      v-model="type"
    >
      <el-radio-button label="Tables" />
      <el-radio-button label="RelationShips" />
    </el-radio-group>

    <div class="type-list">
      <div
        v-for="item of typeList[type]"
        :key="item.name"
        class="type-item"
      >
        <span
          class="type-name"
          :style="{color: item.color, border: `1px solid ${item.color}`}"
        >{{ item.name }}</span>
        <span
          class="type-color"
          :style="{background: item.color}"
        ></span>
      </div>
    </div>
  </div>
</template>
<script lang='ts' setup>
import {ref} from 'vue'

const type = ref('Tables')

defineProps({
  typeList: {
    type: Object,
    default() {
      return {
        Tables: [],
        RelationShips: []
      }
    }
  }
})
</script>
<style lang='scss' scoped>
.relation-details{
  background: #ffffff;
  z-index: 1000;
  position: fixed;
  right: 30px;
  bottom: calc(43.6vh + 60px);
  width: 298px;
  height: 33.6vh;
  border: 1px solid #E4E4E4;
  display: flex;
  flex-direction: column;
  :deep(.el-radio-button__inner){
    width: 149px;
  }
  .type-list{
    height: calc(33.6vh - 32px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    .type-item{
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 16px;
      .type-color{
        width: 22px;
        height: 22px;
        border-radius: 11px;
        margin: 0 19px 0 12px;
        background: #F4AA3A;
      }
      .type-name{
        height: 32px;
        line-height: 32px;
        text-align: center;
        padding: 0 20px;
        background: rgba(244, 170, 58, 0.16);
        color: #F4AA3A;
        border-radius: 114px;
        cursor: pointer;
      }
    }
  }
}
</style>
