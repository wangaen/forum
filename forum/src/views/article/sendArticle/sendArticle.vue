<template>
  <div class="send-article-box">
    <div class="send-article">
      <div class="article-main">
        <div class="article-box btn-box">
          <el-input v-model="form.title" placeholder="请输入文章标题" maxlength="88"></el-input>
          <el-button type="primary" @click="sendArticleEvent">{{ isUpdate ? "修改文章" : "发表文章" }}</el-button>
        </div>
        <div class="article-box">
          <div class="con-l" id="editor"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import E from "wangeditor";
import { articleSendApi, articleUpdate, getOneArticleInfo, deleteImg, uploadArticleImgApi } from "@/api/api";
export default {
  name: "sendArticle",
  data() {
    return {
      form: {
        //标题
        title: "",
        //展示部分内容
        contentText: "",
        //详情全部内容
        contentHtml: "",
        //用户id
        userId: this.userId,
        //图片
        articleImgs: [],
      },
      beforeArticleImgs: [],
      editor: null,
      showBtn: true,
      isUpdate: this.$route.name == "UpdateArticle",
      isNext: true,
    };
  },

  //跳转路由前判断是否继续编辑文章
  beforeRouteLeave(to, from, next) {
    //路由跳转到哪里
    if (!this.isNext) return next();
    //点击退出登录
    if (this.$store.getters.getReadyLoginOut) {
      this.$store.commit("setReadyLoginOut", false);
      this.outDelArticleImgs();
      return next();
    }
    if (this.form.title || this.editor.txt.html()) {
      this.$confirm("你在当前页面已经编辑了文章信息，离开当前页面将会丢失该页面的任何信息。是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.outDelArticleImgs();
          next();
        })
        .catch(() => {
          return false;
        });
    } else {
      next();
    }
  },
  mounted() {
    this.initEditor();
    this.getUpdateForm();
  },
  computed: {
    userId() {
      return this.$store.getters.getUser._id;
    },
    token() {
      return this.$store.getters.getToken;
    },
  },
  methods: {
    //创建wangEditor富文本编辑器
    initEditor() {
      this.editor = new E("#editor");
      // 设置编辑区域高度
      this.editor.config.height = 640;
      //改变默认的z-index
      this.editor.config.zIndex = 500;
      this.editor.config.placeholder = "请输入文章内容";
      // 配置菜单栏，设置不需要的菜单
      this.editor.config.excludeMenus = ["video"];
      // 配置颜色（文字颜色、背景色）
      this.editor.config.colors = ["#ffffff", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#009933", "#3399ff", "#0000ff", "#000000", "#bf4080", "#00ffaa", "#ff3399"];
      // 配置行高
      this.editor.config.lineHeights = ["1", "1.2", "1.5", "2", "2.5", "3"];
      //来关闭样式过滤
      this.editor.config.pasteFilterStyle = false;
      this.editor.config.pasteIgnoreImg = false;
      //隐藏网络图片
      this.editor.config.showLinkImg = false;
      // 上传超时时间
      this.editor.config.uploadImgTimeout = 15 * 1000;
      // 当次最多上传图片个数
      this.editor.config.uploadImgMaxLength = 5;
      // 图片大小最大为2M
      this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024; // 2M

      // resultFiles 是 input 中选中的文件列表; insertImgFn 是获取图片 url 后，插入到编辑器的方法
      this.editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
        const formData = new FormData();
        resultFiles.forEach(async (item) => {
          formData.append("articleImg", item);
        });
        const res = await uploadArticleImgApi(formData);
        if (res.code === 200) {
          res.data.forEach((item) => {
            insertImgFn(item);
            this.form.articleImgs.push(item);
          });
        }
      };

      this.editor.create();
    },
    async getUpdateForm() {
      if (this.isUpdate) {
        const { id } = this.$route.params;
        const res = await getOneArticleInfo({ id });
        if (res.code === 200) {
          this.form.contentHtml = res.data.contentHtml;
          this.form.title = res.data.title;
          this.beforeArticleImgs = JSON.parse(JSON.stringify(res.data.articleImgs));
          this.form.articleImgs = res.data.articleImgs;
          this.form.id = id;
          this.editor.txt.html(this.form.contentHtml);
        }
      }
    },
    //点击发表文章
    async sendArticleEvent() {
      const html = this.editor.txt.html();
      this.form.articleImgs.forEach(async (item) => {
        if (!html.includes(item)) {
          this.form.articleImgs = this.form.articleImgs.filter((value) => value !== item);
          await deleteImg({ url: item });
        }
      });
      this.isNext = false;
      this.form.userId = this.userId;
      this.form.contentText = this.editor.txt.text().slice(0, 120);
      this.form.contentHtml = html;
      if (!this.form.title || !this.form.contentHtml) {
        return this.$utils.elMessageBox("请输入文章标题或内容", "warning");
      }
      if (this.isUpdate) {
        await articleUpdate(this.form);
        this.$utils.elMessageBox("修改文章成功", "success", 500);
        setTimeout(() => {
          this.$router.push(`/article/details/${this.form.id}`);
        }, 700);
      } else {
        await articleSendApi(this.form);
        this.$router.push("/");
      }
    },
    outDelArticleImgs() {
      if (!this.beforeArticleImgs.length) {
        this.form.articleImgs.forEach(async (item) => {
          await deleteImg({ url: item });
        });
      } else if (JSON.stringify(this.form.articleImgs) !== JSON.stringify(this.beforeArticleImgs)) {
        this.form.articleImgs.forEach(async (item) => {
          if (!this.beforeArticleImgs.some((value) => value === item)) {
            await deleteImg({ url: item });
          }
        });
      }
    },
  },
  beforeDestroy() {
    // 销毁编辑器
    this.editor.destroy();
    this.editor = null;
    this.form = null;
  },
};
</script>

