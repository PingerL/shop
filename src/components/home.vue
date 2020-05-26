<template>
  <div class="home">
    <el-button type="info" @click="logoutHandle">退出</el-button>
  </div>
</template>

<script>
export default {
  methods:{
    logoutHandle(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>