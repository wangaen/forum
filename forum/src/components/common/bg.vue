<template>
  <div class="bg">
    <div class="bg-box">
      <img src="@/assets/logo.png" alt="" />
      <slot name="formWrap"></slot>
      <div class="login_register" v-if="currentRoute !== 'NAN'">
        {{ currentRoute ? "没有账号?" : "已有账号?" }}
        <a href="javascript:;" style="text-decoration: none; margin-left: 10px" @click="$router.push(currentRoute ? '/register' : 'login')">
          {{ currentRoute ? "点击注册" : "点击登录" }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "bg",
  computed: {
    currentRoute() {
      return this.$route.name === "Login" ? true : this.$route.name === "Register" ? false : "NAN";
    },
  },
};
</script>

<style scoped lang="less">
.bg {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1c202c;

  /deep/.el-form-item__content {
    .el-form-item__error {
      color: red;
      font-size: 14px;
      letter-spacing: 5px;
    }
  }

  .bg-box {
    height: 500px;
    width: 450px;
    background: rgba(255, 255, 255, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    box-sizing: border-box;
    padding: 30px 30px 50px 30px;

    & > img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }

    .login_register {
      letter-spacing: 2px;
      font-size: 16px;
      margin-top: 20px;
    }
  }
}
</style>
