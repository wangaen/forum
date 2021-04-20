<template>
<div class="send-article-box">
  <div class="send-article">
    <div class="article-main">
      <div class="article-box column">
        <label>标题</label>
        <el-input v-model="form.title" placeholder="请输入内容" maxlength="88"></el-input>  
      </div>
      <div class="article-box">
        <div class="con-l column">
          <label>内容</label>
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" :rows="20" maxlength="3000"></el-input>  
        </div>
        <div class="con-r">
          <el-upload
            v-if="upload_or_img"
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
            <img :src="img_url" alt="" style="width:190px;height:190px;border-radius:6px;">
            <div class="select-btn" v-if="show_btn">
              <el-button type="info" plain @click="cancelUploadImg">取消</el-button>
              <el-button type="danger" plain @click="confirmUpload">确认</el-button>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="btn-box">
      <el-button type="danger" round @click="send_btn">{{send_or_update ? '修改文章' : '发表文章'}}</el-button>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    name : "sendArticle",
    props:{},

    data(){
      return {
        form:{
          //标题
          title: '',
          //内容
          content: '',
          //用户id
          user_id: this.$store.getters.getUserID,
          //封面图片
          article_img: '',
        },
        filedata: '',
        upload_or_img: true,
        show_btn: true,
        img_url: '',
        send_or_update: !!this.$route.query.title,
      }
    },

    components:{},

    created(){
      this.getForm()
    },

    mounted(){},

    computed:{},

    methods:{
      getForm(){
        if(this.send_or_update){
          this.img_url = decodeURIComponent(this.$route.query.article_img)
          this.upload_or_img = this.img_url ? false : true;
          for(let key in this.form) {
            this.form[key] = this.$route.query[key]
          }
          this.form.id = this.$route.query._id
        }
      },
      getFile(file){
        this.$tools.getBase64(file).then( res => {
          if(res){
            this.upload_or_img = false
            this.img_url = res
          }
        })
      },
      // 覆盖默认的上传行为，可以自定义上传的实现
      handleUpload(res) {
        let formData = new FormData();
        formData.append("avatar", res.file);
        this.filedata = formData;
        this.getFile(res.file)
      },
      //选择时取消上传
      cancelUpload(){
        this.upload_or_img = true
        this.img_url = ''
      },
      //修改时取消上传
      cancelUploadImg(){
        this.upload_or_img = true;
        if(this.send_or_update && this.img_url && /^https?:\/\/[0-9]/.test(this.img_url)){
          //删除之前的图片
          this.$Api.deleteImg({url: this.img_url}).then(() => {this.img_url = ''})
        }
      },
      //确认上传
      confirmUpload(){
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        this.$Api.uploadArticleImgApi(this.filedata, config).then((res) => {
          this.show_btn = false
          this.form.article_img = res.article_img
        });
      },
      //点击发表文章
      send_btn(){
        if(this.send_or_update){
          this.$Api.articleUpdate(this.form).then(res => {
            this.$tools.diyTips(res.message, res.type, 700)
            if(res.type == 'success'){
              setTimeout(() => {
                this.$router.push(`/article/details/${this.form.id}`)
              }, 800)
            }
          })
        }else{
          if(!this.checkContent()){
            return;
          }else{
            this.$Api.articleSendApi(this.form).then((res) => {
              if(res.message === "OK"){
                this.$router.push({path:'/',query:{id: this.form.user_id}})
              }else{
                this.$tools.diyTips('发表失败','error')
              }
            });
          }
        }
      },
      checkContent(){
        if(!this.form.title || !this.form.content){
          this.$tools.diyTips('请输入文章标题或内容','warning')
          return false
        }else{
          return true
        }
      }
    },
    watch: {
      '$route.path': function (newVal) {
        console.log(newVal);
      },
    }
  }
</script>

<style scoped lang="less">
  .send-article-box{
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
  .send-article{
    border-radius: 10px;
    width: 1000px;
    height: 100%;
    margin-top: 20px;
    display: flex;
    box-shadow: 0 0px 30px 3px #AAA;
    flex-direction: column;
    align-items: center;

    .article-main{      
      width: 960px;
      height: 560px;
    }
    .column{
      display: flex;
      flex-direction: column;
    }
    .article-box{
      display: flex;
      margin-top: 10px;

      .el-input ::v-deep{
        margin-top: 10px;
        position: static;

        .el-input__inner{
          border-radius: 20px;
        }
      }
      .el-textarea ::v-deep{
        margin-top: 10px; 
        position: static;

        .el-textarea__inner{
          border-radius: 10px;
        }
      }
      label{
        font-size: 20px;
        letter-spacing: 5px;
        font-weight: 520;
        width: 60px;
      }
    }

    .article-box:nth-child(2){
      width: 1200px;
      .con-l{
        display: flex;
        width: 960px;
      }

      .con-r{
        position: relative;
        right: 0;
        top: -97px;
        height: 190px;
        border-radius: 7px;
        box-shadow: 0 0px 30px 3px #AAA;
        margin-left: 30px;
        width: 190px;
      }
    }

    .con-r ::v-deep{
      .el-upload-dragger{   
        width: 190px;
        height: 190px;
        border: 1px solid #d9d9d9;
        position: static;
      }
      .el-upload-dragger:hover{
        border: 1px solid #409EFF;
      }
    }
    
    .btn-box{
      display: flex;
      margin: 20px 0px;
      width: 100%;
      justify-content: center;
      .el-button{
        height: 40px;
        width: 200px;
        letter-spacing: 5px;
      }
    }

    .el-button--danger{
      color:#fff;
      border: 1px solid #0099ff;
      background-color: #0099ff;
      
      &:hover{
        border: 1px solid #015BF1;
        background-color: #015BF1;
      }
    }
  }
</style>