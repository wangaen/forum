<template>
  <div class="user-details-info">
    <div class="person-box">
      <div class="data_info">
        <ul>
          <li v-for="item in articleTotalData" :key="item.id">
            <div>{{ item.value }}</div>
            <div>{{ item.name }}</div>
          </li>
        </ul>
      </div>
      <div class="articles_box">
        <div class="articls_operate">
          <h3>排序</h3>
          <h6 v-for="(item, index) in sortLabel" :key="index" :class="{ label_color: index == ifShowLabelColor }" @click="sortCheck(index)">
            {{ item }}
            <li class="el-icon-sort"></li>
          </h6>
        </div>
        <div class="article-main">
          <template>
            <el-table :data="allArticle" style="width: 100%" :show-header="false">
              <el-table-column width="740px">
                <template slot-scope="scope">
                  <div class="tb-t-top" @click="goArticle(scope.row._id)">
                    <span>{{ scope.row.title }}</span>
                  </div>
                  <div class="tb-t-center">
                    <p>{{ scope.row.contentText }}</p>
                  </div>
                  <div class="tb-t-bottom">
                    <div class="icon-box">
                      <span><i class="el-icon-view"></i>{{ scope.row.readNum }}</span>
                      <span><i class="el-icon-chat-dot-round"></i>{{ scope.row.commentNum }}</span>
                      <span><i class="el-icon-thumb"></i>{{ scope.row.likeNum }}</span>
                    </div>
                    <div>
                      <span>{{ timeToDate(scope.row.createdTime) }}</span>
                    </div>
                    <div v-if="isMe" class="isMe">
                      <span @click="goSendArticle(scope.row._id)"><i class="el-icon-edit"></i> 修改</span>
                      <span @click="deleteArticle(scope.row._id)"><i class="el-icon-delete"></i> 删除</span>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="200px">
                <template slot-scope="scope">
                  <div class="demo-image__preview">
                    <el-image style="width: 190px; height: 120px" :src="scope.row.articleImg" :preview-src-list="[scope.row.articleImg]" lazy>
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                    </el-image>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <div class="page-box">
            <el-pagination :current-page.sync="nowPage" background layout="prev, pager, next" :total="totalpage" @current-change="currentChange"> </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserAllArticles, totalRaticleReadLikeApi, addReadNumApi, articleDelete } from "@/api/api";
import { getUserId } from "@/utils/index";
export default {
  name: "releaseManage",
  data() {
    return {
      ifShowLabelColor: 0,
      nowPage: 1,
      sortLabel: ["按最新发布时间", "按访问量", "按点赞量", "按评论量"],
      articleTotalData: [],
      totalpage: 2,
      isMe: this.$route.params.id === getUserId(),
      allArticle: [],
      form: {
        userId: this.$route.params.id,
        pageNum: 1,
        sortStatus: 1,
      },
      timer: null,
    };
  },
  mounted() {
    document.documentElement.scrollTop = 0;
  },
  created() {
    this.totalRaticleReadLikeApi();
    this.getUserAllArticles();
  },
  methods: {
    async getUserAllArticles() {
      const res = await getUserAllArticles(this.form);
      this.allArticle = res.data;
    },
    async totalRaticleReadLikeApi() {
      const res = await totalRaticleReadLikeApi({ userId: this.$route.params.id });
      this.articleTotalData = res.data;
      this.totalpage = res.data[0].value;
    },
    sortCheck(index) {
      this.ifShowLabelColor = index;
      if (index + 1 === Math.abs(this.form.sortStatus)) {
        this.form.sortStatus = -this.form.sortStatus;
      } else {
        this.form.sortStatus = index + 1;
      }
      //防抖处理
      if (this.timer) clearTimeout(this.timer);
      if (!this.timer) {
        this.getUserAllArticles();
      }
      this.timer = setTimeout(() => {
        this.timer = null;
      }, 300);
    },
    async goArticle(id) {
      this.$router.push(`/article/details/${id}`);
      await addReadNumApi({ id });
    },
    //点击某一页时，currentpage为页码
    currentChange(currentpage) {
      this.form.pageNum = currentpage;
      this.getUserAllArticles();
    },
    //修改文章
    goSendArticle(id) {
      this.$router.push({ path: `/article/update/${id}` });
    },
    //删除文章
    deleteArticle(id) {
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await articleDelete({ id });
          if (res.code === 200) {
            this.$tools.diyTips("删除成功", "success");
            this.totalRaticleReadLikeApi();
            this.getUserAllArticles();
          }
        })
        .catch(() => {});
    },
  },
  computed: {
    // 时间转换
    timeToDate() {
      return function (time) {
        return this.$tools.timeToDate(time);
      };
    },
    userInfo() {
      return this.$store.getters.getUser;
    },
  },
};
</script>

