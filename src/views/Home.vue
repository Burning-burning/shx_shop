<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="./logo.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
      </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
         <el-menu
            :unique-opened="true"
            background-color="#333744"
            text-color="#fff"
            :collapse="isCollapse"
            :router="true"
            :default-active="activePath"
            :collapse-transition="false"
            active-text-color="#409EFF">
            <el-submenu :index="item.path + ''" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i :class="iconObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item @click="saveNavState('/'+subItem.path)" :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { getMenus } from '../network/home'
export default {
  data() {
    return {
      menuList: [],
      iconObj: {
        125: 'el-icon-user', 
        103: 'el-icon-menu', 
        101: 'el-icon-platform-eleme', 
        102: 'el-icon-upload',
        145: 'el-icon-s-goods'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenusList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenusList() {
      const res = await getMenus()
      if (res.meta.status == 200){
        this.menuList = res.data
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    // 点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span { 
      margin-left: 15px;
    }
  }
  img { 
    height:40px;
    width: 40px;
  }
}
.el-aside {
  background-color: #333744;
  .toggle-button {
    background-color: #4A5064;
    color: #fff;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .el-menu {
    border-right: none;
  }
}
.el-main { 
  background-color: #eaedf1
}
.home-container {
  height: 100%
}
</style>