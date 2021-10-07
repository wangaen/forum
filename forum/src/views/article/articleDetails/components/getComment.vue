<template>
  <div class="comment-box">
    <!-- 评论输入款 -->
    <div class="my-box">
      <div class="avatar-input">
        <img :src="avatarUrl" alt="" />
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2 }" placeholder="请输入评论内容" @focus="commentInputFocus" maxlength="200" v-model="commentArticle">
        </el-input>
      </div>
      <div class="btn-box" v-show="showBtn">
        <el-button type="primary" round @click="cancelComment">取 消 评 论</el-button>
        <el-button type="primary" round @click="sendComment">发 表 评 论</el-button>
      </div>
    </div>
    <div class="sort-box" v-if="allCommentData.length">
      <h3>排序</h3>
      <h6 @click="sortCheck">
        按时间
        <li class="el-icon-sort"></li>
      </h6>
    </div>
    <!-- 评论列表 -->
    <div class="user-comment" v-for="(item, index) in allCommentData" :key="index">
      <!-- 一级评论列表（评论文章）展示 -->
      <img :src="item.fromUserId.avatar" @click="goUserDetail(item.fromUserId._id)" />
      <div class="box-right">
        <div style="font-weight: 550">{{ item.fromUserId.nickname }}</div>
        <p>{{ item.content }}</p>
        <div class="options">
          <span class="delete-comment" v-if="isMe == item.fromUserId._id" @click="deleteComment(item)">删除</span>
          <span class="reply" @click="goReplyOneComment(index, item.fromUserId)">回复</span>
          <span>{{ getTime(item.createdTime) }}</span>
        </div>
        <!-- 回复输入框 一级评论-->
        <div class="my-box" v-if="showOneComment === index">
          <div class="avatar-input">
            <img :src="avatarUrl" />
            <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 2 }" :placeholder="`回复: ${item.fromUserId.nickname}`" maxlength="200" v-model="commentForm.content">
            </el-input>
          </div>
          <div class="btn-box">
            <el-button type="primary" round @click="cancelReplyOneComment">取 消 回 复</el-button>
            <el-button type="primary" round @click="sendReply">发 表 评 论</el-button>
          </div>
        </div>

        <!-- 二级评论（回复别人的评论） -->
        <div class="user-comment child-comment" v-for="(value, _index) in item.secondComment" :key="_index">
          <img :src="value.fromUserInfo.avatar" @click="goUserDetail(value.fromUserInfo._id)" />
          <div class="box-right reply-right">
            <div style="font-weight: 550">{{ value.fromUserInfo.nickname }}</div>
            <p>{{ value.content }}</p>
            <div class="options">
              <span class="delete-comment" v-if="isMe == value.fromUserInfo._id" @click="deleteComment(value)">删除 </span>
              <span class="reply" @click="goSecondReply(value._id, '', value.fromUserInfo)">回复</span>
              <span>{{ getTime(value.createdTime) }}</span>
            </div>
            <!-- 回复输入框 回复别人的回复-->
            <div class="my-box reply-box" v-if="showChildComment == value._id">
              <div class="avatar-input">
                <img :src="avatarUrl" alt="" />
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 2 }"
                  :placeholder="`回复: ${value.fromUserInfo.nickname}`"
                  maxlength="200"
                  v-model="commentForm.content"
                >
                </el-input>
              </div>
              <div class="btn-box">
                <el-button type="primary" round @click="cancelReplyOneComment">取 消 回 复</el-button>
                <el-button type="primary" round @click="sendReply">发 表 评 论</el-button>
              </div>
            </div>
            <!-- 三级评论 -->
            <div class="three_comment_box" v-for="(valueChild, indexChild) in value.secondComment" :key="indexChild">
              <img :src="valueChild.fromUserInfo.avatar" @click="goUserDetail(valueChild.fromUserInfo._id)" />
              <div class="box-right reply-right three_box-right">
                <div style="font-weight: 550">{{ valueChild.fromUserInfo.nickname }}</div>
                <p>
                  回复
                  <span style="color: #0099ff" class="get-user" @click="goUserDetail(valueChild.toUserInfo._id)"> @{{ valueChild.toUserInfo.nickname }} </span>
                  :
                  {{ valueChild.content }}
                </p>
                <div class="options">
                  <span class="delete-comment" v-if="isMe == valueChild.fromUserInfo._id" @click="deleteComment(valueChild)">删除 </span>
                  <span class="reply" @click="goSecondReply(value._id, valueChild._id, valueChild.fromUserInfo)">回复</span>
                  <span>{{ getTime(valueChild.createdTime) }}</span>
                </div>
                <!-- 回复输入框 回复别人的回复-->
                <div class="my-box reply-box three_left_margin" v-if="showChildComment == valueChild._id">
                  <div class="avatar-input">
                    <img :src="avatarUrl" alt="" />
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 1, maxRows: 2 }"
                      :placeholder="`回复: ${valueChild.fromUserInfo.nickname}`"
                      maxlength="200"
                      v-model="commentForm.content"
                    >
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
    <div v-if="!allCommentData.length" style="color: #999aaa; margin-bottom: 10px; font-size: 16px; text-align: center">此文章还未被吐槽，快来吐槽一下吧</div>
    <div class="page-box">
      <el-pagination :current-page.sync="nowPage" background layout="prev, pager, next" :total="total" @current-change="currentChange"></el-pagination>
    </div>
  </div>
