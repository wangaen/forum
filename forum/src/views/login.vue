<template>
  <div class="login">
    <div class="login-box">
      <img src="../assets/logo.png" alt="">
      <div class="tips">
        <p>欢迎登录</p>
        <p>外贸通</p>
      </div>
      <div class="form-box">
        <el-form class="login-form" ref="form" :model="form" :rules="rules" label-width="0" label-position="left">
          <el-form-item prop="email">
            <el-input prefix-icon="el-icon-s-custom" class="info" v-model="form.email" autocomplete="new-password"
                      placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" prefix-icon="el-icon-unlock" class="info" v-model="form.password"
                      autocomplete="new-password"
                      placeholder="请输入密码" @keyup.enter.native="login"></el-input>
          </el-form-item>
          <el-button class="login-btn" type="success" @click="login" :loading="btnLoading">登录</el-button>
        </el-form>
      </div>
      <div class="register">
        没有账号?
        <a href="javascript:;" style="text-decoration:none;margin-left:10px;" @click="$router.push('/register')">
          点击注册
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "login",
    data() {
      return {
        form: {
          email: '',
          password: '',
        },
        checked: 0,
        rules: {
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
          ]
        },
        userMsg: {},
        btnLoading: false,
      }
    },
    methods: {
      login() {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            this.btnLoading = true
            await this.$Api.loginApi(this.form).then(res => {
              this.btnLoading = false
              if(res.message === 'OK'){
                this.$store.commit('setUserData', res.result);
                this.$router.push({path:'/',query: {id: res.result._id}})
                window.localStorage.getItem('kuajingtongstatu') && window.localStorage.removeItem('kuajingtongstatu')
              }else{
                this.$tools.diyTips(res.message,res.type)
              }
            }).catch(() => {
              this.btnLoading = false
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .login {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #1C202C;

    .login-box {
      height: 500px;
      width: 450px;
      background: rgba(255, 255, 255, .5);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 20px;
      box-sizing: border-box;
      padding: 30px 30px 30px 30px;

      & > img{
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }

      .tips {
        width: 100%;
        height: 100px;

        & > p {
          font-size: 24px;
          margin: 5px;
          padding: 0px;
          color: #ffffff;
          padding-bottom: 10px;
          letter-spacing: 5px;
        }
      }
      
      .form-box{

        .login-form {
          width: 100%;
          margin-top: 10px;
        }

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

        .if-remember {
          margin-bottom: 10px;
          color: #FFFFFF;
        }

        .login-btn {
          width: 100%;
          height: 40px;
          display: flex;
          justify-content: center;
          background-color: #67C23A;
          border: none;
          align-items: center;
          letter-spacing: 15px;

          & >  i {
            letter-spacing: normal;
          }
        }

        .el-button{
          font-size: 16px;
        }

        .login-btn:hover {
          background-color: #67C23A;
          opacity: 0.6;
        }
      }

      .register{
        letter-spacing: 2px;
        font-size: 16px;
        margin-top: 20px;
      }
    }
  }
</style>
