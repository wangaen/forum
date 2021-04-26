<template>
  <div id="app" :class="{'app-padding-top': !app_padding_top}">
    <navbar class="navbar-box" v-if="!app_padding_top"></navbar>
    <router-view/>
    <bottomComponent v-show="$route.path === '/'" class="bottom"></bottomComponent>
  </div>
</template>

<script>
import navbar from './components/header/navbar'
import bottomComponent from './components/footer/bottomComponent'
  export default {
    name : "app" ,
    components:{
      navbar,
      bottomComponent
    },
    data(){
      return{
        app_padding_top: this.$route.path === '/login' || this.$route.path === '/register', 
      }
    },
    watch: {
      '$route.path': function (val) {
        if (val === '/login' || val === '/register' || val === '/not_found') {
          this.app_padding_top = true
        }else{
          this.app_padding_top = false
        }
      },
    }
  }
</script>

<style lang="less">
#app {
  width: 100%;
  min-height: 100%;
  padding-bottom: 20px;
  position: relative;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  .bottom{
    position: absolute;
    bottom: -70px;
    left: 0px;
  }
  .navbar-box{
    width: 100%;
    position: fixed;
    top: 0px;
    z-index: 9999;
    left: 0px;
  }
}
.app-padding-top{
  padding-top: 64px;
}
.el-image-viewer__wrapper::v-deep{
  .el-image-viewer__btn .el-image-viewer__close{
    border: 2px solid red;
  }
}
</style>
