<template>
  <div class="index">
    <div class="index-main">
      <template>
        <el-table :data="tableData" style="width: 100%">
          <el-backtop :right="40" :bottom="60" :visibility-height="2000"></el-backtop> 
          <el-table-column width="800px">
            <template slot-scope="scope">
              <div class="tb-t-top" @click="goArticle(scope.row._id)">
                <span>{{scope.row.title}}</span>
              </div>
              <div class="tb-t-center">
                <p>{{scope.row.content}}</p>
              </div>
              <div class="tb-t-bottom">
                <div>
                  <img :src="scope.row.user_id.avatar" @click="goUserInfo(scope.row.user_id._id)">
                  <span class="nickname" @click="goUserInfo(scope.row.user_id._id)">{{scope.row.user_id.nickname}}</span>
                  <span>{{getTime(scope.row.created_time)}}</span>
                </div>
                <div class="icon-box">
                  <span><i class="el-icon-view"></i>{{scope.row.read_num}}</span>
                  <span><i class="el-icon-chat-dot-round"></i>{{scope.row.comment_num}}</span>
                  <span><i class="el-icon-thumb"></i>{{scope.row.like_num}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="250px">
            <template slot-scope="scope">
              <div class="demo-image__preview" v-if="scope.row.article_img">
                <el-image 
                  style="width: 250px; height: 150px"
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
        <el-pagination  :current-page.sync="now_page" background layout="prev, pager, next" :total="Math.ceil(total/2)" @current-change="currentChange"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
  export default {
    name : "index" ,
    props:{},

    data(){
      return {
        tableData: [],
        total: 10,
        now_page: 1,
        form:{
          search: '',
          page: 1
        }
      }
    },
    async created(){
      await this.getData()
    },
    computed:{
      // 时间转换
      getTime() {
        return function(value) {
          return this.$tools.getDate(value)
        }
      },
      getRefreshIndex(){
        return this.$store.getters.getRefreshIndex
      },
      getSearch(){
        return this.$store.getters.getSearch
      }
    },
    methods:{
      async getData(){
        await this.$Api.getArticle(this.form).then(res => {
          if(res.message === 'OK'){
            this.tableData = res.result
            this.total = res.total
            //点击下一页时跳转到顶部
            document.documentElement.scrollTop = 0;
          }
        })
      },
      //点击某一页时，currentpage为页码
      currentChange(currentpage){
        this.form.page = currentpage
        this.getData()
      },
      goArticle(id){
        this.$router.push(`/article/details/${id}`)
        this.$Api.addReadNumApi({id}).then(() => {})
      },
      refreshIndex(){
        this.form.search = ''
        this.form.page = 1
        this.getData()
        //复原页码为第一页
        this.now_page = 1;
      },
      goUserInfo(user_id){
        this.$router.push({
          path: '/user_details_info',
          query:{
            id: user_id
          }
        })
      }
    },

    watch:{
      getRefreshIndex(val){
        if(val){
          this.refreshIndex()
        }
      },
      async getSearch(newVal){
        let newSearch = newVal.split('&')[0]
        if(newSearch){
          this.form.search = newSearch
          await this.getData()
        }
      }
    },
  }
</script>

<style scoped lang="less">
  .index{
    width: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;

    .index-main{
      border-radius: 10px;
      box-shadow: 0 0px 30px 3px #AAA;
      padding: 20px 20px 0px 20px;
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
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        font-size: 14px;
        height: 78px;
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
      }

      .tb-b-top{
        width: 100%;
        height: 130px;
        img{
          width: 100%;
          height: 130px;
        }
      }
    }
    .el-table ::v-deep{
      .el-table__header-wrapper{
        display: none;
      }
    }

    .page-box{
      margin: 20px 0px 40px 0px;
    }
  }
  .index ::v-deep{
    .el-backtop{
      visibility: visible;
    }
  }
</style>