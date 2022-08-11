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

  <Relations :type-list="typeList" />
</template>

<script lang='ts' setup>
import ForceGraph3D from '3d-force-graph'
import {onMounted} from 'vue'
import {query} from '@/utils/http'
import SpriteText from 'three-spritetext'
import Detail from '@/components/graph/Detail.vue'
import Relations from '@/components/graph/Relations.vue'

import { ref, reactive } from 'vue'
const showDetail = ref(false)

const detailData  = reactive({
  nodeInfo: {}
})

interface typeListType {
  Tables: {name: string, color?: string}[]
  RelationShips: {name: string, color?: string}[]
}

const typeList = reactive<typeListType>({
  Tables: [],
  RelationShips: []
})

onMounted(async () => {
  const graph = await query('SELECT  * FROM clickcat.GRAPH_TASK where ID = \'1\'')
  const jobDetail = JSON.parse(graph.data[0].JOB_DETAIL)
  let nodes = []
  for(const item of jobDetail.nodes){
    const displayName = item.displayFields?.split(',')[0]

    const node = await query('SELECT  *, \''+item.table+'\' as _label, \''+item.table+'\'||'+item.field+' as _id FROM ' + item.database+'.'+item.table + ' where ' + item.field + ' is not null')
    nodes =  nodes.concat(node.data.map(item => {
      return {
        ...item,
        name: item[displayName]
      }
    }))
  }

  console.log(nodes)

  nodes.map(item => {
    item.label = item._label
    item.id = item._id
  })

  nodes.forEach(node => {
    const label:string = node.label || node._label || ''

    const labelIndex = typeList?.Tables?.findIndex(typeItem => typeItem?.name === label)

    if( labelIndex === -1) {
      typeList.Tables.push({
        name: label
      })
    }
  })

  let links = []
  for(const item of jobDetail.links){
    const link = await query('SELECT   \''+item.source_type+'\'||'+item.source_field+' as source, \''+item.target_type+'\'||'+item.target_field+' as target, \''+item.source_type+'-'+item.target_type+'\' as label FROM ' + item.database+'.'+ item.linkTable  + ' where ' + item.source_field + ' is not null and '  + item.target_field + ' is not null ')
    links = links.concat(link.data)
  }

    links.forEach(link => {
    const label:string = link.label || link._label || ''

    const labelIndex = typeList?.RelationShips?.findIndex(typeItem => typeItem?.name === label)

    if( labelIndex === -1) {
      typeList.RelationShips.push({
        name: label
      })
    }
  })

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
      // .onNodeClick(node => {
      //   detailData.nodeInfo = node
      //   showDetail.value = true
      // })
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