<template>
  <div>
   <el-table
      :data="formData"
      style="width: 100%">
      <el-table-column
        prop="props"
        label="属性"
        width="180">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        width="180">
      </el-table-column>
      <el-table-column
        prop="default"
        label="默认值">
      </el-table-column>
      <el-table-column
        prop="io"
        label="入参/出参">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: '',
  props: {
    nodeData: Object,
    lf: Object || String,
  },
  mounted() {
    const { properties, text } = this.$props.nodeData
    console.log(properties,"properties")
    if (properties) {
      this.$data.formData = Object.assign({}, this.$data.formData, properties.params)
      this.translate()
    }
    if (text && text.value) {
      this.$data.formData.text = text.value
    }
    if (text && text.value) {
      this.$data.text = text.value
    }
  },
  data() {
    return {
      form: []
    }
  },
  methods: {
    translate() {
      let templateParam = {
        "props": "",
        "type": "",
        "default": "",
        "io": ""
      }
      const param = this.$data.formData.split(";");
      param.forEach((item,index) => {
        param[index] = param[index].split(",");
        
      })
    },
    onSubmit() {
      console.log('submit!');
      // const { id } = this.$props.nodeData
      // this.$props.lf.setProperties(id, this.$data.form);
      const nodeData = this.$props.nodeData
      nodeData.properties = this.$data.form
      this.$props.lf.setProperties(nodeData.id, this.$data.form);
      this.$emit('onClose')
    }
  }
}
</script>
<style scoped>
</style>
