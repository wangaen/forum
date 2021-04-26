<template>
<div class="password-box">
  <div class="update-password">
    <div class="input-item">
      <p>旧密码</p>
      <el-input v-model="form.oldpass" show-password placeholder="请输入旧密码"></el-input>  
    </div>
    <div class="input-item">
      <p>新密码</p>
      <el-input v-model="form.newpass" show-password placeholder="请输入新密码"></el-input>  
    </div>
    <div class="input-item">
      <p>确认密码</p>
      <el-input v-model="form.okpass" show-password placeholder="请再次输入新密码"></el-input>  
    </div>
    <div class="input-item">
      <el-button type="primary" @click="updatePass">确 定</el-button>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    name : "update-password" ,
    data(){
      return {
        form:{
          oldpass: '',
          newpass: '',
          okpass: '',
          _id: this.$store.getters.getUserID
        }
      }
    },
    methods:{
     async updatePass(){
        if(this.form.newpass && this.form.oldpass && this.form.okpass){
          if(this.form.newpass === this.form.okpass) {
            await this.$Api.updatePassApi(this.form).then(res => {
              if(res.message === 'OK'){
                this.$tools.diyTips('修改密码成功,请重新登录',res.type,1000)
                setTimeout(() => {
                  this.$router.push('/login')
                  this.$store.commit('removeUserData')
                }, 1500);
              }else{
                this.$tools.diyTips(res.message,res.type)
              }
            }).catch( err => {return console.log('修改密码异常', err)})
          }else{
            this.$tools.diyTips('两次输入的密码不一样','error')
          }
        } else {            
          this.$tools.diyTips('未正确输入信息','error')
        }
      }
    },
  }
</script>

<style scoped lang="less">
  .password-box{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .update-password{
      width: 1000px;
      box-shadow: 0 0px 30px 3px #AAA;
      height: 500px;
      margin-top: 20px;
      padding-top: 100px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .input-item{
        display: flex;
        height: 80px;
        align-items: center;
        margin-bottom: 20px;
        p{
          width: 100px;
          font-weight: 550;
        }
        .el-input{
          width: 500px;
        }
      }
      .input-item:nth-child(4){
        .el-button{
          padding: 15px 50px;
          font-size: 16px;
          letter-spacing: 5px;
        }
      }
    }
  }
</style>