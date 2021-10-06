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
          <!-- <div class="con-r">
          <el-upload
            v-if="uploadOrImg"
            class="upload-demo"
            :http-request="handleUpload"
            action
            :limit="1"
            :show-file-list="false"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text"><em>上传封面图片</em></div>
          </el-upload>

          <div v-else class="img-box">
            <img :src="imgUrl" alt="" style="width:190px;height:190px;border-radius:6px;">
            <div class="select-btn" v-if="showBtn">
              <el-button type="info" plain @click="cancelUploadImg">取消</el-button>
              <el-button type="danger" plain @click="confirmUpload">确认</el-button>
            </div>
          </div>
        </div> -->
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
  props: {},

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
        userId: this.$store.getters.getUser._id,
        //封面图片
        articleImg: "",
      },
      filedata: "",
      editor: "",
      uploadOrImg: true,
      showBtn: true,
      imgUrl: "",
      isUpdate: this.$route.name == "UpdateArticle",
    };
  },

  components: {},

  //跳转路由前判断是否继续编辑文章
  beforeRouteLeave(to, from, next) {
    //路由跳转到哪里
    console.log("tototo", to);
    if (to.fullPath == `/?id=${this.$store.getters.getUserID}` || to.fullPath == `/article/details/${this.form.id}`) {
      next();
    } else {
      if (this.form.title || this.form.contentHtml || this.form.articleImg) {
        this.$confirm("你在当前页面已经编辑了文章信息，离开当前页面将会丢失该页面的任何信息。是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            if (this.form.articleImg && !this.isUpdate) {
              await deleteImg({ url: this.form.articleImg });
            }
            next();
          })
          .catch(() => {
            next(false);
          });
      } else {
        next();
      }
    }
  },
  mounted() {
    this.initEditor();
    this.getUpdateForm();
  },

  methods: {
    //创建wangEditor富文本编辑器
    initEditor() {
      this.editor = new E("#editor");
      // 设置编辑区域高度
      this.editor.config.height = 505;
      //改变默认的z-index
      this.editor.config.zIndex = 500;
      this.editor.config.placeholder = "请输入文章内容";
      // 配置菜单栏，设置不需要的菜单
      this.editor.config.excludeMenus = ["video", "code"];
      // 配置颜色（文字颜色、背景色）
      this.editor.config.colors = ["#ffffff", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#009933", "#3399ff", "#0000ff", "#000000", "#bf4080", "#00ffaa", "#ff3399"];
      // 配置行高
      this.editor.config.lineHeights = ["1", "1.2", "1.5", "2", "2.5", "3"];
      //来关闭样式过滤
      this.editor.config.pasteFilterStyle = false;
      this.editor.config.pasteIgnoreImg = false;
      this.editor.create();
    },
    async getUpdateForm() {
      if (this.isUpdate) {
        const { id } = this.$route.params;
        const res = await getOneArticleInfo({ id });
        if (res) {
          this.form.contentHtml = res.data.contentHtml;
          this.form.title = res.data.title;
          // this.form.articleImg = res.data.articleImg
          this.imgUrl = res.data.articleImg;
          this.uploadOrImg = this.imgUrl ? false : true;
          this.form.id = id;
          this.editor.txt.html(this.form.contentHtml);
        }
      }
    },
    getFile(file) {
      this.$utils.getBase64(file).then((res) => {
        if (res) {
          this.uploadOrImg = false;
          this.imgUrl = res;
        }
      });
    },
    // 覆盖默认的上传行为，可以自定义上传的实现
    handleUpload(res) {
      let formData = new FormData();
      formData.append("avatar", res.file);
      this.filedata = formData;
      this.getFile(res.file);
    },
    //选择时取消上传
    cancelUpload() {
      this.uploadOrImg = true;
      this.imgUrl = "";
    },
    //修改时取消上传
    async cancelUploadImg() {
      this.uploadOrImg = true;
      if (this.isUpdate && this.imgUrl && /^https?:\/\/[0-9]/.test(this.imgUrl)) {
        //删除之前的图片
        await deleteImg({ url: this.imgUrl });
        this.imgUrl = "";
      }
    },
    //确认上传
    async confirmUpload() {
      const res = uploadArticleImgApi(this.filedata);
      if (res.code === 200) {
        this.showBtn = false;
        this.form.articleImg = res.articleImg;
      }
    },
    //点击发表文章
    async sendArticleEvent() {
      this.form.contentText = this.editor.txt.text().slice(0, 120);
      this.form.contentHtml = this.editor.txt.html();
      if (!this.form.title || !this.form.contentText) {
        return this.$utils.diyTips("请输入文章标题或内容", "warning");
      }
      if (this.isUpdate) {
        await articleUpdate(this.form);
        this.$utils.diyTips("修改文章成功", "success", 500);
        setTimeout(() => {
          this.$router.push(`/article/details/${this.form.id}`);
        }, 700);
      } else {
        await articleSendApi(this.form);
        this.$router.push({ path: "/", query: { id: this.form.userId } });
      }
    },
  },
  beforeDestroy() {
    // 销毁编辑器
    this.editor.destroy();
    this.editor = null;
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