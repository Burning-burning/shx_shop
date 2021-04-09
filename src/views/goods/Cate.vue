<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addCategory">添加分类</el-button>
      <tree-table class="tree-table" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text='序号' border :show-row-hover="false">
        <template slot="isok" slot-scope="scope">
          <i style="color: lightgreen" v-if="scope.row.cat_deleted===false" class="el-icon-success"></i>
          <i style="color: red" class="el-icon-error" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level===1" type="success" size="mini">二级</el-tag>
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>
        <template slot="operation">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加分类"
      :visible.sync="addCategoryDialogVisible" 
      width="50%" @close="handleClose">
      <el-form ref="addCategoryRef" :rules="addCategoryRules" :model="addCategoryForm" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoryForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
           <el-cascader
              clearable
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChange"></el-cascader>
        </el-form-item>
      </el-form>  
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
import { getCategoryList, addCategory } from '../../network/categories'
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1, 
        pagesize: 5
      },
      selectedKeys: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      addCategoryForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCategoryRules: {
        cat_name: [
          { required:true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ]
      },
      cateList: [],
      total: 0,
      parentCateList: [],
      addCategoryDialogVisible: false,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        { 
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        { 
          label: '排序',
          type: 'template',
          template: 'order'
        },
        { 
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ]
    }
  },
  methods: {
    async getCateList() {
      const { type, pagenum, pagesize } = this.queryInfo
      const res = await getCategoryList(type, pagenum, pagesize)
      if (res.meta.status == 200){
        this.cateList = res.data.result
        this.total = res.data.total
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    async getParentCategoryList() {
      const res = await getCategoryList(2)
      if (res.meta.status == 200){
        this.parentCateList = res.data
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    addCategory() {
      this.getParentCategoryList()
      this.addCategoryDialogVisible = true
    },
    parentCateChange() {
      if (this.selectedKeys.length > 0){
        this.addCategoryForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCategoryForm.cat_level = this.selectedKeys.length
      } else {
        this.addCategoryForm.cat_pid = 0
        this.addCategoryForm.cat_level = 0
      }
    },
    handleClose(){
      this.$refs.addCategoryRef.resetFields()
      this.parentCateList = []
    },
    addCate() {
      const { cat_name, cat_pid, cat_level } = this.addCategoryForm
      this.$refs.addCategoryRef.validate(async valid => {
        if (valid) {
          const res = await addCategory(cat_pid, cat_name, cat_level)
          if (res.meta.status == 201){
            this.$message.success(res.meta.msg)
          } else {
            this.$message.error(res.meta.msg)
          }
        }
      })
      this.getCateList()
      this.addCategoryDialogVisible = false
      this.$refs.addCategoryRef.resetFields()
    }
  }, 
  created() {
    this.getCateList()
  }
}
</script>
<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>