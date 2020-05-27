<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logoutHandle">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="collapse ? '64px' :'200px'">
        <div class="toggle-btn" @click="toggleHandle">
          <i class="iconfont icon-zhediexiaoguo"></i>
        </div>
        <el-menu background-color="transparent" text-color="#fff" active-text-color="#409bff" unique-opened :collapse="collapse" :collapse-transition="false">
          <el-submenu :index="item.id + ''" v-for="(item,index) in memuList" :key="item.id" >
            <template slot="title">
              <i :class="iconObj[index]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="subItem.id +''" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return {
      collapse:false, //是否折叠
      memuList:[],
      iconObj: ['iconfont icon-yonhu','iconfont icon-quanxianguanli','iconfont icon-shangpin','iconfont icon-dingdan','iconfont icon-yunliankeji-']
    }
  },
  created(){
    this.getMenuList()
  },
  methods: {
    logoutHandle() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList(){
      const {data:res} = await this.$http.get('menus')
      if(res.meta.status !== 200) return this.$message.error(res.data.msg)
      this.memuList = res.data
      console.log(this.memuList)
    },
    toggleHandle(){
      this.collapse = !this.collapse
    }

  }
};
</script>

<style lang="scss" scoped>
.iconfont {
  color: white;
  font-weight: bold;
  margin-right: 10px;
}
.home-container {
  height: 100%;
  color: white;
}
.el-header {
  background-color: #373d41;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
  .toggle-btn {
    background: #4a5064;
    font-size: 24px;
    line-height: 24px;
    text-align: center;
    cursor: pointer;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>