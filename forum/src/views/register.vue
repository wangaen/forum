<template>
  <div class="register">
    <div class="register-box">
      <img src="../assets/logo.png" alt="">
      <div class="tips">
        <p>用户注册</p>
      </div>
      <div class="form-box">
        <el-form class="register-form" ref="form" :model="form" :rules="rules" label-width="0" label-position="left">
          <el-form-item prop="email">
            <el-input prefix-icon="el-icon-s-custom" class="info" v-model="form.email" autocomplete="new-password"
                      placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item prop="nickname">
            <el-input prefix-icon="el-icon-s-custom" class="info"  v-model="form.nickname" autocomplete="new-password"
                      placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              type="password" 
              prefix-icon="el-icon-unlock" 
              class="info" 
              maxlength="18" 
              v-model="form.password"
              autocomplete="new-password"
              placeholder="请输入密码" 
              @keyup.enter.native="register"
            ></el-input>
          </el-form-item>
          <el-button class="register-btn" type="success" @click="register" :loading="btn_loading">注册</el-button>
        </el-form>
      </div>
      <div class="login">
        已有账号?
        <a href="javascript:void(0);" style="text-decoration:none;margin-left:10px;" @click="$router.push('/login')">
          点击登录
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "register",
    data() {
      return {
        form: {
          email: '',
          password: '',
          nickname: ''
        },
        rules: {
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          nickname: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
          ]
        },
        btn_loading: false,
      }
    },
    methods: {
      register() {
        this.$refs.form.validate( async (valid) => {
          if (valid) {
            this.btn_loading = true
            await this.$Api.registerApi(this.form).then(res => {
              this.btn_loading = false
              if(res.message === 'OK'){
                this.$tools.diyTips('正在跳转登录界面','success',1400)
                setTimeout(() => {
                  this.$router.push('/login')
                }, 1500)
              } else {
                this.$tools.diyTips(res.message,'error')
              }
            }).catch(() => {
              //异常关闭loading动画
              return this.btn_loading = false
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .register {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #1C202C;

    /deep/.el-form-item__content{
      .el-form-item__error{
        color: red;
        letter-spacing: 5px;
      }
    }

    .register-box {
      height: 500px;
      width: 450px;
      background: rgba(255, 255, 255, .5);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 20px;
      box-sizing: border-box;
      padding: 30px 30px 50px 30px;

      & > img{
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }

      .tips {
        width: 100%;

        & > p {
          font-size: 24px;
          color: #ffffff;
          margin: 10px 0px 0px 0px;
          padding-bottom: 10px;
        }
      }

      .form-box{

        .register-form {
          width: 100%;
          margin-top: 20px;
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

        .register-btn {
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

        .register-btn:hover {
          background-color: #67C23A;
          opacity: 0.6;
        }
      }

      .login{
        letter-spacing: 2px;
        font-size: 16px;
        margin-top: 20px;
      }
    }
  }


</style>
