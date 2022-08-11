<route>
{
  name: "Graph",
  meta: { title: 'Graph' }
}
</route>
<template>
  <div id="3d-graph"></div>

  <el-drawer
    v-model="drawer"
    title="I am the title"
    :with-header="false"
  >
    <span>Hi there!</span>
  </el-drawer>
</template>

<script lang='ts' setup>
import ForceGraph3D from '3d-force-graph'
import {onMounted} from 'vue'
import {query} from '@/utils/http'
import SpriteText from 'three-spritetext'

import { ref } from 'vue'
const drawer = ref(false)

onMounted(async () => {
  const graph = await query('SELECT  * FROM clickcat.GRAPH_TASK where ID = \'1\'')
  const jobDetail = JSON.parse(graph.data[0].JOB_DETAIL)
  let nodes = []
  for(const item of jobDetail.nodes){
    const node = await query('SELECT  *, \''+item.table+'\' as _label, \''+item.table+'\'||'+item.field+' as _id FROM ' + item.database+'.'+item.table + ' where ' + item.field + ' is not null')
    nodes =  nodes.concat(node.data)
  }
  nodes.map(item => {item.label = item._label; item.id = item._id})

  let links = []
  for(const item of jobDetail.links){
    const link = await query('SELECT   \''+item.source_type+'\'||'+item.source_field+' as source, \''+item.target_type+'\'||'+item.target_field+' as target, \''+item.source_type+'-'+item.target_type+'\' as label FROM ' + item.database+'.'+ item.linkTable  + ' where ' + item.source_field + ' is not null and '  + item.target_field + ' is not null ')
    links = links.concat(link.data)
  }


  // Random tree
  const gData = {
    nodes: nodes,
    links: links
  }
  const Graph = ForceGraph3D({
    extraRenderers: [new THREE.CSS2DRenderer()]
  })(document.getElementById('3d-graph') as HTMLElement)
      .graphData(gData)
      .backgroundColor('#fff')
      .nodeAutoColorBy('label')
      .linkAutoColorBy('label')
      .linkOpacity(1)
      .linkWidth(0.2)
      .linkLabel('label')
      .nodeThreeObject((node:any) => {
        const nodeEl = document.createElement('div')
        nodeEl.textContent = node.name
        nodeEl.style.color = node.color
        nodeEl.className = 'node-label'

        nodeEl.onclick = (node) => {
          console.log(node)

          // 弹出右侧窗口
          drawer.value = true
        }

        return new THREE.CSS2DObject(nodeEl)
      })
      .linkDirectionalArrowLength(3)
      .linkDirectionalArrowRelPos(1)
})
</script>
<style>
.scene-tooltip {
  color: black;
  font-size: 15px;
}
.node-label{
  pointer-events: auto;
}

</style>