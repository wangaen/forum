<template>
  <div class="home_wrap">
    <el-container>
      <el-header>
        <forum-header />
      </el-header>
      <el-main>
        <forum-main />
      </el-main>
      <el-footer>
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