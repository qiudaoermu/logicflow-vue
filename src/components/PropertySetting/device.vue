<template>
  <div>
    <el-form label-width="80px" :model="formData">
      <el-form-item label="名称" >
        <el-input v-model="formData.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="ip">
        <el-input v-model="formData.ip"></el-input>
      </el-form-item>
        <el-form-item label="端口">
        <el-input v-model="formData.port"></el-input>
      </el-form-item>
      <el-form-item label="协议">
        <el-input v-model="formData.protocol"></el-input>
      </el-form-item>
       <el-form-item label="命令">
        <el-input v-model="formData.command"></el-input>
      </el-form-item>
       <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
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
      this.$data.formData = Object.assign({}, this.$data.formData, properties)
    }
    if (text && text.value) {
      this.$data.formData.text = text.value
    }
    if (text && text.value) {
      this.$data.text = text.value
    }
  },
  data () {
    return {
      text: '',
      formData: {
          text: '',
          name: '',
          region: '',
          type: '',
        }
    }
  }, 
  methods: {
    onSubmit() {
      const { id } = this.$props.nodeData
      this.$props.lf.setProperties(id, {
        ...this.$data.formData
      });
      // this.$props.lf.updateText(id, this.$data.formData.text);
      this.$emit('onClose')
    },
  }
}
</script>
<style scoped>
</style>
