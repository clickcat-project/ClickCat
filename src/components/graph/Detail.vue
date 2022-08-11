<template>
  <div class="graph-details">
    <div class="details-title">
      <span class="title">details</span>
      <SvgIcon
        class="close"
        name="svg-close"
        @click="emit('closeDetail')"
      ></SvgIcon>
    </div>

    <div class="details-content">
      <div
        v-for="(value, key) in detailData.nodeInfo"
        :key="key"
        class="detail-item"
      >
        <p class="label">
          {{ key }}
        </p>
        <p class="value">
          {{ value }}
        </p>
      </div>
    </div>
  </div>
</template>
<script lang='ts' setup>
import SvgIcon from '@/components/SvgIcon/index.vue'

defineProps({
  detailData: {
    type: Object,
    default() {
      return {
        nodeInfo: {}
      }
    }
  }
})

const emit = defineEmits(['closeDetail'])
</script>
<style lang='scss' scoped>
.graph-details{
  z-index: 1000;
  position: fixed;
  right: 30px;
  bottom: 30px;
  height: 43.6vh;
  border: 1px solid #E4E4E4;
  display: flex;
  flex-direction: column;
  .details-title{
    width: 268px;
    height: 52px;
    background: #F0F0F0;
    border: 1px solid #E4E4E4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    .title{
      font-size: 20px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: bold;
    }
    .close{
      width: 15px;
      height: 15px;
      cursor: pointer;
    }
  }
  .details-content{
    flex: 1;
    overflow: auto;
    padding: 15px 0;
    .detail-item{
      flex-shrink: 0;
      min-height: 46px;
      width: 260px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #EFEFEF;
      text-align: left;
      margin: 0 auto;
      &:last-child{
        border-bottom: none
      }
      .label{
        display: inline-block;
        width: 105px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
        flex-shrink: 0;
      }
      .value{
        display: inline-block;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
      }
    }
  }
}
</style>
