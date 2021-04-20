<template>
  <div class="upload-box">
    <el-dialog title="更换头像"  @close="closeClick" :visible="true" :close-on-click-modal="false">
      <el-upload
        class="upload-demo"
        :http-request="handleUpload"
        action
        :limit="1"
        :show-file-list="false"
        drag
        v-if="showImg">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过1M</div>
      </el-upload>
      <div v-else class="img-box">
        <img :src="img_url" alt="">
        <div class="btn-box">
          <el-button type="info" plain @click="cancelUpload">取消</el-button>
          <el-button type="danger" plain @click="confirmUpload">上传并保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name : "uploadImg",
    props:{
      dialogTableVisible:{
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
        img_url: '',
        showImg: true,
        filedata: ''
      }
    },
    methods:{
      closeClick(){
        this.$emit('closeUploadImg',false)
      },
      getFile(file){
        this.$tools.getBase64(file).then( res => {
          if(res){
            this.showImg = false
            this.img_url = res
          }
        })
      },
      // 覆盖默认的上传行为，可以自定义上传的实现
      handleUpload(res) {
        let formData = new FormData();
        formData.append("avatar", res.file);
        formData.append("id",this.$store.getters.getUserID)
        this.filedata = formData
        this.getFile(res.file)
      },
      //取消上传
      cancelUpload(){
        this.showImg = true
        this.img_url = ''
      },
      //确认上传
      async confirmUpload(){
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };

       await this.$Api.uploadAvatarImgApi(this.filedata, config).then((res) => {
          this.$tools.diyTips(res.message, res.type)
          this.closeClick()
          this.$emit('updateImg')
          this.$store.commit('setUpdateAvatarStatu', ''+(+new Date()))
        });
      },
    },
  }
</script>

<style scoped>
  .img-box{ 
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .img-box > img{
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
  .btn-box{
    margin-top: 30px;
    width: 200px;
    display: flex;
    justify-content: space-between;
  }
</style>