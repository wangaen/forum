<template>
  <div class="nav-main">
    <div class="logo-search">
      <img src="../../assets/logo.png" alt="">
      <el-form>
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select" style="width: 400px;">
          <el-button slot="append" icon="el-icon-search" @click="searchArticles" class="search-button"></el-button>
        </el-input>
      </el-form>
      <navbarLabel @cancelSearch="cancelSearch"></navbarLabel>
    </div>
    <div class="btn-main" v-if="!ifShow">
      <el-button type="primary" @click="$router.push('/register')">注册</el-button>
      <el-button type="success" @click="$router.push('/login')">登录</el-button>
    </div>
    <div class="my-box" v-if="ifShow">
      <img :src="avatarUrl" alt="" @mouseenter="ifShowAvatar = false" v-show="ifShowAvatar">
      <el-button type="danger" @click="send_btn" :class="{'opacitySend' : $route.path == '/send_article'}">发布</el-button>
    </div>
    <div @mouseenter="ifShowAvatar = false" @mouseleave="ifShowAvatar = true" v-show="!ifShowAvatar"  class="avatar-hover">
      <avatarHover @getShowAvatar="getShowAvatar"></avatarHover>
    </div>
  </div>
</template>

<script>
import navbarLabel from './navbarLabel';
import avatarHover from '../avatarHover/avatarHover'
  export default {
    name : "navbar" ,
    data(){
      return {
        search: '',
        ifShow: false,
        ifShowAvatar: true,
        avatarUrl: '',
        //当前是否正在进行模糊查询
        now_search: false
      }
    },
    components:{
      avatarHover,
      navbarLabel
    },
    created(){
      this.ifLogin()
    },
    computed:{
      getUpdateAvatarStatu(){
        return this.$store.getters.getUpdateAvatarStatu
      },
      getRefreshIndex(){
        return this.$store.getters.getRefreshIndex
      },
    },
    methods:{
      //判断是否登录
      async ifLogin(){
        let id = this.$store.getters.getUserID
        if(id){
          await this.$Api.getUserInfo({id}).then(res => {
            if(res.message == 'OK'){
              this.ifShow = true;
              this.avatarUrl = this.$store.getters.getUserAvatar;
            }else{
              this.$router.push('/')
              window.localStorage.setItem('kuajingtongstatu','nologin')
              this.$store.commit('removeUserData')
              window.location.reload()  
            }
          })
        }else{
          window.localStorage.setItem('kuajingtongstatu','nologin')
        }
      },
      send_btn(){
        this.$router.push({path:'/send_article', query:{id: this.$store.getters.getUserID}})
      },
      getShowAvatar(value){
        this.ifShowAvatar = value
      },
      //模糊查询文章
      searchArticles(){
        this.now_search = true;
        if(this.$route.path != '/'){
          this.$router.push('/')
          setTimeout(() => {
            let search = this.search
            this.$store.commit('setSearch', search + '&'+ (+new Date))
          }, 0)
        }else{
          this.$store.commit('setSearch', this.search + '&'+ (+new Date))
        }
      },
      cancelSearch(){
        if(!this.now_search){
          this.search = ''
          this.now_search = false
        }
      }
    },

    watch:{
      getUpdateAvatarStatu(val){
        if(val){
          this.ifLogin()
        }
      },
      getRefreshIndex(val){
        if(val){
          this.search = ''
          this.now_search = false
        }
      },
    },
  }
</script>

<style scoped lang="less">
  .nav-main{
    width: 100%;
    height: 64px;
    display: flex;
    justify-content: space-between;
    background-color: #444d56;
    line-height: 64px;
    text-align: center;
  }
  .logo-search{
    width: 850px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .search-button:hover{
    width: 56px;
    /deep/.el-icon-search{
      &::before{
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
  .btn-main{
    margin-right: 30px;
  }
  .logo-search > img{
    width: 40px;
    height: 40px;
    margin-right: 20px;
    border-radius: 50%;
  }
  .el-form-item{
    margin-bottom: 0px;
  }
  .el-form > .el-input{
    width: 300px;
  }
  .my-box > img{
    width: 32px;
    height: 32px;
    margin-right: 20px;
    border-radius: 50%;
    cursor: pointer;
  }
  .my-box{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 30px;
  }
  .opacitySend{
    opacity: 0;
  }
  .avatar-hover{
    position: fixed;
    top: 64px;
    right: 50px;
  }
  .el-button--danger{
    color:#fff;
    border: 1px solid #0099ff;
    background-color: #0099ff;
    
    &:hover{
      border: 1px solid #015BF1;
      background-color: #015BF1;
    }
  }
</style>