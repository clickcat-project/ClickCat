<template>
  <div class="nodeBox">
  </div>
</template>

<script lang='ts' setup>
// import $ from 'jquery'
// const props = 

withDefaults(defineProps<{
  opts: any
}>(), {
  opts: () => ({})
})

// const emit = defineEmits(['viewMonitor', 'viewStreamTask'])

// function viewMonitor () {
//   const name = props.opts.name
//   const type = props.opts.type

//   emit('viewMonitor', {
//     name,
//     type
//   })
// }

// function viewStreamTask () {
//   const name = props.opts.name
//   const type = props.opts.type

//   if (type === 'flink') {
//     emit('viewStreamTask', {
//       name,
//       type
//     })
//   }
// }

// function alertAction (e: any) {
//   $('#butterFly .nodeBox img').css({
//     transform: 'scale(1, 1)'
//   })
//   $('#butterFly .nodeBox .action').hide()
//   if (props.opts.type == 'flink' || props.opts.type == 'kafka') {
//     $(e.target).css({
//       transform: 'scale(.7, .7)'
//     })
//     $(e.target).nextAll('.action').show()
//   }
// }
</script>

<style lang="scss" scoped>
.nodeBox{
  position:relative;
  text-align: center;
  font-size:14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 260px;
  height: 76px;
  background-color: #fff;
  border: 1px solid #dfdfdf;
  box-shadow: 0px 0px 6px 0px rgba(223, 223, 223, 0.3);
  border-radius: 4px;
  .rate{
    color:#474AE1;
    margin-top:10px;
  }
  img{
    cursor: pointer;
    width: 90px;
    height: 90px;
  }
  .action{
    z-index: 1000;
    display: none;
    position: absolute;
    width: 80px;
    height: 80px;
    background:url('../../../assets/images/dass/ope-bg.png') no-repeat;
    background-size: 100% 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    span{
      cursor: pointer;
    }
    .detail{
      width: 50px;
      height: 50px;
      position: absolute;
      background:url('../../../assets/images/topo/detail.png') no-repeat;
      background-size: 100% 100%;
      top:34px;
      left: -18px;
      z-index: 10000;
      &._disabled{
        background:url('../../../assets/images/topo/detail-disabled.png') no-repeat;
      }
    }
    .monitor{
      width: 50px;
      height: 50px;
      z-index: 10000;
      position: absolute;
      background:url('../../../assets/images/topo/monitor.png') no-repeat;
      background-size: 100% 100%;
      top:34px;
      right: -18px;
      &._disabled{
        background:url('../../../assets/images/topo/monitor-disabled.png') no-repeat;
      }
    }
    .ope1_disabled{
      width: 50px;
      height: 50px;
      z-index: 10000;
      position: absolute;
      background:url('../../../assets/images/topo/ope1-disabled.png') no-repeat;
      background-size: 100% 100%;
      top:-21px;
      right: 13px;
    }
  }
  .name{
    margin-top:-7px;
    color:#FFFFFFD2;
    width: 250px;
  }
  .description{
    margin-top:5px;
    color:#FFFFFFD2;
    width: 250px;
  }
}
</style>
