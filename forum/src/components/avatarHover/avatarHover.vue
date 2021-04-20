<template>
  <div class="avater-main">
    <div class="info-box">
      <img :src="avatar" alt="">
      <h3 style="padding-top: 40px;margin:0px;">{{nickname}}</h3>
    </div>
    <el-menu
      class="el-menu-vertical-demo" menu-trigger="click" @select="selectMenu">
      <el-menu-item index="1">
        <span slot="title">个人中心</span>
      </el-menu-item>
      <el-menu-item index="2">
        <span slot="title">发布管理</span>
      </el-menu-item>
      <el-menu-item index="3">
        <span slot="title">修改密码</span>
      </el-menu-item>
      <el-menu-item index="4">
        <span slot="title">退出登录</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name : "avatarHover" ,
    props:{},
    data(){
      return {
        avatar: '',
        nickname: '',
        userId: '',
        show: false,
      }
    },

    created(){
      this.getData()
    },

    mounted(){
    },

    computed:{
      getUpdateAvatarStatu(){
        return this.$store.getters.getUpdateAvatarStatu
      }
    },

    methods:{
      getData(){
        this.avatar = this.$store.getters.getUserAvatar;
        this.nickname = this.$store.getters.getUserName;
        this.userId = this.$store.getters.getUserID
      },
      async selectMenu(index){
        if(await this.$tools.isLogin(this.$store.getters.getUserID)){
          if(index == 1){
            this.$emit('getShowAvatar',true)
            this.$router.push({
              path:'/user_center',query:{id: this.userId}
            },() => {})
          }else if(index == 2){
            this.$emit('getShowAvatar',true)
            this.$router.push({
              path:'/user_details_info',query:{id: this.userId}
            },() => {})
          }else if(index == 3){
            this.$emit('getShowAvatar',true)
            this.$router.push({
              path:'/update_password'
            }, () => {})
          }else if(index == 4){
            this.$emit('getShowAvatar',true)
            this.$confirm('是否退出登录?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$store.commit('removeUserData')
              this.$router.push('/')
              window.localStorage.setItem('kuajingtongstatu','nologin')
              window.location.reload();
            }).catch(() => {});
          }
        }else{
          this.$router.push('/')
          window.localStorage.setItem('kuajingtongstatu','nologin')
          this.$store.commit('removeUserData')
          window.location.reload()
        }
      }
    },
    watch:{
      getUpdateAvatarStatu(val){
        if(val){
          setTimeout(() => {
            this.getData()
          }, 500);
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .avater-main{
    width: 200px;
    height: 350px;
    background-color: #fff;
    box-shadow: 0 3px 6px 2px #AAA;
  }
  .info-box{
    position: relative;
  }
  .info-box > img {
    position: absolute;
    cursor: pointer;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    top: -45px;
    left: 60px;
  }
  .el-menu ::v-deep{
    .el-menu-item.is-active{
      color: #303133;
    }
  }
</style>