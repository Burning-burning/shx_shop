<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div style="margin-top: 15px;">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsersList">
              <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
            </el-input></el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
          </el-col>
        </el-row>
        <el-table :data="userList" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
              <el-tooltip content="分配角色" placement="top" effect="dark" :enterable="false">
                <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
        
      </div>
    </el-card>
    <el-dialog
    @close="addDialogClose"
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" type="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>  
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改用户信息"
      :visible.sync="updateDialogVisible"
      @close="updateDialogClose"
      width="50%">
      <el-form :model="updateForm" :rules="updateFormRules" ref="updateFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="updateForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="updateForm.mobile"></el-input>
        </el-form-item>
      </el-form>  
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getUsers, updateUserStatus, addUser, getUserById, updateUser, deleteUser } from '../../network/user'
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([0-9A-Za-z\-_]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g
      if (regEmail.test(value)){
        callback()
      } else {
        callback(new Error('请输入合法的邮箱'))
      }
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[3|4|5|7|8][0-9]{9}$/
      if (regMobile.test(value)){
        callback()
      } else {
        callback(new Error('请输入合法的手机号'))
      }
    }
    return { 
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      updateDialogVisible: false,
      addForm: {
        username: '', 
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      updateForm: {
        username: '', 
        email: '', 
        mobile: ''
      },
      updateFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getUsersList() {
      const res = await getUsers(this.queryInfo.query, this.queryInfo.pagenum, this.queryInfo.pagesize)
      if (res.meta.status == 200){
        this.userList = res.data.users
        this.total = res.data.total
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    async updateUserState1(userInfo) {
      const res = await updateUserStatus(userInfo.id, userInfo.mg_state)
      if (res.meta.status != 200){
        userInfo.mg_state = !userInfo.mg_state
        this.$message.error(res.meta.msg)
      } else {
        this.$message.success(res.meta.msg)
      }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsersList()
      // console.log(newSize)
    },
    async deleteUser(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if (confirmResult !== 'confirm'){
        this.$message.info('已取消删除')
      } else {
        const res = await deleteUser(id)
        if (res.meta.status == 200){
          this.$message.success(res.meta.msg)
          this.getUsersList()
        } else {
          this.$message.error(res.meta.msg)
        }
      }
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { username, password, email, mobile } = this.addForm
        const res = await addUser(username, password, email, mobile)
        console.log(res)
        if (res.meta.status != 201){
          this.$message.error(res.meta.msg)
        } else {
          this.$message.success(res.meta.msg)
          this.addDialogVisible = false
          this.getUsersList()
        }
      })
    },
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUsersList()
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    userStateChange(userInfo) {
      this.updateUserState1(userInfo)
    },
    updateDialogClose() {
      this.$refs.updateFormRef.resetFields()
    },
    async showEditDialog(id) {
      this.updateDialogVisible = true
      const res = await getUserById(id)
      if (res.meta.status != 200){
        this.$message.error(res.meta.msg)
      } else {
        this.updateForm = res.data
      }
    },
    updateUserInfo() {
      this.$refs.updateFormRef.validate(async valid => {
        if (valid){
          const { id, email, mobile } = this.updateForm
          const res = await updateUser(id, email, mobile)
          if (res.meta.status != 200){
            this.$message.error(res.meta.msg)
          } else {
            this.$message.success(res.meta.msg)
            this.updateDialogVisible = false
            this.getUsersList()
          }
        }
      })
    }
  },
  created() {
    this.getUsersList()
  }
}
</script>
<style lang="less" scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;  
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
</style>