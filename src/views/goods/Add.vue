<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
       <el-alert
        title="添加商品信息"
        type="info"
        center
        :closable="false"
        show-icon>
      </el-alert>
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFromRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs tab-position="left"  v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
               <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="selectProps"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="cb" v-for="(cb, i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="https://www.liulongbin.top:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :headers="headerObj"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button class="btnAdd" type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>  
    </el-card>
    
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%">
      <img :src="previewPath" class="previewImg">
    </el-dialog>
  </div>
</template>
<script>
import { getCategoryList, getParams } from '../../network/categories'
import { addGoods } from '../../network/add'
export default {
  data() {
    return {
      activeIndex: '0',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      addForm: {
        goods_name: '',
        goods_price: 10,
        goods_weight: 20,
        goods_number: 30,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      previewVisible: false,
      previewPath: '',
      manyTableData: [],
      onlyTableData: [],
      cateList: [],
      selectProps: {
        expandTrigger: 'hover', 
        label: 'cat_name', 
        value: 'cat_id',
        children: 'children'
      },
      addFromRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getCateList() {
      const res = await getCategoryList()
      if (res.meta.status == 200){
        this.cateList = res.data
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    beforeTabLeave(activaName, oldActiveName){
      if (oldActiveName == '0' && this.addForm.goods_cat.length !== 3){
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    async tabClicked() {
      if (this.activeIndex == '1'){
        const res = await getParams(this.cateId, 'many')
        if (res.meta.status == 200) {
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          })
          this.manyTableData = res.data
        } else {
          this.$message.error(res.meta.msg)
        }
      }
      if (this.activeIndex == '2'){
        const res = await getParams(this.cateId, 'only')
        if (res.meta.status == 200){
          this.onlyTableData = res.data
        } else {
          this.$message.error(res.meta.msg)
        }
      }
    },
    handleChange() {
      if (this.addForm.goods_cat.length != 3){
        this.addForm.goods_cat = []
      }
    },
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    handleSuccess(response) {
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
    },
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
    },
    add () {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const form = JSON.parse(JSON.stringify(this.addForm))
          form.goods_cat = form.goods_cat.join(',')
          this.manyTableData.forEach(item => {
            const info = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(',')
            }
            this.addForm.attrs.push(info)
          })
          this.onlyTableData.forEach(item => {
            const info = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.addForm.attrs.push(info)
          })
          form.attrs = this.addForm.attrs
          const res = await addGoods(form.goods_name, form.goods_cat, form.goods_price, form.goods_number, form.goods_weight, form.goods_introduce, form.attrs, form.pics)
          if (res.meta.status === 201) {
            this.$message.success(res.meta.msg)
            this.$router.push('/goods')
          } else {
            this.$message.error(res.meta.msg)
          }
        } else {
          this.$message.error('请输入数据')
        }
      })
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3){
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px!important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>