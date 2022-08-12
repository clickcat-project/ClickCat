<route>
{
  name: "Graph",
  meta: { title: 'Graph' }
}
</route>
<template>
  <div id="3d-graph"></div>


  <Detail
    v-if="showDetail"
    :detail-data="detailData"
    @close-detail="closeDetail"
  ></Detail>
</template>

<script lang='ts' setup>
import ForceGraph3D from '3d-force-graph'
import {onMounted} from 'vue'
import {query} from '@/utils/http'
import SpriteText from 'three-spritetext'
import Detail from '@/components/graph/Detail.vue'

import { ref, reactive } from 'vue'
const showDetail = ref(false)

let detailData  = reactive({
  nodeInfo: 1
})

onMounted(async () => {
  const graph = await query('SELECT  * FROM clickcat.GRAPH_TASK where ID = \'1\'')
  const jobDetail = JSON.parse(graph.data[0].JOB_DETAIL)
  let nodes = []
  for(const item of jobDetail.nodes){
    const node = await query('SELECT  *, \''+item.table+'\' as _label, \''+item.table+'\'||'+item.primary+' as _id FROM ' + item.database+'.'+item.table + ' where ' + item.primary + ' is not null')
    nodes =  nodes.concat(node.data)
  }
  nodes.map(item => {item.label = item._label; item.id = item._id})

  let links = []
  for(const item of jobDetail.links){
    const link = await query('SELECT   \''+item.source_node+'\'||'+item.source_primary+' as source, \''+item.target_node+'\'||'+item.target_primary+' as target, \''+item.relationship+'\' as label FROM ' + item.database+'.'+ item.source_node + ' join '+item.database+'.'+ item.target_node+ ' on ' + item.source_link_field + ' = ' + item.target_link_field)
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

        nodeEl.onclick = (el) => {
          console.log(el)
          console.log(node)

          // 弹出右侧窗口
          detailData.nodeInfo = node
          showDetail.value = true
        }

        return new THREE.CSS2DObject(nodeEl)
      })
      .linkDirectionalArrowLength(3)
      .linkDirectionalArrowRelPos(1)
})

const closeDetail = () => {
  showDetail.value = false
}
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