<template>
  <div class="logic-flow-view">
    <!-- 辅助工具栏 -->
    <Control
      class="demo-control"
      v-if="lf"
      :lf="lf"
      :catTurboData="true"
      @catTurboData="$_catTurboData"
      @catSaveData="$_catSaveData"
      @catData="$_catData"
      @renderImportView="$_renderImportView"
    ></Control>
    <!-- 节点面板 -->
    <NodePanel v-if="lf" :lf="lf" :nodeList="panelConfig"></NodePanel>
    <!-- 画布 -->
    <div id="LF-view" ref="container"></div>
    <!-- 用户节点自定义操作面板 -->
    <AddPanel
      v-if="showAddPanel"
      class="add-panel"
      :style="addPanelStyle"
      :lf="lf"
      :nodeData="addClickNode"
      @addNodeFinish="hideAddPanel"
      >
    </AddPanel>
    <!-- 属性面板 -->
    <el-drawer
      title="设置节点属性"
      :visible.sync="dialogVisible"
      direction="rtl"
      size="500px"
      :before-close="closeDialog">
      <PropertyDialog
        v-if="dialogVisible"
        :nodeData="clickNode"
        :lf="lf"
        @setPropertiesFinish="closeDialog"
      ></PropertyDialog>
    </el-drawer>
    <!-- 数据查看面板 -->
    <el-dialog
      title="数据"
      :visible.sync="dataVisible"
      width="50%">
      <DataDialog :graphData="graphData"></DataDialog>
    </el-dialog>
  </div>
</template>
<script>
import LogicFlow from '@logicflow/core'

