<template>
  <div class="navbarlabel">
    <div v-for="(item,index) in labelArr" :key="index" :style="{width:`${width}`}">
      <span @click="goHome(index)">{{item}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name : "navbarlabel" ,
    props:{
      labelArr:{
        type: Array,
        default: () => ['首页','推荐','热门']
      },
      width:{
        type: String,
        default: '80px'
      }
    },
    methods:{
      goHome(index){
        if(index === 0){
          this.$router.push( {path: '/'}, () => {})
          if(this.$route.path === '/'){
            this.$store.commit('setRefreshIndex', ''+(+new Date()))
          }
        }else if(index == 1 || index == 2){
          this.$confirm('该功能正在努力开发中...', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {}).catch(() => {})
        }
      }
    },

    watch:{
      '$route.path': function (val) {
        if (val) {
          this.$emit('cancelSearch')
        }
      },
    },
  }
</script>

<style scoped lang="less">
  .navbarlabel{
    margin-left: 20px;
    display: flex;
    color: #fff;
  }
  .navbarlabel > div > span:hover {
    width: 40px;
    color: #0099ff;
    font-weight: 550;
    cursor: pointer;
  }
</style>