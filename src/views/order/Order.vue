<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table class="tablex" :data="goods" stripe border>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="订单编号" prop="order_number"></el-table-column>
          <el-table-column label="订单价格" prop="order_price"></el-table-column>
          <el-table-column label="是否付款">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.pay_status === '0'" type="danger">未付款</el-tag>
              <el-tag v-else type="success">已付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否发货" prop="is_send"></el-table-column>
          <el-table-column label="下单时间" prop="create_time">
            <template slot-scope="scope">
              {{scope.row.create_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template>
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
              <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
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
    </el-card>
    <el-dialog
      title="修改地址"
      @close="handleAddressClose"
      :visible.sync="addressVisible"
      width="50%">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              v-model="addressForm.address1"
              :options="cityData"
              :props="addressProps"
              @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>  
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span> 
    </el-dialog>
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%">
       <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in wuliuInfo"
          :key="index"
          :timestamp="activity.ftime">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="progressVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getOrderLists } from '../../network/order'
import { getWuliuInfo } from '../../network/wuliu'
import cityData from './citydata'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      progressVisible: false,
      addressProps: {
        expandTrigger: 'hover',
        label: 'label',
        value: 'value'
      },
      goods: [],
      total: 0,
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      cityData: cityData,
      wuliuInfo: []
    }
  },
  methods: {
    async getOrderList() {
      const { query, pagenum, pagesize } = this.queryInfo
      const res = await getOrderLists(query, pagenum, pagesize)
      this.goods = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    async showProgressBox() {
      const res = await getWuliuInfo('804909574412544580')
      if (res.meta.status == 200){
        this.wuliuInfo = res.data
        console.log(res)
        this.progressVisible = true
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    showBox() {
      this.addressVisible = true
    },
    handleAddressClose() {
      this.$refs.addressFormRef.resetFields()
    },
    handleChange() {}
  },
  created() {
    this.getOrderList()
  }
}
</script>
<style lang="less" scoped>
.tablex {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>