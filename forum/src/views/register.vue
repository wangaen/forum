<template>
  <bg>
    <template v-slot:formWrap>
      <p class="tips">用户注册</p>
      <el-form class="form-box" ref="ruleForm" :model="ruleForm" :rules="registerRule" label-width="0" label-position="left">
        <el-form-item prop="nickname">
          <el-input prefix-icon="el-icon-s-custom" class="info" v-model="ruleForm.nickname" autocomplete="new-password" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="el-icon-unlock" class="info" maxlength="18" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="checkPassword">
          <el-input type="password" prefix-icon="el-icon-unlock" class="info" maxlength="18" v-model="ruleForm.checkPassword" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-button class="confirm-btn" type="success" @click="register">注册</el-button>
      </el-form>
    </template>
  </bg>
</template>

<script>
import { registerRule } from "@/utils/rules";
import bg from "@/components/common/bg.vue";
import { registerApi } from "@/api/api";
export default {
  name: "register",
  components: { bg },
  data() {
    return {
      ruleForm: {
        nickname: "",
        password: "",
        checkPassword: "",
      },
      registerRule,
    };
  },
  methods: {
    register() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let data = await registerApi(this.ruleForm);
          if (!data) return;
          await this.$tools.diyTips("注册成功,正在跳转登录界面......", "success", 1000);
          setTimeout(() => {
            this.$router.push("/login")
          }, 1200);
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.tips {
  font-size: 24px;
  color: #ffffff;
  margin: 10px 0px 0px 0px;
  padding-bottom: 10px;
}

.form-box {
  width: 100%;
  margin-top: 20px;
  .info {
    font-size: 18px;
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
