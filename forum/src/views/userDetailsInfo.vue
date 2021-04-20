<template>
<div class="user-details-info">
  <div class="person-box">
    <div class="user-box" v-if="!if_my">
      <div class="user-avatar">
        <img :src="user_info.avatar" alt="">
      </div>
      <div class="user-info">
        <p class="nickname">{{user_info.nickname}}</p>
        <p class="nickname">{{user_info.gender == '1' ? '男' : user_info.gender == '0' ? '女' : ''}}</p>
        <p class="experience">{{user_info.experience ? user_info.experience : '此人很懒，连自己的简介都不写!!!'}}</p>
      </div>
    </div>
    <div class="data_info">
      <ul>
        <li  v-for="item in article_data" :key="item.id" >
          <div>{{item.value}}</div>
          <div>{{item.name}}</div>
        </li>
      </ul>
    </div>
    <div class="articles_box">
      <div class="articls_operate">
        <h3>排序</h3>
        <h6 v-for="(item,index) in sort_label" :key="index" :class="{label_color: index == if_show_label_color}" @click="sortCheck(index)">
          {{item}}<li class="el-icon-sort"></li>
        </h6>
      </div>
      <div class="article-main">
        <template>
          <el-table :data="all_articles" style="width: 100%" :show-header="false">
            <el-table-column width="740px">
              <template slot-scope="scope">
                <div class="tb-t-top" @click="goArticle(scope.row._id)">
                  <span>{{scope.row.title}}</span>
                </div>
                <div class="tb-t-center">
                  <p>{{scope.row.content}}</p>
                </div>
                <div class="tb-t-bottom">
                  <div class="icon-box">
                    <span><i class="el-icon-view"></i>{{scope.row.read_num}}</span>
                    <span><i class="el-icon-chat-dot-round"></i>{{scope.row.comment_num}}</span>
                    <span><i class="el-icon-thumb"></i>{{scope.row.like_num}}</span>
                  </div>
                  <div>
                    <span>{{timeToDate(scope.row.created_time)}}</span>
                  </div>
                  <div v-if="if_my" class="if_my">
                    <span @click="goSendArticle(scope.row)">修改</span>
                    <span @click="deleteArticle(scope.row._id)">删除</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="200px">
              <template slot-scope="scope">
                <div class="demo-image__preview" v-if="scope.row.article_img">
                  <el-image 
                    style="width: 190px; height: 120px"
                    :src="scope.row.article_img" 
                    :preview-src-list="[scope.row.article_img]"
                    lazy>
                  </el-image>
                </div>
                <div class="tb-b-top" v-else></div>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <div class="page-box">
          <el-pagination  :current-page.sync="now_page" background layout="prev, pager, next" 
            :total="totalpage" @current-change="currentChange">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    name : "userDetailsInfo" ,
    data(){
      return {
        if_show_label_color: 0,
        now_page: 1,
        sort_label: ['按最新发布时间','按访问量','按点赞数'],
        article_data: [],
        totalpage: 2,
        if_my: false,
        all_articles: [],
        user_info: {},
        form:{
          id: this.$route.query.id,
          page: 1,
          sort_status: 0,
        }
      }
    },
    mounted(){
      document.documentElement.scrollTop = 0;
    },
     created(){
      this.getUserInfo()
      this.totalReticleReadLikeApi()
      this.getUserAllArticles()
    },
    methods:{
      getUserAllArticles(){
        this.$Api.getUserAllArticles(this.form).then(res => {
          if(res.message == 'OK'){
            this.all_articles = res.result
          }
        })
      },
      totalReticleReadLikeApi(){
        this.$Api.totalReticleReadLikeApi({id: this.$route.query.id}).then(res => {
          if(res.message == 'OK'){
            this.article_data = res.data
            this.totalpage = res.data[0].value
          }
        })
      },
      getUserInfo(){
        this.$Api.getUserInfo({id: this.$route.query.id}).then(res => {
          if(res.message == 'OK'){
            this.user_info = res.result
            this.if_my = this.user_info._id == this.$store.getters.getUserID
          }
        })
      },
      sortCheck(index){
        this.if_show_label_color = index
        this.form.sort_status = index
        this.getUserAllArticles()
      },
      goArticle(id){
        this.$router.push(`/article/details/${id}`)
        this.$Api.addReadNumApi({id}).then(() => {})
      },
      //点击某一页时，currentpage为页码
      currentChange(currentpage){
        this.form.page = currentpage
        this.getUserAllArticles()
      },
      //修改文章
      goSendArticle(form){
        this.$router.push({path: '/send_article', query: {...form}})
      },
      //删除文章
      deleteArticle(id){
        this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$Api.articleDelete({id}).then(res => {
            this.$tools.diyTips(res.message, res.type)
            this.totalReticleReadLikeApi()
            this.getUserAllArticles()
          })
        }).catch(() => {});
      }
    },
    computed: {
      // 时间转换
      timeToDate(){
        return function(time){
          return this.$tools.timeToDate(time)
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .user-details-info{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  }
  .person-box{
    width: 1000px;
    // border: 1px solid red;
    .user-box{
      margin: 20px 0px;
      position: relative;
      display: flex;
      width: 1000px;
      justify-content: flex-start;
      align-items: center;
      height: 200px;
      .user-avatar{
        // border: 1px solid blue;
        width: 200px;
        img{
          z-index: 1999;
          position: absolute;
          top: 0px;
          left: 0px;
          box-shadow: 0 0px 30px 3px #AAA;
          animation: rotate 5s linear infinite;
          width: 190px;
          border: 5px solid #FFF;
          border-radius: 50%;
          height: 190px;
        }
      }
      .user-info{
        height: 200px;
        border-radius: 100px;
        width: 1000px;
        text-align: left;
        padding: 20px 50px 20px 220px;
        box-sizing: border-box;
        // border: 1px solid red; 
        position: absolute;
        left: 0px;
        top: 0px;
        box-shadow: 0px 0px 30px 3px #AAA;
        p{
          margin: 15px 0px
        }
        p:nth-child(1){
          margin-top: 0px;
        }
        .nickname{
          font-weight: 700;
          font-size: 20px;
        }
        .experience{
          letter-spacing: 1px;
          line-height: 20px;
          font-size: 16px;
        }
      }
    }
  }
  .data_info{
    margin: 20px 0px;
    padding: 20px 100px;
    border-radius: 50px;
    box-shadow: 0px 0px 30px 3px #AAA;
    ul{
      display: flex;
      padding-left: 0px;
      margin: 0px 0px;
      justify-content: space-between;
      align-items: center;
      list-style-type: none;
      list-style: none;
      li{
        list-style-type: none;
        list-style: none;
        div:nth-child(1){
          color: #222226;
          font-weight: 1000;
          font-family: DINCond-Black;
          font-size: 24px;
          line-height: 24px;
          margin-bottom: 16px;
        }
        div:nth-child(2){
          color: #999AAA;
          font-family: DINCond-Black;
          font-size: 16px;
          line-height: 16px;
        }
      }
    }
  }
  .articles_box{
    border-radius: 50px;
    padding: 20px 30px;
    box-sizing: border-box;
    box-shadow: 0 0px 30px 3px #AAA;
    text-align:left;
    .articls_operate{
      display: flex;
      width: 400px;
      align-items: center;
      justify-content: space-between;
      h3{
        margin-top: 0px;
      }
      h6{
        cursor: pointer;
        font-size: 14px;
        font-weight: 400;
        margin: 0px 0px 15px 0px;
        box-sizing: border-box;
      }
      h6:hover{
        color: #0099ff;
      }
      li{
        font-weight: 1000;
      }
      .label_color{
        color: #0099ff;
      }
    }
    .article-main{
      border-top: 1px solid #d4d5da;
        .tb-t-top{
          font-size: 20px;
          font-weight: 520;
          height: 32px;
          line-height: 32px;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          &:hover{
            cursor:pointer;
            color: #0099ff;
          }
        }
        .tb-t-center{
          padding: 0px 0px 20px 0px;
          word-break: break-all;
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          font-size: 14px;
          height: 50px;
          color: #999;

          p{
            margin: 7px 0px;
          }
        }
        .tb-t-bottom{
          display: flex;
          justify-content: space-between;
          height: 40px;

          div{
            flex: 1;
            display: flex;
            justify-content: flex-start;
            align-items: center;

            img{
              width: 32px;
              height: 32px;
              cursor: pointer;
              border-radius: 50%;
            }
            span{
              color: #999;
              font-size: 12px;
            }
            span:nth-child(2){
              margin: 0px 20px;
            }
            .nickname{
              cursor: pointer;
            }
            .nickname:hover{
              color: #0099ff;
            }
          }
          .icon-box{
            .el-icon-view{
              margin-right: 2px;
              font-size: 14px;
            }
            .el-icon-chat-dot-round{
              margin-right: 2px;
              font-size: 14px;
            }
            .el-icon-thumb{
              margin-right: 2px;
              font-size: 14px;
            }
          }
          .if_my{
            span{
              cursor: pointer;
            }
            span:nth-child(1){
              color: #0099ff
            }
            span:nth-child(2){
              color: #fc5531
            }          
          }
        }

        .tb-b-top{
          width: 100%;
          height: 130px;
          img{
            width: 100%;
            height: 130px;
          }
        }
      .el-table ::v-deep{
        .el-table__header-wrapper{
          display: none;
        }
      }
      .page-box{
        display: flex;
        justify-content: center;
        margin: 20px 0px 0px 0px;
      }
    }
  }
  @keyframes rotate{
    0% { transform: rotate(0); }
    100% { transform: rotate(360deg); }
  }
</style>