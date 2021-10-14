<template>
  <div class="avater-main">
    <div class="info-box">
      <img :src="getUserInfo.avatar" alt=" " />
      <h3 style="padding-top: 40px; margin: 0px">{{ getUserInfo.nickname }}</h3>
    </div>
    <el-menu class="el-menu-vertical-demo" menu-trigger="click" @select="selectMenu">
      <el-menu-item index="1">
        <span slot="title">个人中心</span>
      </el-menu-item>
      <el-menu-item index="2">
        <span slot="title">发布管理</span>
      </el-menu-item>
      <el-menu-item index="3">
        <span slot="title">修改密码</span>
      </el-menu-item>
      <el-menu-item index="4">
        <span slot="title">退出登录</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "headMenu",
  computed: {
    getUserInfo() {
      return this.$store.getters.getUser;
    },
    readyLoginOut() {
      return (
        (this.$route.name === "SendArticle" || this.$route.name === "UpdateArticle") &&
        this.$store.getters.getReadyLoginOut &&
        (document.getElementsByClassName("el-input__inner")[1].value || document.getElementsByClassName("w-e-text")[0].innerHTML)
      );
    },
  },
  methods: {
    async selectMenu(index) {
      this.$emit("closeMenu", true);
      if (index == 1) {
        this.$router.push({ path: "/user/center" }, () => {});
      } else if (index == 2) {
        this.$router.push({ path: `/article/release_manage/${this.getUserInfo._id}` }, () => {});
      } else if (index == 3) {
        this.$router.push({ path: "/user/update_pass" }, () => {});
      } else if (index == 4) {
        this.$store.commit("setReadyLoginOut", true);
        this.$confirm(`${this.readyLoginOut ? "你在当前页面已经编辑了文章信息，离开当前页面将会丢失该页面的任何信息。" : ""}是否继续退出登录?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            history.pushState(history.state, "", document.URL);
            window.addEventListener("popstate", this.cancelGoBack);
            this.$route.path !== "/" && this.$router.push("/");
            localStorage.clear();
          })
          .catch(() => {
            this.$store.commit("setReadyLoginOut", false);
          });
      }
    },
    cancelGoBack() {
      history.pushState(history.state, "", document.URL);
    },
  },
  beforeDestroy() {
    window.removeEventListener("popstate", this.cancelGoBack);
  },
};
</script>

<style scoped lang="less">
.avater-main {
  width: 200px;
  height: 350px;
  background-color: #fff;
  box-shadow: 0 3px 6px 2px #aaa;
}
.info-box {
  position: relative;
}
.info-box > img {
  position: absolute;
  cursor: pointer;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  top: -45px;
  left: 60px;
}
.el-menu ::v-deep {
  .el-menu-item.is-active {
    color: #303133;
  }
}
</style>