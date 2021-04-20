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
          v-model="commentContent">
        </el-input>
      </div>
      <div class="btn-box" v-show="showBtn">
        <el-button type="primary" round @click="cancelComment">取 消 评 论</el-button>
        <el-button type="primary" round @click="sendComment">发 表 评 论</el-button>
      </div>
    </div>
    <!-- 评论列表 -->
      <div class="user-comment" v-for="(item,index) in commentData" :key="index">
        <img :src="item.user_id.avatar" @click="goUserDetail(item.user_id._id)">
        <div class="box-right">
          <div style="font-weight: 550;">{{item.user_id.nickname}}</div>  
          <p>{{item.content}}</p>
          <div class="options">
            <span @click="goReply(index,item.user_id)">回复</span>
            <span >{{getTime(item.created_time)}}</span>
          </div>
          <!-- 回复输入框 -->
          <div class="my-box" v-if="showReplyStatus === index">
            <div class="avatar-input">
              <img :src="$store.getters.getUserAvatar">
              <el-input
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 2}"
                :placeholder="`回复: ${item.user_id.nickname}`"
                maxlength="200"
                v-model="replyContent">
              </el-input>
            </div>
            <div class="btn-box">
              <el-button type="primary" round @click="cancelReply">取 消 回 复</el-button>
              <el-button type="primary" round @click="sendReply">发 表 评 论</el-button>
            </div>
          </div>

          <!-- 子评论 -->
          <div class="user-comment child-comment" v-for="(value,_index) in item.second_comment" :key="_index">
            <img :src="value.from_user_info.avatar" @click="goUserDetail(value.from_user_info._id)">
            <div class="box-right reply-right">
              <div style="font-weight: 550;">{{value.from_user_info.nickname}}</div>  
              <p v-if="value.reply_type == '2'">{{ value.content }}</p>
              <p v-if="value.reply_type == '3'">
                回复
                <span style="color: #0099ff" class="get-user" @click="goUserDetail(value.to_user_info._id)">@{{value.to_user_info.nickname}}</span>
                :
                {{value.content}}
              </p>
              <div class="options">
                <span @click="goSecondReply(value._id, value.from_user_info)">回复</span>
                <span >{{getTime(value.created_time)}}</span>
              </div>
              <!-- 回复输入框 -->
              <div class="my-box reply-box" v-if="showChildComment == value._id">
                <div class="avatar-input">
                  <img :src="$store.getters.getUserAvatar" alt="">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 1, maxRows: 2}"
                    :placeholder="`回复: ${value.from_user_info.nickname}`"
                    maxlength="200"
                    v-model="replyContent">
                  </el-input>
                </div>
                <div class="btn-box">
                  <el-button type="primary" round @click="cancelReply">取 消 回 复</el-button>
                  <el-button type="primary" round @click="sendReply">发 表 评 论</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!commentData.length">
        <span style="color: #999999;letter-spacing:5px;">此文章暂无评论!!!</span>
      </div>
  </div>
</template>

<script>
  export default {
    name : "getComment" ,
    props:{
    },

    data(){
      return {
        inputStatus: '', //评论或者回复
        showReplyStatus: -1, //确定回复输入框的插入位置
        showBtn: false, //显示评论输入框
        commentContent: '',//评论内容
        replyContent: '',//回复内容
        showChildComment: '',
        commentData: [],
        comment_form:{
          article_id: this.$route.params.id,
          content: '',
          user_id: this.$store.getters.getUserID
        },
        ifLogin: false,
        reply_form:{
          //回复类型, 2:回复——>评论， 3:回复——>回复
          reply_type: '0',
          //回复id,确定回复哪一条回复
          reply_id: '',
          //回复内容
          content: '',
          //回复人，"A回复B" ————> A
          from_user_id: this.$store.getters.getUserID,
          //被回复人，"A回复B" ————> B
          to_user_id: ''
        }
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
        this.$Api.commentGetApi({article_id: this.$route.params.id}).then(res => {
          if(res.message === 'OK'){
            this.commentData = res.result
          }else{
            this.$tools.diyTips('网络异常，请稍后再试','error')
          }
        })
      },
      //点击回复
      async goReply(index,user_info){
        if( await this.ifLogin){
          //评论id
          this.reply_form.reply_id = this.commentData[index]._id
          //被回复人id
          this.reply_form.to_user_id = user_info._id;
          //回复类型
          this.reply_form.reply_type = '2';
          //关闭评论输入框
          this.showBtn = false;
          //清除评论内容
          this.commentContent = '';
          //对应位置插入回复框
          this.showReplyStatus = index;
          this.replyContent = '';
          this.showChildComment = ''
        }else{
          this.$tools.diyTips('您还未登录，请登录后再试！！！', 'error',5000)
        }
      },
      //点击评论输入框
      async commentInputFocus(){
        if(await this.ifLogin){
          this.replyContent = '';
          this.showReplyStatus = -1;
          this.showBtn = true;
          this.showChildComment = ''
        }else{
          this.$tools.diyTips('您还未登录，请登录后再试！！！', 'error',5000)
        }
      },
      //取消评论
      cancelComment(){
        this.showBtn = false;
        this.commentContent = ''
      },
      //取消回复
      cancelReply(){
        this.replyContent = '';
        this.showReplyStatus = -1;
        this.showChildComment = ''
      },
      //添加评论
      sendComment(){
        this.comment_form.content = this.commentContent;
        this.$Api.commentAddApi(this.comment_form).then(res => {
          if(res.message === 'OK'){
            this.getData()
            this.commentContent = ''
            this.showBtn = false
            this.$tools.diyTips('评论成功',res.type)
          }else{
            this.$tools.diyTips('评论失败，请稍后再试','error')
          }
        })
      },
      sendReply(){
        this.reply_form.content = this.replyContent
        this.$Api.replyAddApi(this.reply_form).then(res => {
          if(res.message == "OK"){
            this.$tools.diyTips('回复成功','success')
            this.showChildComment = ''
            this.showReplyStatus = -1
            this.replyContent = ''
            this.getData()
          }else{
            this.$tools.diyTips(res.msg,'error')
          }
        })
      },
      async goSecondReply(_id,user_info){
        if(await this.ifLogin){
          // //回复id
          this.reply_form.reply_id = _id
          //被回复人id
          this.reply_form.to_user_id = user_info._id;
          //回复类型
          this.reply_form.reply_type = '3';
          //关闭评论输入框
          this.showBtn = false;
          //清除评论内容
          this.commentContent = '';
          //对应位置插入回复框
          this.showReplyStatus = -1;
          this.showChildComment = _id
          this.replyContent = ''
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
      }
    }, 

    computed:{
      // 时间转换
      getTime() {
        return function(value) {
         return this.$tools.timeToDate(value)
        }
      }
    },

    watch:{
    },
  }
</script>

<style scoped lang="less">
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
          margin-bottom: 15px;
          span:nth-child(1){
            cursor: pointer;
          }
          span:nth-child(1):hover{
            color: #0099ff;
          }
          span{
            margin-left: 0px;
            width:200px;
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
              width: 675px;
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