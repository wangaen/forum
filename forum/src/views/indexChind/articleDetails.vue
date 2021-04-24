<template>
  <div class="article-details">
    <div class="article-left">
      <div class="article-box">
        <!-- 标题-->
        <div class="title">
          <p>{{articleData.title}}</p>
        </div>
        <!-- 头像用户名简介 -->
        <div class="avatar">
          <div>
            <img :src="user_info.avatar" alt="">
          </div>
          <div>
            <p>{{user_info.nickname}}</p>
            <p>{{user_info.experience}}</p>
          </div>
          <div>
            <div><i class="el-icon-date">{{timeToDate(articleData.created_time)}}</i></div>
            <div>
              <span @click="goLike" :class="{like_color: like_form.status}"><i class="el-icon-thumb">{{articleData.like_num}}</i></span>
              <span><a href="#comment"><i class="el-icon-chat-dot-round">{{comment_num}}</i></a></span>
            </div>
          </div>
        </div>
        <!-- 图片 -->
        <div class="articleimg" v-if="articleData.article_img">
          <img :src="articleData.article_img" alt="">
        </div>
        <!-- 内容-->
        <div class="content">
          <p>{{articleData.content}}</p>
        </div>
      </div>
      <div class="comment-main" id="comment">
        <getComment @commentNumAdd="commentNumAdd"/>
      </div>
    </div>
    <div class="article-right">
      <div class="user-box">
        <img :src="user_info.avatar" alt="">
        <p>{{user_info.nickname}}</p>
        <p style="font-size: 14px;color: #999999;line-height: 24px;">
          {{user_info.experience ? user_info.experience : '此人很懒，连自己的简介都不写!!!'}} 
        </p>
        <div class="box-bottom">
          <div v-for="(item,index) in total_reticle_read_like" :key="index">
            <p>{{item.name}}</p>
            <p>{{item.value}}</p>
          </div>
        </div>
        <div class="user-btn">
          <el-button type="danger" @click="goUserDetailsInfo">查 看 作 者 详 细 信 息</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getComment from './getComment'
  export default {
    name : "articleDetails" ,
    components:{getComment},
    data(){
      return {
        articleData: {},
        show_like_color: false,
        comment_num: 0,
        user_info: {},
        total_reticle_read_like: [],
        like_form:{
          status: false,
          form: {
            article_id: this.$route.params.id,
            user_id: this.$store.getters.getUserID
          }
        }
      }
    },

    async created(){
      //判断是否点赞
      await this.$Api.ifLikeArticle(this.like_form).then(res => this.like_form.status = res.status)
      await this.getData()
      await this.totalReticleReadLikeApi()
    },
    mounted(){
      document.documentElement.scrollTop = 0;
    },
    methods:{
      async getData(){
        await this.$Api.getArticleInfo({id: this.$route.params.id}).then(res => {
          if(res.message == 'OK') {
            this.articleData = res.result;
            this.comment_num = res.result.comment_num
            this.user_info = res.result.user_id
          }
        })
      },
      totalReticleReadLikeApi(){
        this.$Api.totalReticleReadLikeApi({id: this.user_info._id}).then(res => {
          if(res.message == 'OK'){
            this.total_reticle_read_like = res.data
          }
        })
      },
      //点赞
      async goLike(){
        if(await this.$tools.isLogin(this.$store.getters.getUserID)){
          this.$Api.addLikeNum(this.like_form).then(res => {
            if(res.result == '点赞成功'){
              this.like_form.status = true;
              this.articleData.like_num = this.articleData.like_num + 1
              this.totalReticleReadLikeApi()
            }else{
              this.like_form.status = false;
              this.articleData.like_num = this.articleData.like_num - 1
              this.totalReticleReadLikeApi()
            }
          })
        }else{
          this.$tools.diyTips('您还未登录，请登录后再试！！！', 'error',5000)
        }
      },
      commentNumAdd(count){
        this.comment_num += count
      },
      goUserDetailsInfo(){
        this.$router.push({
          path: '/user_details_info',
          query:{
            id: this.user_info._id
          }
        })
      }
    },
    computed:{
      timeToDate(){
        return function(time){
          return this.$tools.timeToDate(time)
        }
      }
    },
    watch:{
    },
  }
