<template>
  <div class="property-dialog">
     <device
      v-if="nodeData.type === 'device'"
      :nodeData="nodeData"
      :lf="lf"
      @onClose="handleClose"/>
    <algorithm
      v-if="nodeData.type === 'algorithm'"
      :nodeData="nodeData"
      :lf="lf"
      @onClose="handleClose"/>
  </div>
</template>
<script>
import device from './device'
import algorithm from './algorithm.vue'

export default {
  name: 'PropertyDialog',
  components: {
    device,
    algorithm
  },
  props: {
    nodeData: Object,
    lf: Object
  },
  data () {
    return {}
  },
  methods: {
    handleClose () {
      this.$emit('setPropertiesFinish')
    }
  }
}
</script>
<style>
.property-dialog{
  padding: 20px;
}
</style>
