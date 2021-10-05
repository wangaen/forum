<template>
  <div class="user-center">
    <div class="person-box">
      <div class="avatar-box">
        <div class="img-box">
          <img :src="userInfo.avatar" alt="" />
          <h3 style="margin-left: 50px">{{ userInfo.nickname }}</h3>
        </div>
        <div class="up-img" @click="showUploadImg = true">
          <img src="@/assets/upload.png" alt="" />
        </div>
      </div>
      <div class="info_box">
        <h3 style="margin-top: 0px">基本信息</h3>
        <div class="base_info" @click="showEditBox = false">
          <div class="edit-main" v-if="showEditBox">
            <div class="editText">
              <div>
                <span>邮</span>
                <span>箱</span>
              </div>
              <div style="width: 250px">{{ userInfo.email }}</div>
              <div>
                <div class="edit">
                  <i class="el-icon-edit" style="margin-right: 2px"></i>
                  <span>编辑</span>
                </div>
              </div>
            </div>
            <div>
              <div>用户昵称</div>
              <div>{{ userInfo.nickname }}</div>
            </div>
            <div>
              <div>真实姓名</div>
              <div v-if="userInfo.realname">{{ userInfo.realname }}</div>
              <div v-else style="color: #ccc">未填写</div>
            </div>
            <div>
              <div>
                <span>地</span>
                <span>址</span>
              </div>
              <div v-if="userInfo.location">{{ userInfo.location }}</div>
              <div v-else style="color: #ccc">未填写</div>
            </div>
            <div>
              <div>
                <span>性</span>
                <span>别</span>
              </div>
              <div v-if="userInfo.gender === '-1'" style="color: #ccc">未设置</div>
              <div v-else>{{ userInfo.gender === "0" ? "女" : "男" }}</div>
            </div>
            <div>
              <div>出生日期</div>
              <div v-if="!userInfo.birthday" style="color: #ccc">未设置</div>
              <div v-else>{{ userInfo.birthday }}</div>
            </div>
            <div>
              <div>个人简介</div>
              <div v-if="!userInfo.experience" style="color: #ccc">未填写</div>
              <div v-else class="text-box">{{ userInfo.experience }}</div>
            </div>
          </div>
          <editUserInfo v-else @saveUserInfo="saveUserInfo" @closeUserInfo="closeUserInfo" :userInfo="userInfo" />
        </div>
      </div>
      <upload-img v-if="showUploadImg" @closeUploadImg="closeUploadImg" @updateImg="updateImg" />
    </div>
  </div>
</template>

<script>
import uploadImg from "./components/uploadImg";
import editUserInfo from "./components/editUseInfo";
import { getUserInfo } from "@/api/api";

export default {
  name: "userCenter",
  components: {
    uploadImg,
    editUserInfo,
  },
  data() {
    return {
      showUploadImg: false,
      showEditBox: true,
    };
  },
  mounted() {
    document.documentElement.scrollTop = 0;
  },
  computed: {
    userInfo() {
      return this.$store.getters.getUser;
    },
  },
  methods: {
    saveUserInfo() {
      //  修改成功，关闭编辑框
      this.showEditBox = true;
      this.getUserData();
    },
    closeUserInfo() {
      this.showEditBox = true;
    },
    closeUploadImg(value) {
      this.showUploadImg = value;
    },
    updateImg() {
      this.getUserData();
    },
    async getUserData() {
      if (this.userInfo._id) {
        let res = await getUserInfo({ id: this.userInfo._id });
        if (res.data) {
          this.$store.commit("setUser", res.data);
        }
      }
    },
  },
};
</script>

<style scoped>
.user-center {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
}
.person-box {
  width: 1000px;
  height: 700px;
}
.img-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.avatar-box {
  padding: 10px 30px;
  box-sizing: border-box;
  border-radius: 10px;
  box-shadow: 0 0px 30px 3px #aaa;
  height: 140px;
}
.img-box > img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
.up-img:hover {
  opacity: 1 !important;
}
.up-img {
  opacity: 0;
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  top: -120px;
  left: 0px;
}
.up-img > img {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  top: 40px;
  left: 40px;
}
.info_box {
  margin-top: 30px;
  padding: 10px 15px;
  box-sizing: border-box;
  border-radius: 10px;
  box-shadow: 0 0px 30px 3px #aaa;
  text-align: left;
}
.base_info {
  padding: 10px 15px;
  box-sizing: border-box;
  cursor: pointer;
}
.base_info:hover {
  background: #f5f5f5;
}
.base_info > div > div {
  display: flex;
}
.base_info > div > div > div {
  font-size: 14px;
  line-height: 24px;
  font-weight: 510;
  margin-bottom: 32px;
}
.base_info > div > div > div:nth-child(1) {
  color: #666;
  margin-right: 60px;
  width: 65px;
  letter-spacing: 2px;
  display: flex;
  justify-content: space-between;
}
.text-box {
  width: 810px;
}
.base_info > div > div > div:nth-child(2) {
  color: #000;
  letter-spacing: 2px;
  font-weight: 530;
}
.editText > div:nth-child(3) {
  width: 560px;
  text-align: right;
  display: none;
  color: #409eff;
}
.base_info:hover .editText > div:nth-child(3) {
  display: block;
}
</style>