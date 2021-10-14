<template>
  <div class="article-details">
    <div class="article-left">
      <div class="article-box">
        <!-- 标题-->
        <div class="title">
          <p>{{ articleData.title }}</p>
        </div>
        <!-- 头像用户名简介 -->
        <div class="avatar">
          <span>
            <i class="el-icon-edit-outline">{{ timeToDate(articleData.createdTime) }} </i>
          </span>
          <span>
            <i class="el-icon-view">{{ articleData.readNum }} </i>
          </span>
          <span @click="goLike" :class="{ like_color: likeForm.status }">
            <i class="el-icon-thumb">{{ articleData.likeNum }}</i>
          </span>
          <span>
            <a href="#comment">
              <i class="el-icon-chat-dot-round">{{ commentNum }}</i>
            </a>
          </span>
        </div>
        <!-- 图片 -->
        <div class="articleimg" v-if="articleData.articleImg">
          <img :src="articleData.articleImg" alt="" />
        </div>
        <!-- 内容-->
        <div class="content">
          <p v-html="articleData.contentHtml"></p>
        </div>
      </div>
      <div class="comment-main" id="comment">
        <getComment @commentNumAdd="commentNumAdd" />
      </div>
    </div>
    <div class="article-right">
      <div class="user-box">
        <img :src="userInfo.avatar" alt="" />
        <p>{{ userInfo.nickname }}</p>
        <p style="font-size: 14px; color: #999999; line-height: 24px">
          {{ userInfo.experience ? userInfo.experience : "此人很懒，连自己的简介都不写!!!" }}
        </p>
        <div class="box-bottom">
          <div v-for="(item, index) in totalRaticleReadLike" :key="index">
            <p>{{ item.name }}</p>
            <p>{{ item.value }}</p>
          </div>
        </div>
        <div class="user-btn">
          <el-button type="danger" @click="goUserDetailsInfo">查 看 其 它 文 章 信 息</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getComment from "./components/getComment";
import { isLikeArticle, getOneArticleInfo, addLikeNum, totalRaticleReadLikeApi } from "@/api/api";
export default {
  name: "articleDetails",
  components: { getComment },
  data() {
    return {
      articleData: {},
      timer: null,
      commentNum: 0,
      userInfo: {},
      totalRaticleReadLike: [],
      likeForm: {
        status: false,
        form: {
          articleId: this.$route.params.id,
          userId: this.$utils.getUserId(),
        },
      },
    };
  },
  async created() {
    //判断是否点赞
    if (this.$store.getters.getToken) {
      const res = await isLikeArticle(this.likeForm);
      this.likeForm.status = res.data;
    } else {
      this.likeForm.status = false;
    }
    await this.getData();
    await this.totalRaticleReadLikeApi();
  },
  mounted() {
    document.documentElement.scrollTop = 0;
  },
  methods: {
    async getData() {
      const res = await getOneArticleInfo({ id: this.$route.params.id });
      if (res) {
        this.articleData = res.data;
        this.commentNum = res.data.commentNum;
        this.userInfo = res.data.userId;
      }
    },
    async totalRaticleReadLikeApi() {
      const res = await totalRaticleReadLikeApi({ userId: this.userInfo._id });
      if (res) {
        this.totalRaticleReadLike = res.data;
      }
    },
    //点赞
    async goLike() {
      if (this.$store.getters.getToken) {
        //防抖处理
        if (this.timer) clearTimeout(this.timer);
        if (!this.timer) {
          const res = await addLikeNum(this.likeForm);
          if (res.code === 200) {
            this.likeForm.status = !this.likeForm.status;
            if (res.msg == "点赞成功") {
              this.articleData.likeNum = this.articleData.likeNum + 1;
              this.totalRaticleReadLikeApi();
            } else {
              this.articleData.likeNum = this.articleData.likeNum - 1;
              this.totalRaticleReadLikeApi();
            }
          }
        }
        this.timer = setTimeout(() => {
          this.timer = null;
        }, 300);
      } else {
        this.$utils.elMessageBox("您还未登录，请登录后操作", "error", 3000);
      }
    },
    commentNumAdd() {
      this.getData();
      this.totalRaticleReadLikeApi();
    },
    goUserDetailsInfo() {
      this.$router.push({ path: `/article/release_manage/${this.userInfo._id}` });
    },
  },
  computed: {
    timeToDate() {
      return function (time) {
        return this.$utils.timeToDate(time);
      };
    },
  },
};
</script>

