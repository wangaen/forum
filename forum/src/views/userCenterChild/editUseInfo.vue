<template>
  <div class="edit-box">
    <div class="input-box">
      <div>
        <p>用户昵称</p>
        <el-input v-model="form.nickname" placeholder="请输入内容"></el-input>  
      </div>
      <div class="email">
        <p>邮箱</p>
        <el-input v-model="form.email" disabled></el-input>
      </div>
    </div>
    <div class="input-box">
      <div>
        <p>性别</p>
        <el-radio v-model="form.gender" :label="'1'" border>男</el-radio>
        <el-radio v-model="form.gender" :label="'0'" border>女</el-radio>
      </div>
      <div>
        <p>地址</p>
        <el-input v-model="form.location" placeholder="请输入内容"></el-input>
      </div>
    </div>
    <div class="input-box">
      <div>
        <p>真实姓名</p>
        <el-input v-model="form.realname" placeholder="请输入内容" maxlength="10"></el-input>  
      </div>
      <div>
        <p>出生日期</p>
        <el-date-picker
          v-model="form.birthday"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </div>
    </div>
    <div class="input-box">
      <div>
        <p>个人简介</p>
        <el-input v-model="form.experience" type="textarea" placeholder="请输入内容" :rows="3" maxlength="170"></el-input>  
      </div>
    </div>
    <div class="btn-box">
      <el-button type="danger" round @click.stop="closeUserInfo">取消</el-button>
      <el-button type="danger" round @click.stop="saveUserInfo">保存</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name : "editUserInfo" ,
    props:{
      userData:{
        type: Object,
        default: () =>{
          return {}
        }
      }
    },
    data(){
      return {
        form:{
          _id: '',
          //邮箱
          email: '',
          //用户名
          nickname: '',
          //真实姓名
          realname:'',
          //地址
          location:'',
          //个人简介
          experience:'',
          //性别
          gender: '-1',
          //出生日期
          birthday: '',
        }
      }
    },
    created(){
      let userData =  this.userData
      for(let value in this.form){
        this.form[value] = userData[value]
      }
    },
    methods:{
      closeUserInfo(){
        //关闭编辑页面
        this.$emit('closeUserInfo')
      },
      saveUserInfo(){
        this.$Api.editUserInfo(this.form).then(res => {
          if(res.message == 'OK'){
            this.$emit('saveUserInfo')
          }else{
            this.$tools.diyTips(res.message,res.type)
          }
        })
      }
    },
  }
</script>

<style scoped lang="less">
  .edit-box{
    width: 940px;
  }
  .input-box{
    display: flex;
    justify-content: space-between;
  }

  .input-box ::v-deep{
    .el-radio__inner{
      display: none;
    }
  }
  .input-box ::v-deep{
    .el-radio__label{
      padding: 79.5px;
    }
  }
  .email ::v-deep{
    .el-input{
      position: static;
    }
  }
  .input-box > div > .el-input{
    width: 450px;
  }
  .input-box > div > div{
    display: flex;
  }
  .input-box > div > .el-textarea{
    width: 940px;
  }
  .btn-box{
    width: 940px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .btn-box > .el-button{
    margin-right: 50px;
  }
  .el-button--danger:nth-child(1){
    color:#0099ff;
    border: 1px solid #0099ff;
    background-color: #fff;
    
    &:hover{
      color:#015BF1;
      border: 1px solid #015BF1;
      background-color: #fff;
    }
  }
  .el-button--danger:nth-child(2){
    border: 1px solid #0099ff;
    background-color: #0099ff;

    &:hover{
      border: 1px solid#015BF1;
      background-color: #015BF1;
    }
  }
</style>