<style scoped lang="less">
.user-details-info {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
.person-box {
  width: 1000px;
}
.data_info {
  margin: 20px 0px;
  padding: 20px 100px;
  border-radius: 50px;
  box-shadow: 0px 0px 30px 3px #aaa;
  ul {
    display: flex;
    padding-left: 0px;
    margin: 0px 0px;
    justify-content: space-between;
    align-items: center;
    list-style-type: none;
    list-style: none;
    li {
      text-align: center;
      list-style-type: none;
      list-style: none;
      div:nth-child(1) {
        color: #222226;
        font-weight: 1000;
        font-family: DINCond-Black;
        font-size: 24px;
        line-height: 24px;
        margin-bottom: 16px;
      }
      div:nth-child(2) {
        color: #999aaa;
        font-family: DINCond-Black;
        font-size: 16px;
        line-height: 16px;
      }
    }
  }
}
.articles_box {
  border-radius: 50px;
  padding: 20px 30px;
  box-sizing: border-box;
  box-shadow: 0 0px 30px 3px #aaa;
  text-align: left;
  .articls_operate {
    display: flex;
    width: 500px;
    align-items: center;
    justify-content: space-between;
    h3 {
      margin-top: 0px;
    }
    h6 {
      cursor: pointer;
      font-size: 14px;
      font-weight: 400;
      margin: 0px 0px 15px 0px;
      box-sizing: border-box;
    }
    h6:hover {
      color: #0099ff;
    }
    li {
      font-weight: 1000;
    }
    .label_color {
      color: #0099ff;
    }
  }
  .article-main {
    border-top: 1px solid #d4d5da;
    .tb-t-top {
      font-size: 20px;
      font-weight: 520;
      height: 32px;
      line-height: 32px;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &:hover {
        cursor: pointer;
        color: #0099ff;
      }
    }
    .tb-t-center {
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

      p {
        margin: 7px 0px;
      }
    }
    .tb-t-bottom {
      display: flex;
      justify-content: space-between;
      height: 40px;

      div {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        img {
          width: 32px;
          height: 32px;
          cursor: pointer;
          border-radius: 50%;
        }
        span {
          color: #999;
          font-size: 12px;
        }
        span:nth-child(2) {
          margin: 0px 20px;
        }
        .nickname {
          cursor: pointer;
        }
        .nickname:hover {
          color: #0099ff;
        }
      }
      .icon-box {
        .el-icon-view {
          margin-right: 2px;
          font-size: 14px;
        }
        .el-icon-chat-dot-round {
          margin-right: 2px;
          font-size: 14px;
        }
        .el-icon-thumb {
          margin-right: 2px;
          font-size: 14px;
        }
      }
      .isMe {
        span {
          cursor: pointer;
        }
        span:nth-child(1) {
          color: #0099ff;
        }
        span:nth-child(2) {
          color: #fc5531;
        }
      }
    }
    .el-table ::v-deep {
      .el-table__header-wrapper {
        display: none;
      }
    }
    .page-box {
      display: flex;
      justify-content: center;
      margin: 20px 0px 0px 0px;
    }
  }
}
.el-table ::v-deep {
  .image-slot {
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #909399;
  }
}
</style>