<template>
  <div class="bottom-component">
    <div>
      <a href="https://beian.miit.gov.cn/">网站备案号</a>
      <a href="https://beian.miit.gov.cn/">粤ICP20038205号</a>
    </div>
    <div>
      <span>QQ</span>
      <span>1012719865</span>
    </div>
    <div>本网站仅学习使用，有关侵权，请联系删除</div>
  </div>
</template>

<script>
  export default {
    name : "bottomComponent" ,
    props:{},

    data(){
      return {}
    },

    components:{},

    created(){},

    mounted(){},

    computed:{},

    methods:{},

    watch:{},
  }
</script>

<style scoped lang="less">
  .bottom-component{
    box-shadow: 0 10px 30px 3px #AAA;
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: center;
    margin-top: 20px;
    align-items: center;
    color: #999aaa;
    background: #fff;

    div{
      margin: 0px 50px;
    }
    a{
      text-decoration:none;
      margin-right: 10px;
      color: inherit;
    }
    span{
      margin-right: 10px;
    }
  }
</style>