</template>

<script>
import { commentGetApi, commentAddApi, commentDelete } from "@/api/api";
export default {
  name: "getComment",
  data() {
    return {
      showOneComment: -1, //确定回复输入框的插入位置
      showBtn: false, //显示评论输入框
      showChildComment: "",
      commentArticle: "",
      total: 10,
      nowPage: 1,
      isMe: this.$utils.getUserId(),
      allCommentData: [],
      commentForm: {
        articleId: this.$route.params.id,
        content: "",
        parentId: "",
        commentGrade: "",
        fromUserId: this.$utils.getUserId(),
        toUserId: "",
      },
      form: {
        articleId: this.$route.params.id,
        sortStatus: -1,
        pageNum: 1,
      },
      ifLogin: true,
    };
  },

  async created() {
    await this.getData();
  },

  mounted() {},
  methods: {
    //获取所有评论
    async getData() {
      const res = await commentGetApi(this.form);
      if (res.code === 200) {
        this.allCommentData = res.data.data;
        this.total = res.data.total;
      }
    },
    //点击某一页时，currentpage为页码
    currentChange(currentpage) {
      this.form.pageNum = currentpage;
      this.getData();
    },
    //点击回复————回复一级评论
    goReplyOneComment(index, userInfo) {
      if (this.getToken) {
        //清除评论文章的内容
        this.commentArticle = "";
        //清除评论内容
        this.commentForm.content = "";
        //评论id
        this.commentForm.parentId = this.allCommentData[index]._id;
        //被回复人id
        this.commentForm.toUserId = userInfo._id;
        //评论类型
        this.commentForm.commentGrade = "2";
        //关闭评论输入框
        this.showBtn = false;
        //对应位置插入回复框
        this.showOneComment = index;
        this.showChildComment = "";
      } else {
        this.$utils.elMessageBox("您还未登录，请登录后再试！！！", "error", 5000);
      }
    },
    //点击评论文章输入框
    commentInputFocus() {
      if (this.getToken) {
        this.commentForm.content = "";
        this.showOneComment = -1;
        this.showBtn = true;
        this.showChildComment = "";
      } else {
        this.$utils.elMessageBox("您还未登录，请登录后再试！！！", "error", 5000);
      }
    },
    //取消评论
    cancelComment() {
      this.showBtn = false;
      this.commentArticle = "";
    },
    //取消回复
    cancelReplyOneComment() {
      this.commentForm.content = "";
      this.showOneComment = -1;
      this.showChildComment = "";
    },
    //添加评论
    async sendComment() {
      if (this.getToken) {
        this.commentForm.content = this.commentArticle;
        this.commentForm.toUserId = this.$utils.getUserId();
        this.commentForm.commentGrade = "1";
        const res = await commentAddApi(this.commentForm);
        if (res.code === 200) {
          this.getData();
          this.commentForm.content = "";
          this.commentArticle = "";
          this.showBtn = false;
          this.$utils.elMessageBox("评论成功", "success");
          this.$emit("commentNumAdd");
        }
      } else {
        this.$utils.elMessageBox("请登录后再发表评论", "error");
      }
    },
    async sendReply() {
      if (this.getToken) {
        const res = await commentAddApi(this.commentForm);
        if (res.code == 200) {
          this.$utils.elMessageBox("回复成功", "success");
          this.$emit("commentNumAdd");
          this.showChildComment = "";
          this.showOneComment = -1;
          this.commentForm.content = "";
          this.getData();
        }
      } else {
        this.$utils.elMessageBox("请登录后再进行回复操作", "error");
      }
    },

    deleteFormId(deleteData) {
      let deleteForm = [];
      deleteForm.push({ _id: deleteData._id });
      if (deleteData.secondComment.length) {
        deleteData.secondComment.forEach((value) => {
          deleteForm.push({ _id: value._id });
          if (value.secondComment && value.secondComment.length) {
            value.secondComment.forEach((data) => {
              deleteForm.push({ _id: data._id });
            });
          }
        });
      }
      return deleteForm;
    },
    //删除评论
    deleteComment(deleteData) {
      this.$confirm("将永久删除该评论，并且删除所有子评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let deleteForm = [];
          if (deleteData.secondComment && deleteData.secondComment.length) {
            deleteForm = this.deleteFormId(deleteData);
          } else {
            deleteForm.push({ _id: deleteData._id });
          }
          deleteForm = JSON.stringify(deleteForm);
          await commentDelete({ deleteForm, articleId: this.$route.params.id });
          this.$utils.elMessageBox("删除成功", "success");
          this.$emit("commentNumAdd");
          this.getData();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    goSecondReply(_id, valueChildId, userInfo) {
      if (this.getToken) {
        if (valueChildId) {
          this.showChildComment = valueChildId;
        } else {
          this.showChildComment = _id;
        }
        //评论id
        this.commentForm.parentId = _id;
        //被回复人id
        this.commentForm.toUserId = userInfo._id;
        //评论类型
        this.commentForm.commentGrade = "3";
        //关闭评论输入框
        this.showBtn = false;
        //清除评论内容
        this.commentForm.content = "";
        //对应位置插入回复框
        this.showOneComment = -1;
      } else {
        this.$utils.elMessageBox("您还未登录，请登录后再试！！！", "error", 5000);
      }
    },
    goUserDetail(userId) {
      this.$router.push({ path: `/article/release_manage/${userId}` });
    },
    sortCheck() {
      this.form.sortStatus = ~this.form.sortStatus == 0 ? 1 : -1;
      this.getData();
    },
  },

  computed: {
    getToken() {
      return !!this.$store.getters.getToken;
    },
    avatarUrl() {
      return this.$store.getters.getUser.avatar;
    },
    // 时间转换
    getTime() {
      return function (value) {
        return this.$utils.timeToDate(value);
      };
    },
  },
};
</script>

<style scoped lang="less">
.sort-box {
  border-top: 1px solid #e5e9ef;
  width: 830px;
  height: 25px;
  padding: 10px 0px 10px 0px;
  display: flex;
  align-items: center;
  h3 {
    font-size: 20px;
    margin: 0px;
  }
  h6 {
    cursor: pointer;
    font-size: 14px;
    font-weight: 400;
    margin: 0px 0px 0px 30px;
    box-sizing: border-box;
  }
  h6:hover {
    color: #0099ff;
  }
  .label_color {
    color: #0099ff;
  }
}
.page-box {
  text-align: center;
}
.three_comment_box {
  border-top: 1px solid #e5e9ef;
  width: 727px;
  display: flex;
  .three_left_margin {
    position: relative;
    left: -49px;
    top: 0px;
  }
  .three_box-right {
    width: 680px;
    .options {
      width: 679px;
    }
  }
}
.comment-box {
  width: 830px;
  display: flex;
  padding: 15px;
  flex-direction: column;
  font-size: 14px;

  .user-comment {
    padding-top: 20px;
    border-top: 1px solid #e5e9ef;
    display: flex;
    margin-bottom: 0px;
    img {
      cursor: pointer;
      width: 33px;
      margin-right: 15px;
      height: 33px;
      border-radius: 50%;
    }
    .box-right {
      width: 775px;
      text-align: left;
      p {
        margin: 5px 0px;
        white-space: pre-wrap;
      }
      .options {
        text-align: right;
        color: #999aaa;
        margin-bottom: 15px;
        .delete-comment {
          cursor: pointer;
          color: #fc5531;
        }
        .reply {
          cursor: pointer;
        }
        .reply:hover {
          color: #0099ff;
        }
        span {
          margin-left: 100px;
          display: inline-block;
        }
      }
      .get-user {
        cursor: pointer;
      }
    }
  }
  .child-comment {
    padding-top: 0px;
    img {
      cursor: pointer;
    }
    .reply-right {
      .reply-box {
        .avatar-input {
          .el-textarea {
            width: 670px;
          }
        }
      }
    }
  }
}
.my-box {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  .avatar-input {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 15px;
    }
    .el-textarea {
      width: 775px;
    }
  }
  .btn-box {
    margin-top: 8px;
    text-align: right;
    .el-button.is-round {
      padding: 8px 15px;
    }
    .el-button--primary:nth-child(1) {
      color: #0099ff;
      border: 1px solid #0099ff;
      background-color: #fff;

      &:hover {
        border: 1px solid #015bf1;
        color: #015bf1;
      }
    }
  }
}
</style>