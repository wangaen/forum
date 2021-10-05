<template>
  <div class="forum_footer">
    <el-row>
      <el-col :span="4">
        <a href="https://beian.miit.gov.cn/" target="_blank">网站备案号</a>
      </el-col>
      <el-col :span="5">
        <a href="https://beian.miit.gov.cn/" target="_blank">粤ICP20038205号</a>
      </el-col>
      <el-col :span="6">
        <div class="qq">
          <span>QQ </span>
          <span> 1012719865</span>
        </div>
      </el-col>
      <el-col :span="9">本网站仅学习使用，有关侵权，请联系删除</el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "forumFooter",
};
</script>

<style scoped lang="less">
.forum_footer {
  box-shadow: 0 10px 30px 3px #aaa;
  padding: 0px 15%;
  height: 36px;
  line-height: 36px;
  box-sizing: border-box;
  color: #999aaa;
  background: #fff;
  .el-col {
    text-align: center;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
}
</style>