<style scoped lang="less">
.send-article-box {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.send-article {
  border-radius: 10px;
  width: 1080px;
  margin-top: 20px;
  padding: 0 15px;
  box-shadow: 0 0px 30px 3px #aaa;
  // display: flex;
  // flex-direction: column;
  // align-items: center;

  .article-main {
    margin-bottom: 10px;
    // width: 1000px;
    // height: 560px;
  }
  // .column{
  //   display: flex;
  //   flex-direction: column;
  // }
  .article-box {
    text-align: left;
    margin-top: 10px;

    .el-input ::v-deep {
      position: static;

      .el-input__inner {
        border-radius: 10px;
      }
    }
    .el-textarea ::v-deep {
      margin-top: 10px;
      position: static;

      .el-textarea__inner {
        border-radius: 10px;
      }
    }
    // label{
    //   font-size: 20px;
    //   letter-spacing: 5px;
    //   font-weight: 520;
    //   width: 60px;
    // }
  }

  // .article-box:nth-child(2){
  //   width: 1200px;
  // .con-l{
  //   display: flex;
  //   width: 960px;
  // }

  //   .con-r{
  //     position: relative;
  //     right: 0;
  //     top: -97px;
  //     height: 190px;
  //     border-radius: 7px;
  //     box-shadow: 0 0px 30px 3px #AAA;
  //     margin-left: 30px;
  //     width: 190px;
  //   }
  // }

  // .con-r ::v-deep{
  //   .el-upload-dragger{
  //     width: 190px;
  //     height: 190px;
  //     border: 1px solid #d9d9d9;
  //     position: static;
  //   }
  //   .el-upload-dragger:hover{
  //     border: 1px solid #409EFF;
  //   }
  // }

  .btn-box {
    display: flex;
    align-items: center;
    .el-button {
      margin-left: 10px;
      border-radius: 10px;
      padding: 12px 8px;
      letter-spacing: 5px;
    }
  }

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
/deep/ .w-e-toolbar {
  border-top-left-radius: 10px !important;
  border-top-right-radius: 10px !important;
}
/deep/ .w-e-text-container {
  border-bottom-left-radius: 10px !important;
  border-bottom-right-radius: 10px !important;
}
</style>