<template>
  <div class="upload-box">
    <el-dialog title="更换头像" @close="closeClick" :visible="true" :close-on-click-modal="false" align="center" width="800px">
      <el-upload class="upload-demo" :http-request="handleUpload" action :limit="1" :show-file-list="false" drag v-if="showImg">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过1M</div>
      </el-upload>
      <div v-else class="img-box">
        <img :src="imgUrl" alt="" />
        <div class="btn-box">
          <el-button type="info" plain @click="cancelUpload">取消</el-button>
          <el-button type="danger" plain @click="confirmUpload">上传并保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { uploadAvatarImgApi } from "@/api/api";
export default {
  name: "uploadImg",
  props: {
    dialogTableVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      imgUrl: "",
      showImg: true,
      filedata: "",
    };
  },
  methods: {
    closeClick() {
      this.$emit("closeUploadImg", false);
    },
    getFile(file) {
      this.$utils.getBase64(file).then((res) => {
        if (res) {
          this.showImg = false;
          this.imgUrl = res;
        }
      });
    },
    // 覆盖默认的上传行为，可以自定义上传的实现
    handleUpload(res) {
      let formData = new FormData();
      formData.append("avatar", res.file);
      formData.append("id", this.$store.getters.getUser._id);
      this.filedata = formData;
      this.getFile(res.file);
    },
    //取消上传
    cancelUpload() {
      this.showImg = true;
      this.imgUrl = "";
    },
    //确认上传
    async confirmUpload() {
      let res = await uploadAvatarImgApi(this.filedata);
      this.$utils.diyTips(res.message, res.type);
      this.closeClick();
      this.$emit("updateImg");
    },
  },
};
</script>

<style scoped>
.img-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.img-box > img {
  width: 240px;
  height: 240px;
  border-radius: 50%;
}
.btn-box {
  margin-top: 30px;
  width: 200px;
  display: flex;
  justify-content: space-between;
}
.el-upload__tip {
  font-size: 16px;
}
.el-upload__text {
  font-size: 16px;
}
</style>