<template>
  <div class="login-contanier">
    <div class="login-box">
      <div class="avtar-box">
        <img src="../assets/logo.png" alt="头像" />
      </div>
      <el-form label-width="0px" class="login-form" :model="form" :rules="loginRules" ref="loginForm">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" prefix-icon="iconfont icon-denglu"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            type="password"
            prefix-icon="iconfont icon-denglumima"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary">登录</el-button>
          <el-button type="info" @click="resetHandle">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      // 表单验证规则对象
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 4, max: 10, message: "长度在 4 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 8, max: 10, message: "长度在 8 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods:{
    resetHandle(){
      this.$refs.loginForm.resetFields()
    }
  }
};
</script>

<style lang="scss" scoped>
.login-contanier {
  background-color: #2b6b4b;
  height: 100%;
  .login-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avtar-box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login-form {
      position: absolute;
      width: 100%;
      padding: 0 20px;
      bottom: 0;
      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>