<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
           <el-cascader
            v-model="selectedKeys"
            :options="categoryList"
            :props="cateProps"
            @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="dialogVisible = true">添加参数</el-button>
          <el-table :data="manyTableData" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag closable v-for="(item, i) in scope.row.attr_vals" :key="i" @close="handleTagClose(i, scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="dialogVisible = true">添加属性</el-button>
          <el-table :data="onlyTableData" stripe border>
            <el-table-column type="expand">
              
               <template slot-scope="scope">
                <el-tag closable v-for="(item, i) in scope.row.attr_vals" :key="i" @close="handleTagClose(i, scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="dialogVisible"
      @close="handleClose"
      width="50%">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>  
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddParams">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      @close="handleEditClose"
      width="50%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>  
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { saveParams, getCategoryList, getParams, addParams, getParamsById, editParams, deleteParam } from '../../network/categories'
export default {
  data() {
    return {
      categoryList: [],
      selectedKeys: [],
      activeName: 'many',
      inputVisible: false,
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      inputValue: '',
      manyTableData: [],
      onlyTableData: [],
      paramsId: 0,
      dialogVisible: false,
      addForm: {
        attr_name: ''
      },
      editDialogVisible: false,
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editForm: {
        attr_name: ''
      },
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getCategoryLists() {
      const res = await getCategoryList()
      if (res.meta.status == 200){
        this.categoryList = res.data
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    async deleteParams(id) {
       const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if (result == 'confirm'){
          const res = await deleteParam(this.cateId, id)
          if (res.meta.status == 200) {
            this.getParamsList()
            this.$message.success(res.meta.msg)
          } else {
            this.$message.error(res.meta.msg)
          }
      }
    },
    async handleTagClose(i, row) {
      row.attr_vals.splice(i, 1)
       const res = await saveParams(this.cateId, row.attr_id, row.attr_name, this.activeName, row.attr_vals.join(' '))
        if (res.meta.status == 200){
          this.$message.success(res.meta.msg)
          // this.getParamsList()
        } else {
          this.$message.error(res.meta.msg)
        }
    },
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length == 0){
        row.inputValue = ''
        row.inputVisible = false
      } else {
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        const res = await saveParams(this.cateId, row.attr_id, row.attr_name, this.activeName, row.attr_vals.join(' '))
        if (res.meta.status == 200){
          this.$message.success(res.meta.msg)
          // this.getParamsList()
        } else {
          this.$message.error(res.meta.msg)
        }
     }
    },
    async handleEdit(id) {
      this.paramsId = id
      const res = await getParamsById(this.cateId, id, this.activeName)
      if (res.meta.status == 200){
        this.editForm.attr_name = res.data.attr_name
      } else {
        this.$message.error(res.meta.msg)
      }
      this.editDialogVisible = true
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    handleEditClose() {
      this.$refs.editFormRef.resetFields()
    },
    handleEditParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid){
          const res = await editParams(this.cateId, this.paramsId, this.editForm.attr_name, this.activeName)
          if (res.meta.status == 200){
            this.$message.success(res.meta.msg)
            this.getParamsList()
            this.editDialogVisible = false
          } else {
            this.$message.error(res.meta.msg)
          }
        }
      })
    },
    handleChange() {
      this.getParamsList()  
    },
    handleTabClick() {
      this.getParamsList()
    },
    handleClose() {
      this.$refs.addFormRef.resetFields()
    },
    async getParamsList() {
      if (this.selectedKeys.length !== 3){
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
      } else {
        const res = await getParams(this.cateId, this.activeName)
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          item.inputVisible = false
          item.inputValue = ''
        })
        if (res.meta.status == 200){
          if (this.activeName == 'many'){
            this.manyTableData = res.data
          } else {
            this.onlyTableData = res.data
          }
        } else {
          this.$message.error(res.me)
        }
      }
    },
    handleAddParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid){
          const res = await addParams(this.cateId, this.addForm.attr_name, this.activeName)
          if (res.meta.status == 201){
            this.$message.success(res.meta.msg)
            this.getParamsList()
            this.dialogVisible = false
          } else {
            this.$message.error(res.meta.msg)
          }
        }
      })
    }
  },
  created() {
    this.getCategoryLists()
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedKeys.length === 3){
        return false
      }
      return true
    },
    cateId() {
      if (this.selectedKeys.length == 3){
        return this.selectedKeys[2]
      }
      return null
    },
    titleText() {
      if (this.activeName == 'many'){
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 120px;
}
</style>