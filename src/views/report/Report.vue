<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import { getReport } from '../../network/report'
export default {
   data () {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {},
  async mounted() {
    var myChart = echarts.init(document.getElementById('main'));
    const res = await getReport()
    const lll = Object.assign({}, this.options, res.data)
    myChart.setOption(lll)
  }
}
</script>
<style lang="less" scoped>

</style>