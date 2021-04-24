<template>
  <div class="comment-box">
    <!-- 评论输入款 -->
    <div class="my-box" v-if="ifLogin">
      <div class="avatar-input">
        <img :src="$store.getters.getUserAvatar" alt="">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 2}"
          placeholder="请输入评论内容"
          @focus="commentInputFocus"
          maxlength="200"
          v-model="comment_article">
        </el-input>
      </div>
      <div class="btn-box" v-show="showBtn">
        <el-button type="primary" round @click="cancelComment">取 消 评 论</el-button>
        <el-button type="primary" round @click="sendComment">发 表 评 论</el-button>
      </div>
    </div>
    <div class="sort-box" v-if="all_comment_data.length">
      <h3>排序</h3>
      <h6 @click="sortCheck">按时间<li class="el-icon-sort"></li></h6>
    </div>
    <!-- 评论列表 -->
      <div class="user-comment" v-for="(item,index) in all_comment_data" :key="index">
        <!-- 一级评论列表（评论文章）展示 -->
        <img :src="item.from_user_id.avatar" @click="goUserDetail(item.from_user_id._id)">
        <div class="box-right">
          <div style="font-weight: 550;">{{item.from_user_id.nickname}}</div>  
          <p>{{item.content}}</p>
          <div class="options">
            <span class="delete-comment" v-if="is_my == item.from_user_id._id" @click="deleteComment(item)">删除</span>
            <span class="reply" @click="goReplyOneComment(index, item.from_user_id)">回复</span>
            <span >{{getTime(item.created_time)}}</span>
          </div>
          <!-- 回复输入框 一级评论-->
          <div class="my-box" v-if="show_one_comment === index">
            <div class="avatar-input">
              <img :src="$store.getters.getUserAvatar">
              <el-input
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 2}"
                :placeholder="`回复: ${item.from_user_id.nickname}`"
                maxlength="200"
                v-model="comment_form.content">
              </el-input>
            </div>
            <div class="btn-box">
              <el-button type="primary" round @click="cancelReplyOneComment">取 消 回 复</el-button>
              <el-button type="primary" round @click="sendReply">发 表 评 论</el-button>
            </div>
          </div>

          <!-- 二级评论（回复别人的评论） -->
          <div class="user-comment child-comment" v-for="(value,_index) in item.second_comment" :key="_index">
            <img :src="value.from_user_info.avatar" @click="goUserDetail(value.from_user_info._id)">
            <div class="box-right reply-right">
              <div style="font-weight: 550;">{{value.from_user_info.nickname}}</div>  
              <p>{{ value.content }}</p>
              <div class="options">
                <span 
                  class="delete-comment" 
                  v-if="is_my == value.from_user_info._id" 
                  @click="deleteComment(value)"
                >删除
                </span>
                <span class="reply" @click="goSecondReply(value._id, '' ,value.from_user_info)">回复</span>
                <span >{{getTime(value.created_time)}}</span>
              </div>
              <!-- 回复输入框 回复别人的回复-->
              <div class="my-box reply-box" v-if="showChildComment == value._id">
                <div class="avatar-input">
                  <img :src="$store.getters.getUserAvatar" alt="">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 1, maxRows: 2}"
                    :placeholder="`回复: ${value.from_user_info.nickname}`"
                    maxlength="200"
                    v-model="comment_form.content">
                  </el-input>
                </div>
                <div class="btn-box">
                  <el-button type="primary" round @click="cancelReplyOneComment">取 消 回 复</el-button>
                  <el-button type="primary" round @click="sendReply">发 表 评 论</el-button>
                </div>
              </div>
            <!-- 三级评论 -->
              <div  class="three_comment_box" v-for="(value_child,index_child) in value.second_comment" :key="index_child">
                <img :src="value_child.from_user_info.avatar" @click="goUserDetail(value_child.from_user_info._id)">
                <div class="box-right reply-right three_box-right">
                  <div style="font-weight: 550;">{{value_child.from_user_info.nickname}}</div>  
                  <p>回复
                    <span 
                      style="color: #0099ff" 
                      class="get-user" 
                      @click="goUserDetail(value_child.to_user_info._id)"
                    >
                      @{{value_child.to_user_info.nickname}}
                    </span>
                    :
                    {{value_child.content}}
                  </p>
                  <div class="options">
                    <span 
                      class="delete-comment" 
                      v-if="is_my == value_child.from_user_info._id" 
                      @click="deleteComment(value_child)"
                    >删除
                    </span>
                    <span class="reply" @click="goSecondReply(value._id, value_child._id , value_child.from_user_info)">回复</span>
                    <span >{{getTime(value_child.created_time)}}</span>
                  </div>
                  <!-- 回复输入框 回复别人的回复-->
                  <div class="my-box reply-box three_left_margin" v-if="showChildComment == value_child._id">
                    <div class="avatar-input">
                      <img :src="$store.getters.getUserAvatar" alt="">
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 1, maxRows: 2}"
                        :placeholder="`回复: ${value_child.from_user_info.nickname}`"
                        maxlength="200"
                        v-model="comment_form.content">
                      </el-input>
                    </div>
                    <div class="btn-box">
                      <el-button type="primary" round @click="cancelReplyOneComment">取 消 回 复</el-button>
                      <el-button type="primary" round @click="sendReply">发 表 评 论</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!all_comment_data.length && !ifLogin" style="color:#999AAA; margin-bottom:10px;">
       此文章暂无评论
      </div>
      <div class="page-box">
        <el-pagination  :current-page.sync="now_page" background layout="prev, pager, next" :total="total" @current-change="currentChange"></el-pagination>
      </div>
  </div>
