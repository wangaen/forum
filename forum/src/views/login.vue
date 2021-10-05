<template>
  <bg>
    <template v-slot:formWrap>
      <div class="tips">
        <p>欢迎登录</p>
        <p>外贸通</p>
      </div>
      <el-form class="form-box" ref="ruleForm" :model="ruleForm" :rules="loginRule" label-width="0" label-position="left">
        <el-form-item prop="nickname">
          <el-input prefix-icon="el-icon-s-custom" class="info" v-model="ruleForm.nickname" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="el-icon-unlock" class="info" v-model="ruleForm.password" placeholder="请输入密码" @keyup.enter.native="login"></el-input>
        </el-form-item>
        <el-button class="confirm-btn" type="success" @click="login">登录</el-button>
      </el-form>
    </template>
  </bg>
</template>

<script>
import { loginRule } from "@/utils/rules";
import { loginApi } from "@/api/api";
import bg from "@/components/common/bg.vue";
export default {
  name: "login",
  components: { bg },
  data() {
    return {
      ruleForm: {
        nickname: "",
        password: "",
      },
      loginRule: loginRule,
    };
  },
  methods: {
    login() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let res = await loginApi(this.ruleForm);
          if (!res) return;
          const loading = this.$loading({
            lock: true,
            text: "正在加载中......",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          this.$store.commit("setToken", res.token);
          localStorage.setItem("id", JSON.stringify(res.data._id));
          new Promise((resolve) => {
            return setTimeout(() => {
              resolve(loading.close());
            }, 300);
          }).then(() => {
            this.$router.push("/");
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.tips {
  p {
    font-size: 24px;
    text-align: center;
    margin: 5px;
    padding: 0px;
    color: #ffffff;
    padding-bottom: 10px;
    letter-spacing: 5px;
  }
}

.form-box {
  width: 100%;
  margin-top: 10px;

  .info {
    font-size: 20px;
    & > .el-input__prefix > .el-input__icon {
      color: #454545;
    }
    & > input {
      width: 100%;
      padding-left: 40px;
      font-size: 16px;
    }
  }

  .confirm-btn {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    background-color: #55ff00;
    border: none;
    align-items: center;
    letter-spacing: 15px;
    & > i {
      letter-spacing: normal;
    }
  }
  .el-button {
    font-size: 16px;
  }
  .confirm-btn:hover {
    background-color: #55ff00;
    opacity: 0.8;
  }
}
</style>
<style lang="less">
.el-loading-mask {
  .el-loading-spinner {
    .el-icon-loading {
      font-size: 24px;
    }
    .el-loading-text {
      font-size: 18px;
    }
  }
}
</style>