<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table border stripe :data="roleList">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="['bdbottom', i1 === 0 ? 'bdtop':'','vcenter']">
              <el-col :span="5"><el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag><i class="el-icon-caret-right"></i></el-col>
              <el-col :span="19">
                <el-row :class="[i2 === 0 ? '':'bdtop','vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6"><el-tag closable @close="removeRightById(scope.row, item2.id)" type="success">{{item2.authName}}</el-tag><i class="el-icon-caret-right"></i></el-col>
                  <el-col :span="18">
                    <el-tag closable @close="removeRightById(scope.row, item3.id)" type="warning" v-for="item3 in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
    @close="setRightDialogClose"
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%">
      <el-tree ref="treeRef" show-checkbox :data="rightsList" :props="defaultProps" node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSetRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getRoles, deleteRole } from '../../network/roles'
import { getRights, saveRightsById } from '../../network/rights'
export default {
  data() {
    return { 
      roleList: [],
      setRightDialogVisible: false,
      rightsList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],
      roleId: ''
    }
  },
  methods: {
    async getRoleList() {
      const res = await getRoles()
      if (res.meta.status == 200){
        this.roleList = res.data
        this.$message.success(res.meta.msg)
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if (confirmResult === 'confirm'){
        const res = await deleteRole(role.id, rightId)
        if (res.meta.status == 200){
          role.children = res.data
          // this.$message.success(res.meta.msg)
        } else {
          this.$message.error(res.meta.msg)
        }
      } else {
        this.$message.info('已取消删除')
      } 
    },
    async showSetRightDialog(role) {
      this.roleId = role.id
      const res = await getRights('tree')
      if (res.meta.status == 200){
        this.rightsList = res.data
      } else {
        this.$message.error(res.meta.msg)
      }
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    getLeafKeys(node, arr) {
      if (!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    setRightDialogClose() {
      this.defKeys = []
    },
    async handleSetRight() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const strKeys = keys.join(',')
      const res = await saveRightsById(this.roleId, strKeys)
      if (res.meta.status == 200){
        this.$message.success(res.meta.msg)
      } else {
        this.$message.error(res.meta.msg)
      }
      this.setRightDialogVisible = false
      this.getRoleList()
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>
<style lang="less" scoped>
.el-button {
  margin-bottom: 15px;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.bdtop {
  border-top: 1px solid #eee;
}
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}

</style>