</template>

<script>
  export default {
    name : "getComment" ,

    data(){
      return {
        show_one_comment: -1, //确定回复输入框的插入位置
        showBtn: false, //显示评论输入框
        showChildComment: '',
        comment_article: '',
        total: 10,
        now_page: 1,
        is_my: this.$store.getters.getUserID,
        all_comment_data: [],

        comment_form:{
          article_id: this.$route.params.id,
          content: '',
          parent_id: '',
          comment_grade: '',
          from_user_id: this.$store.getters.getUserID,
          to_user_id: ''
        },
        form: {
          article_id: this.$route.params.id,
          sort_status: -1,
          page: 1
        },
        ifLogin: false,
      }
    },

    async created(){
      this.ifLogin = await this.$tools.isLogin(this.$store.getters.getUserID)
      this.getData()
    },

    mounted(){},
    methods:{
      //获取所有评论
      getData(){
        this.$Api.commentGetApi(this.form).then(res => {
          if(res.message === 'OK'){
            this.all_comment_data = res.result
            this.total = res.total
            // //点击下一页时跳转到顶部
            // document.documentElement.scrollTop = 0;
          }else{
            this.$tools.diyTips('网络异常，请稍后再试','error')
          }
        })
      },
      //点击某一页时，currentpage为页码
      currentChange(currentpage){
        this.form.page = currentpage
        this.getData()
      },
      //点击回复————回复一级评论
      async goReplyOneComment(index,user_info){
        if( await this.ifLogin){
          //清除评论文章的内容
          this.comment_article = ''
          //清除评论内容
          this.comment_form.content = '';
          //评论id
          this.comment_form.parent_id = this.all_comment_data[index]._id
          //被回复人id
          this.comment_form.to_user_id = user_info._id;
          //评论类型
          this.comment_form.comment_grade = '2'
          //关闭评论输入框
          this.showBtn = false;
          //对应位置插入回复框
          this.show_one_comment = index;
          this.showChildComment = ''
        }else{
          this.$tools.diyTips('您还未登录，请登录后再试！！！', 'error',5000)
        }
      },
      //点击评论文章输入框
      async commentInputFocus(){
        if(await this.ifLogin){
          this.comment_form.content = '';
          this.show_one_comment = -1;
          this.showBtn = true;
          this.showChildComment = ''
        }else{
          this.$tools.diyTips('您还未登录，请登录后再试！！！', 'error',5000)
        }
      },
      //取消评论
      cancelComment(){
        this.showBtn = false;
        this.comment_article = ''
      },
      //取消回复
      cancelReplyOneComment(){
        this.comment_form.content = '';
        this.show_one_comment = -1;
        this.showChildComment = ''
      },
      //添加评论
      sendComment(){
        this.comment_form.content = this.comment_article
        this.comment_form.to_user_id = this.$store.getters.getUserID;
        this.comment_form.comment_grade = '1'
        this.$Api.commentAddApi(this.comment_form).then(res => {
          if(res.message === 'OK'){
            this.getData()
            this.comment_form.content = ''
            this.comment_article = ''
            this.showBtn = false
            //更新评论个数，不请求接口，图片不在加载，减少服务器压力
            this.$emit('commentNumAdd', 1)
            this.$tools.diyTips('评论成功',res.type)
          }else{
            this.$tools.diyTips('评论失败，请稍后再试','error')
          }
        })
      },
      sendReply(){
        this.$Api.commentAddApi(this.comment_form).then(res => {
          if(res.message == "OK"){
            this.$tools.diyTips('回复成功','success')
            //更新评论个数，不请求接口，图片不在加载，减少服务器压力
            this.$emit('commentNumAdd', 1)
            this.showChildComment = ''
            this.show_one_comment = -1
            this.comment_form.content = ''
            this.getData()
          }else{
            this.$tools.diyTips(res.msg,'error')
          }
        })
      },

      deleteFormId(delete_data){
        let delete_form = []
        delete_form.push({_id: delete_data._id})
        if(delete_data.second_comment.length){
          delete_data.second_comment.forEach(value => {
            delete_form.push({_id: value._id})
            if(value.second_comment && value.second_comment.length){
              value.second_comment.forEach(data => {
                delete_form.push({_id: data._id})
              })
            }
          })
        }
        return delete_form
      },
      //删除评论
      deleteComment(delete_data){
        this.$confirm('将永久删除该评论，并且删除所有子评论, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let delete_form = []
          if(delete_data.second_comment && delete_data.second_comment.length){
            delete_form =  this.deleteFormId(delete_data)
          }else{
            delete_form.push({_id: delete_data._id})
          }
          delete_form = JSON.stringify(delete_form)
          this.$Api.commentDelete({delete_form: delete_form, article_id: this.$route.params.id}).then(res => {
            this.$tools.diyTips(res.message, res.type)
            this.$emit('commentNumAdd', -res.delete_count)
            this.getData()
          })
        }).catch((err) => {console.log(err)});
      },
      async goSecondReply(_id, value_child_id, user_info){
        if(await this.ifLogin){
          if(value_child_id){
            this.showChildComment = value_child_id
          }else{
            this.showChildComment = _id
          }
          //评论id
          this.comment_form.parent_id = _id
          //被回复人id
          this.comment_form.to_user_id = user_info._id;
          //评论类型
          this.comment_form.comment_grade = '3'
          //关闭评论输入框
          this.showBtn = false;
          //清除评论内容
          this.comment_form.content = '';
          //对应位置插入回复框
          this.show_one_comment = -1;
        }else{
          this.$tools.diyTips('您还未登录，请登录后再试！！！', 'error',5000)
        }
      },
      goUserDetail(user_id){
        this.$router.push({
          path: '/user_details_info',
          query:{
            id: user_id
          }
        })
      },
      sortCheck(){
        this.form.sort_status = ~this.form.sort_status == 0 ? 1 : -1
        this.getData()
      },
    }, 

    computed:{
      // 时间转换
      getTime() {
        return function(value) {
         return this.$tools.timeToDate(value)
        }
      }
    },
  }
