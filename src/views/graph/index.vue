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
import randomColor from 'randomcolor'
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
  Tables: {name: string, color: string}[]
  RelationShips: {name: string, color: string, linkWidth?: number}[]
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
    const node = await query('SELECT  *, \''+item.table+'\' as _label, \''+item.table+'\'||'+item.primary+' as _id FROM ' + item.database+'.'+item.table + ' where ' + item.primary + ' is not null')
    nodes =  nodes.concat(node.data.map(item => {
      return {
        ...item,
        label: item._label,
        id: item._id
      }
    }))
  }

  nodes.forEach(node => {
    const label:string = node.label || node._label || ''

    const labelIndex = typeList?.Tables?.findIndex(typeItem => typeItem?.name === label)

    if( labelIndex === -1) {
      typeList.Tables.push({
        name: label,
        color: randomColor({
          luminosity: 'dark',
          seed: label
        })
      })
    }
  })

  let links = []
  for(const item of jobDetail.links){
    const link = await query('SELECT   \''+item.source_node+'\'||'+item.source_primary+' as source, \''+item.target_node+'\'||'+item.target_primary+' as target, \''+item.relationship+'\' as label FROM ' + item.database+'.'+ item.source_node + ' join '+item.database+'.'+ item.target_node+ ' on ' + item.source_link_field + ' = ' + item.target_link_field)
    links = links.concat(link.data)
  }

  links.forEach(link => {
    const label:string = link.label || link._label || ''

    const labelIndex = typeList?.RelationShips?.findIndex(typeItem => typeItem?.name === label)

    if( labelIndex === -1) {
      typeList.RelationShips.push({
        name: label,
        color: randomColor({
          luminosity: 'dark',
          seed: label
        }),
        linkWidth: 100 * (typeList.RelationShips.length + 1)
      })
    }
  })

  // Random tree
  const gData = {
    nodes: nodes,
    links: links
  }

  const excludeKey = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'id', '_id', '_label', 'ref_']

  const Graph = ForceGraph3D({
    extraRenderers: [new THREE.CSS2DRenderer()]
  })(document.getElementById('3d-graph') as HTMLElement)
      .graphData(gData)
      .backgroundColor('#fff')
      .linkColor((linkObj:any) => {
        const label = linkObj.label
        return randomColor({
          luminosity: 'dark',
          seed: label
        })
      })
      .linkOpacity(1)
      .linkWidth(0.4)
      .linkLabel('label')
      .nodeColor((obj:any) => {
        const label = obj.label

        return randomColor({
          luminosity: 'dark',
          seed: label
        })
      })
      .nodeThreeObject((node:any) => {
        const label = node.label
        const nodeEl = document.createElement('div')

        for(let key in node) {
          if(excludeKey.indexOf(key) === -1) {
            const infoDiv = document.createElement('div')
            infoDiv.textContent = `${node[key]}`
            nodeEl.appendChild(infoDiv)
          }
        }
        nodeEl.style.color = randomColor({
          luminosity: 'dark',
          seed: label
        })
        nodeEl.className = 'node-label'

        nodeEl.onclick = (el) => {
          // 弹出右侧窗口
          detailData.nodeInfo = node
          showDetail.value = true
        }

        return new THREE.CSS2DObject(nodeEl)
      })
      .nodeThreeObjectExtend(true)
      .linkDirectionalArrowLength(3)
      .linkDirectionalArrowRelPos(1)
      
      Graph?.d3Force('link')?.distance((link:any) => {
        const label = link.label

        const typeInfo = typeList.RelationShips.find(item => item.name === label)

        console.log(link)
        return typeInfo?.linkWidth || 100
      })
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
  width: 200px;
  height: 80px;
  overflow: auto;
  position: relative;
  left: 110px;
  text-align: left;
}

</style>