</script>

<style scoped lang="less">
  .article-details{
    width: 100%;
    height: 100%;
    padding: 20px 20px 0px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;

    //左边大框
    .article-left{
      width: 860px;
      height: 100%;
      margin-right: 20px;
      .article-box{
        border-radius: 10px;
        padding: 25px 35px;
        margin-bottom: 30px;
        box-sizing: border-box;
        box-shadow: 0 0px 30px 3px #AAA;
        .title{
          color: #333;
          font-size: 30px;
          font-weight: 550;
          text-align: left;
          p{
            margin-top: 10px;
            margin-bottom: 40px;
          }
        }
        .avatar{
          background: #f8f8f8;
          height: 80px;
          border-radius: 5px;
          display: flex;
          margin-bottom: 20px;
          align-items: center;
          padding: 5px;
          box-sizing: border-box;
          img{
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 20px;
          }
          div:nth-child(2){
            font-size: 12px;
            height: 40px;
            width: 520px;
            text-align: left;
            p{
              margin: 0px;
            }
            p:nth-child(1){
              margin-bottom: 5px;
              font-size: 14px;
              font-weight: 550;
            }
            p:nth-child(2){
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          div:nth-child(3){ 
            height: 60px;
            text-align: right;
            display: flex;
            align-items: flex-end;
            flex-direction: column;
            justify-content: space-between;
            width: 210px;
            div:nth-child(1){
              height: 30px;

              font-size: 14px;
              .el-icon-date{
                &::before{
                 margin-right: 5px;
                font-size: 20px;
                color: #444d56;
                font-weight: 1000;
               }
              }
            }
            div:nth-child(2){
              height: 30px;
              width: 163px;
              color:  #2C3E50;
              font-size: 14px;
              display: flex;
              align-items: flex-end;
              justify-content: space-between;

              .like_color{
                color: #0099ff;
                .el-icon-thumb{
                  &::before{
                    color: #0099ff;
                  }
                }
              }
            }
            a{
              color:  #2C3E50;
            }
            .el-icon-thumb{
              cursor: pointer;
              &::before{
                color: #444d56;
                font-weight: 1000;
                font-size: 20px;
              }
            }
            .el-icon-thumb:hover{
              color: #0099ff;
              &::before{
                color: #0099ff;
                font-weight: 1000;
                font-size: 20px;
              }
            }
            .el-icon-chat-dot-round{
              &::before{
                font-weight: 1000;
                color: #444d56;
                font-size: 20px;
              }
            }
            .el-icon-chat-dot-round:hover{
              color: #0099ff;
              &::before{
                font-weight: 1000;
                color: #0099ff;
                font-size: 20px;
              }
            }
          }
        }
        .articleimg{
          margin-bottom: 20px;
          img{
            border-radius: 5px;
            width: 760px;
            height: 396px;
          }
        }
        .content{
          text-align: left;
          p{
            white-space: pre-wrap;
          }
        }
      }
      .comment-main{
        border-radius: 10px;
        box-shadow: 0 0px 30px 3px #AAA;
      }
    }

    //右边大框
    .article-right{
      width: 300px;
      height: 100%;
      // border: 1px solid blue;

      .user-box{
        box-sizing: border-box;
        min-height: 345px;
        max-height: 555px;
        border-radius: 10px;
        box-shadow: 0 0px 30px 3px #AAA;
        padding: 20px 30px;
        background: #FFF;
        img{
          width: 82px;
          height: 82px;
          border-radius: 50%;
        }
        p:nth-child(2){
          font-size: 16px;
          color: #333;
          font-weight: 700;
          display: block;
        }
        .box-bottom{
          display: flex;
          justify-content: space-between;
          div{
            font-size: 16px;
            font-weight: 700;
            display: block;
            
            p:nth-child(2){
              color: red;
            }
          }
        }
        .user-btn{
          .el-button--danger{
            color:#fff;
            border: 1px solid #0099ff;
            background-color: #0099ff;
            
            &:hover{
              border: 1px solid #015BF1;
              background-color: #015BF1;
            }
          }
        }
      }
    }
  }
</style>