</script>

<style scoped lang="less">
  .sort-box{
    border-top: 1px solid #e5e9ef;
    width: 830px;
    height: 25px;
    padding: 10px 0px 10px 0px;
    display: flex;
    align-items: center;
    h3{
      font-size: 20px;
      margin: 0px;
    }
    h6{
      cursor: pointer;
      font-size: 14px;
      font-weight: 400;
      margin: 0px 0px 0px 30px;
      box-sizing: border-box;
    }
    h6:hover{
      color: #0099ff;
    }
    .label_color{
      color: #0099ff;
    }
  }
  .three_comment_box{
    border-top: 1px solid #e5e9ef;
    width: 727px;
    display: flex;
    .three_left_margin{
      position: relative;
      left: -49px;
      top: 0px;
    }
    .three_box-right{
      width: 680px;
      .options{
        width: 679px;       
      }
    }
  }
  .comment-box{
    width: 830px;
    display: flex;
    padding: 15px;
    flex-direction: column;
    font-size: 14px;

    .user-comment{
      padding-top: 20px;
      border-top: 1px solid #e5e9ef;
      display: flex;
      margin-bottom: 0px;
      img{
        cursor: pointer;
        width: 33px;
        margin-right: 15px;
        height: 33px;
        border-radius: 50%;
      }
      .box-right{
        width: 775px;
        text-align: left;
        p{
          margin:5px 0px;
          white-space: pre-wrap;
        }
        .options{
          text-align: right;
          color: #999AAA;
          margin-bottom: 15px;
          .delete-comment{
            cursor: pointer;
            color: #fc5531
          }   
          .reply{
            cursor: pointer;
          }
          .reply:hover{
            color: #0099ff;
          }
          span{
            margin-left: 100px;
            display: inline-block;
          }
        }
        .get-user{
          cursor: pointer;
        }
      }
    }
    .child-comment{
      padding-top: 0px;
      img{
        cursor: pointer;
      }
      .reply-right{
        .reply-box{
          .avatar-input{
            .el-textarea{
              width: 670px;
            }
          }
        }
      }
    }
  }
  .my-box{
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    .avatar-input{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      img{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 15px;
      }
      .el-textarea{
        width: 775px;
      }
    }
    .btn-box{
      margin-top: 8px;
      text-align: right;
      .el-button.is-round{
        padding: 8px 15px;
      }
      .el-button--primary:nth-child(1){
        color: #0099ff;
        border: 1px solid #0099ff;
        background-color: #fff;
        
        &:hover{
          border: 1px solid #015BF1;
          color: #015BF1;
        }
      }
    }
  }
</style>