// const LogicFlow = window.LogicFlow
import { Menu, Snapshot, MiniMap } from '@logicflow/extension'
import '@logicflow/core/dist/style/index.css'
import '@logicflow/extension/lib/style/index.css'
import NodePanel from './LFComponents/NodePanel'
import AddPanel from './LFComponents/AddPanel'
import Control from './LFComponents/Control'
import PropertyDialog from './PropertySetting/PropertyDialog'
import DataDialog from './LFComponents/DataDialog'
import { nodeList } from './config'
import { toTurboData, toLogicflowData } from '../Util/AdpterForTurbo';
import {
  registerStart,
  registerUser,
  registerEnd,
  registerPush,
  registerdevice,
  registeralgorithm,
  registerScene,
  registerPolyline,
  registerTask,
  registerConnect,
} from './registerNode'
let demoData = require('./data.json')
let demoDataTurbo = require('./data1.json')
export default {
  name: 'LF',
  components: { NodePanel, AddPanel, Control, PropertyDialog, DataDialog },
  data () {
    return {
      reviewRecord: {},
      lf: null,
      showAddPanel: false,
      addPanelStyle: {
        top: 0,
        left: 0
      },
      nodeData: null,
      addClickNode: null,
      clickNode: null,
      dialogVisible: false,
      graphData: null,
      dataVisible: false,
      config: {
        background: {
          backgroundColor: '#f7f9ff',
        },
        grid: {
          size: 20,
          visible: true,
          type: 'mesh',
          config: {
            color: '#ababab',
            thickness: 1,
          },
        },
        keyboard: {
          enabled: true
        },
        edgeTextDraggable: true,
        hoverOutline: false,
      },
      moveData: {},
      nodeList,
    }
  },
  props: {
    panelConfig: Object,
    record: Object
  },
  watch: {
      record(value) {
        this.reviewRecord = value;
         this.$_render()
      }
  },
  mounted () {
    this.$_initLf()
  },
  methods: {
    $_catTurboData(){
      const graphData = this.$data.lf.getGraphData();
      // 数据转化为Turbo识别的数据结构
      this.$data.graphData = toTurboData(graphData)
      this.$data.dataVisible = true;
      // this.$emit('emitTransfromRecord', this.$data.graphData)
    },
    $_catSaveData() {
       const graphData = this.$data.lf.getGraphData();
      // 数据转化为Turbo识别的数据结构
      this.$data.graphData = toTurboData(graphData)
      this.$emit('emitTransfromRecord', this.$data.graphData)
    },
    $_initLf () {
      // 画布配置
      const lf = new LogicFlow({
        ...this.config,
        plugins: [
          Menu,
          MiniMap,
          Snapshot
        ],
        container: this.$refs.container,
      })
      this.lf = lf
      // 设置主题
      lf.setTheme({
        circle: {
          stroke: '#000000',
          strokeWidth: 1,
          outlineColor: '#88f',
        },
        rect: {
          outlineColor: '#88f',
          strokeWidth: 1
        },
        polygon: {
          strokeWidth: 1
        },
        polyline: {
          stroke: '#000000',
          hoverStroke: '#000000',
          selectedStroke: '#000000',
          outlineColor: '#88f',
          strokeWidth: 1
        },
        nodeText: {
          color: '#000000'
        },
        edgeText: {
          color: '#000000',
          background: {
            fill: '#f7f9ff'
          }
        },
      })
      this.$_registerNode()
    },
    // 自定义
    $_registerNode () {
      registerStart(this.lf)
      registerUser(this.lf)
      registerEnd(this.lf)
      registerPush(this.lf, this.clickPlus, this.mouseDownPlus)
      registerdevice(this.lf)
      registeralgorithm(this.lf)
      registerScene(this.lf)
      registerPolyline(this.lf)
      registerTask(this.lf)
      registerConnect(this.lf)
      this.$_render()
    },
    $_render () {
      const lFData = toLogicflowData(JSON.parse(JSON.stringify(this.reviewRecord)))
      console.log(lFData, "lFData")
      this.lf.render(lFData)
      // this.lf.render(demoData)
      this.$_LfEvent()
    },
    $_renderImportView(lFData) {
      this.lf.render(lFData)
      this.$_LfEvent()
    },
    $_getData () {
      const data = this.lf.getGraphData()
      console.log(JSON.stringify(data))
    },
    $_LfEvent () {
      this.lf.on('node:click', ({data}) => {
        console.log('node:click', data)
        this.$data.clickNode = data
        this.$data.dialogVisible = true
      })
      this.lf.on('edge:click', ({data}) => {
        console.log('edge:click', data)
         this.$data.clickNode = data
          this.$data.dialogVisible = true
      })
      this.lf.on('element:click', () => {
        this.hideAddPanel()
      })
      this.lf.on('edge:add', ({data}) => {
        console.log('edge:add', data)
      })
      this.lf.on('node:mousemove', ({data}) => {
        console.log('node:mousemove')
        this.moveData = data
      })
      this.lf.on('blank:click', () => {
        this.hideAddPanel()
      })
      this.lf.on('connection:not-allowed', (data) => {
        this.$message({
          type: 'error',
          message: data.msg
        })
      })
      this.lf.on('node:mousemove', () => {
        console.log('on mousemove')
      })
    },
    clickPlus (e, attributes) {
      e.stopPropagation()
      console.log('clickPlus', e, attributes)
      const { clientX, clientY } = e
      console.log(clientX, clientY)
      this.$data.addPanelStyle.top = (clientY - 40) + 'px'
      this.$data.addPanelStyle.left = clientX + 'px'
      this.$data.showAddPanel = true
      this.$data.addClickNode = attributes
    },
    mouseDownPlus (e, attributes) {
      e.stopPropagation()
      console.log('mouseDownPlus', e, attributes)
    },
    hideAddPanel () {
      this.$data.showAddPanel = false
      this.$data.addPanelStyle.top = 0
      this.$data.addPanelStyle.left = 0
      this.$data.addClickNode = null
    },
    closeDialog () {
      this.$data.dialogVisible = false
    },
    $_catData(){
      this.$data.graphData = this.$data.lf.getGraphData();
      this.$data.dataVisible = true;
    },
    goto () {
      this.$router.push('/TurboAdpter')
    }
  }
}
</script>
<style>
.logic-flow-view {
  height: 100vh;
  position: relative;
}
.demo-title{
  text-align: center;
  margin: 20px;
}
.demo-control{
  position: absolute;
  top: 50px;
  right: 50px;
  z-index: 2;
}
#LF-view{
  width: calc(100%);
  height: 100%;
  outline: none;
}
.time-plus{
  cursor: pointer;
}
.add-panel {
  position: absolute;
  z-index: 11;
  background-color: white;
  padding: 10px 5px;
}
.el-drawer__body {
  height: 80%;
  overflow: auto;
  margin-top: -30px;
  z-index: 3;
}
</style>

