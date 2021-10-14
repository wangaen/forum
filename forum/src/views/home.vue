<template>
  <div class="home_wrap">
    <el-container>
      <el-header>
        <forum-header />
      </el-header>
      <el-main>
        <forum-main />
      </el-main>
      <el-footer v-if="$route.name === 'Home'">
        <forum-footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import forumHeader from "@/layout/header/forumHeader.vue";
import forumFooter from "@/layout/footer/forumFooter.vue";
import forumMain from "@/layout/main/forumMain.vue";

export default {
  name: "home",
  components: {
    forumHeader,
    forumFooter,
    forumMain,
  },
  beforeRouteEnter(to, from, next) {
    if (to.name === "Home" && from.name === "Login") {
      next((vm) => {
        history.pushState(history.state, "", document.URL);
        window.addEventListener("popstate", vm.cancelGoBack);
      });
    }
    next();
  },
  methods: {
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
.home_wrap {
  min-width: 1200px;
  .el-header {
    padding: 0px;
    height: 64px !important;
  }
  .el-main {
    padding: 0px;
    height: calc(100vh - 64px - 36px) !important;
  }
  .el-footer {
    padding: 0px;
    height: 36px !important;
  }
}
</style>