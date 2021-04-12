<template>
  <div>
    
    <el-card>
      <el-table
        stripe
        border
        :data="rightList"
        style="width: 100%">
        <el-table-column
          type="index"
          label="#">
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称">
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径">
        </el-table-column>
        <el-table-column
          label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { getRights } from '../../network/rights'
export default {
  data() {
    return { 
      rightList: []
    }
  },
  methods: {
    async getRightsList() {
      const res = await getRights('list')
      if (res.meta.status == 200){
        this.$message.success(res.meta.msg)
        this.rightList = res.data
      } else {
        this.$message.error(res.meta.msg)
      }
    }
  },
  created() {
    this.getRightsList()
  }
}
</script>
<style lang="less" scoped>

</style>