<template>
  <div class="index">
    <div class="index-main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column width="800px">
          <template slot-scope="scope">
            <div class="tb-t-top" @click="goToArticleDetails(scope.row._id)">
              <span v-html="scope.row.title"></span>
            </div>
            <div class="tb-t-center">
              <p v-html="scope.row.contentText"></p>
            </div>
            <div class="tb-t-bottom">
              <div>
                <img :src="scope.row.userId.avatar" @click="goToUserDetails(scope.row.userId._id)" />
                <span class="nickname" @click="goToUserDetails(scope.row.userId._id)">{{ scope.row.userId.nickname }}</span>
                <span>{{ getTime(scope.row.createdTime) }}</span>
              </div>
              <div class="icon-box">
                <span><i class="el-icon-view"></i>{{ scope.row.readNum }}</span>
                <span><i class="el-icon-chat-dot-round"></i>{{ scope.row.commentNum }}</span>
                <span><i class="el-icon-thumb"></i>{{ scope.row.likeNum }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="250px">
          <template slot-scope="scope">
            <div class="demo-image__preview">
              <el-image style="width: 250px; height: 150px" :src="scope.row.articleImgs[0]" :preview-src-list="scope.row.articleImgs" lazy>
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box" v-if="tableData.length">
        <el-pagination :current-page.sync="nowPageNum" background layout="prev, pager, next" :total="Math.ceil(total / 2)" @current-change="currentChange"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticleData, addReadNumApi } from "@/api/api";
export default {
  name: "articleMain",
  data() {
    return {
      tableData: [],
      total: 10,
      nowPageNum: 1,
    };
  },
  created() {
    this.getData();
  },
  computed: {
    searchForm() {
      return this.$store.getters.getSearchForm;
    },
    // 时间转换
    getTime() {
      return function (value) {
        return this.$utils.getDate(value);
      };
    },
  },
  methods: {
    async getData() {
      let res = await getArticleData(this.searchForm);
      if (res && res.code === 200) {
        this.tableData = res.data.articleData;
        this.highLight(this.tableData);
        this.total = res.data.total;
      }
      //点击下一页时跳转到顶部
      document.documentElement.scrollTop = 0;
    },
    //搜索关键词高亮
    highLight(tableData) {
      const search = this.searchForm.search;
      if (search && tableData.length) {
        tableData.forEach((item) => {
          item.title = item.title.replace(search, `<em style="color: #fc5531; font-style: normal;"> ${search} </em>`);
          item.contentText = item.contentText.replace(search, `<em style="color: #fc5531; font-style: normal;">${search}</em>`);
        });
      }
    },
    //点击某一页时，currentpage为页码
    currentChange(currentpage) {
      this.$store.commit("setPageNum", currentpage);
      this.getData();
    },
    //前往文章详情页
    async goToArticleDetails(id) {
      this.$router.push(`/article/details/${id}`);
      await addReadNumApi({ id });
    },
    goToUserDetails(userId) {
      this.$router.push({ path: `/article/release_manage/${userId}` });
    },
  },
  watch: {
    searchForm: {
      async handler() {
        await this.getData();
      },
      deep: true,
    },
  },
};
</script>

<style scoped lang="less">
.index {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;

  .index-main {
    border-radius: 10px;
    box-shadow: 0 0px 30px 3px #aaa;
    padding: 20px 20px 0px 20px;
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
      margin-bottom: 20px;
      word-break: break-all;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-size: 14px;
      height: 55px;
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
    }
  }
  .el-table ::v-deep {
    .el-table__header-wrapper {
      display: none;
    }
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
  .page-box {
    text-align: center;
    margin: 20px 0px 40px 0px;
  }
}
</style>