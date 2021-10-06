<template>
  <div class="password-box">
    <div class="update-password">
      <div class="input-item nickname">
        <p>用户名</p>
        <el-input v-model="nickname" disabled></el-input>
      </div>
      <el-form class="ruleForm-box" ref="ruleForm" :model="ruleForm" :rules="updatePassRule" label-width="0" label-position="left">
        <el-form-item prop="oldpass">
          <div class="input-item">
            <p>旧密码</p>
            <el-input v-model="ruleForm.oldpass" show-password placeholder="请输入旧密码"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="newpass">
          <div class="input-item">
            <p>新密码</p>
            <el-input v-model="ruleForm.newpass" show-password placeholder="请输入新密码"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="okpass">
          <div class="input-item">
            <p>确认密码</p>
            <el-input v-model="ruleForm.okpass" show-password placeholder="请再次输入新密码"></el-input>
          </div>
        </el-form-item>
        <div class="input-item confirm-btn">
          <el-button type="primary" @click="updatePass">确 定</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { updatePassRule } from "@/utils/rules";
import { updatePassApi } from "@/api/api";
export default {
  name: "updatePass",
  data() {
    return {
      ruleForm: {
        oldpass: "",
        newpass: "",
        okpass: "",
        _id: JSON.parse(localStorage.getItem("id")),
      },
      updatePassRule: updatePassRule,
    };
  },
  methods: {
    async updatePass() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (this.ruleForm.newpass === this.ruleForm.okpass) {
            const res = updatePassApi(this.ruleForm);
            if (res) {
              this.$utils.diyTips("修改密码成功,请重新登录", "success", 500);
              setTimeout(() => {
                this.$router.push("/login");
                localStorage.clear();
              }, 700);
            }
          }
        }
      });
    },
  },
  computed: {
    nickname() {
      return this.$store.getters.getUser.nickname;
    },
  },
};
</script>

<style scoped lang="less">
.password-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .update-password {
    width: 1000px;
    box-shadow: 0 0px 30px 3px #aaa;
    height: 500px;
    margin-top: 20px;
    padding-top: 100px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .input-item {
      display: flex;
      height: 80px;
      align-items: center;
      p {
        width: 100px;
        font-weight: 550;
      }
      .el-input {
        width: 500px;
      }
    }
    .nickname {
      p {
        font-size: 14px;
      }
    }
    .input-item:nth-child(4) {
      .el-button {
        padding: 15px 50px;
        font-size: 16px;
        letter-spacing: 5px;
      }
    }
    .confirm-btn {
      justify-content: center;
    }
  }
  /deep/.el-form-item__content {
    .el-form-item__error {
      position: absolute;
      font-size: 14px;
      top: 65px;
      left: 100px;
    }
  }
}
</style>