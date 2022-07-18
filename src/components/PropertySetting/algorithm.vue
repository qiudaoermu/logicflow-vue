<template>
  <div>
   <el-table
      :data="formData"
      style="width: 100%">
      <el-table-column
        prop="brief"
        label="属性"
        width="130">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        width="60">
      </el-table-column>
      <el-table-column
        prop="value"
        width="180"
        label="默认值">
      </el-table-column>
      <el-table-column
        prop="io"
        width="100"
        label="输入/输出">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.io | filterIO }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleRowClick(scope.row)"  type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button type="primary" @click="onSubmit()">保存</el-button>
    </div>
     
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      >
     <el-form :model="form" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="默认值" prop="value">
          <el-input v-model="form.value" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOK">确 定</el-button>
      </span>
    </el-dialog>
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
    const { properties } = this.$props.nodeData
    this.parsedAlgParam = JSON.parse(properties.algParam)

    if (this.parsedAlgParam) {
      for (let i in this.parsedAlgParam) {
        if (typeof this.parsedAlgParam[i] === 'object') {
          this.$data.formData.push(this.parsedAlgParam[i])
        }
      }
    }
  },
  filters: {
    filterIO(io) {
      if (io === 'in') {
        return '输入';
      }
      return '输出';
    }
  },
  data() {
    return {
      parsedAlgParam: {},
      form: [],
      rowRecord: {},
      formData: [],
      dialogVisible: false,
      rules: {
          pass: [
            { required: true, trigger: 'blur' }
          ],
        }
    }
  },
  methods: {
    handleRowClick(record) {
      this.form = record;
      this.dialogVisible = true;
    },
    handleOK() {
      this.dialogVisible = false;
    },
    onSubmit() {
      const { id } = this.$props.nodeData;
      this.$props.nodeData.properties.algParam = JSON.stringify(this.parsedAlgParam)
      this.$props.lf.setProperties(id, {
        ...this.$props.nodeData.properties
      });
      this.$emit('onClose')
    }
  }
}
</script>
<style scoped>
</style>