<style scoped lang="less">
.article-details {
  width: 100%;
  height: 100%;
  padding: 20px 20px 0px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;

  //左边大框
  .article-left {
    width: 860px;
    height: 100%;
    margin-right: 20px;
    .article-box {
      border-radius: 10px;
      padding: 25px 35px;
      margin-bottom: 30px;
      box-sizing: border-box;
      box-shadow: 0 0px 30px 3px #aaa;
      .title {
        color: #333;
        font-size: 30px;
        font-weight: 550;
        text-align: left;
        p {
          margin-top: 10px;
          margin-bottom: 40px;
        }
      }
      .avatar {
        background: #f8f8f8;
        height: 40px;
        border-radius: 5px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        align-items: center;
        padding: 5px;
        box-sizing: border-box;
        .el-icon-thumb {
          cursor: pointer;
          &::before {
            color: #737674;
          }
        }
        .like_color {
          color: #0099ff;
          i {
            &::before {
              font-weight: 1000;
              color: #0099ff;
            }
          }
        }
        .el-icon-thumb:hover {
          color: #0099ff;
          &::before {
            color: #0099ff;
            font-weight: 1000;
          }
        }
        span {
          i {
            font-size: 20px;
            &::before {
              color: #737576;
              margin-right: 5px;
            }
          }
        }
        a {
          color: #000000;
          font-size: 20px;
        }
        .el-icon-chat-dot-round {
          &::before {
            color: #737576;
          }
        }
        .el-icon-chat-dot-round:hover {
          color: #0099ff;
          &::before {
            color: #0099ff;
            font-weight: 1000;
          }
        }
      }
      .articleimg {
        margin-bottom: 20px;
        img {
          border-radius: 5px;
          width: 760px;
          height: 396px;
        }
      }
      .content {
        text-align: left;
        p {
          white-space: pre-wrap;
        }
      }
    }
    .comment-main {
      border-radius: 10px;
      box-shadow: 0 0px 30px 3px #aaa;
    }
  }

  //右边大框
  .article-right {
    width: 300px;
    height: 100%;
    // border: 1px solid blue;

    .user-box {
      box-sizing: border-box;
      min-height: 345px;
      max-height: 555px;
      text-align: center;
      border-radius: 10px;
      box-shadow: 0 0px 30px 3px #aaa;
      padding: 20px 30px;
      background: #fff;
      img {
        width: 82px;
        height: 82px;
        border-radius: 50%;
      }
      p:nth-child(2) {
        font-size: 16px;
        color: #333;
        font-weight: 700;
        display: block;
      }
      .box-bottom {
        display: flex;
        justify-content: space-between;
        div {
          font-size: 16px;
          font-weight: 700;
          display: block;

          p:nth-child(2) {
            color: red;
          }
        }
      }
      .user-btn {
        .el-button--danger {
          color: #fff;
          border: 1px solid #0099ff;
          background-color: #0099ff;

          &:hover {
            border: 1px solid #015bf1;
            background-color: #015bf1;
          }
        }
      }
    }
  }
}
/* table 样式 */
table {
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
}
table td,
table th {
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  padding: 3px 5px;
}
table th {
  border-bottom: 2px solid #ccc;
  text-align: center;
}

/* blockquote 样式 */
blockquote {
  display: block;
  border-left: 8px solid #d0e5f2;
  padding: 5px 10px;
  margin: 10px 0;
  line-height: 1.4;
  font-size: 100%;
  background-color: #f1f1f1;
}

/* code 样式 */
code {
  display: inline-block;
  *display: inline;
  *zoom: 1;
  background-color: #f1f1f1;
  border-radius: 3px;
  padding: 3px 5px;
  margin: 0 3px;
}
pre code {
  display: block;
}

/* ul ol 样式 */
ul,
ol {
  margin: 10px 0 10px 20px;
}
</style>