<template>
  <div class="navbarlabel">
    <div v-for="(item, index) in labelArr" :key="index" :style="{ width: `${width}` }">
      <span @click="goLabelRoute(index)" @dblclick="dbClickEvent">{{ item }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "headLabel",
  props: {
    labelArr: {
      type: Array,
      default: () => ["首页", "推荐", "热门"],
    },
    width: {
      type: String,
      default: "80px",
    },
  },
  methods: {
    goLabelRoute(index) {
      if (index === 0) {
        this.$route.path !== "/" && this.$router.push("/");
        if (this.$store.getters.getAfterSearch) {
          this.$store.commit("setBeforeSearch", "");
          this.$store.commit("setSearchForm", { text: "", num: 1 });
        }
      } else if (index == 1 || index == 2) {
        this.$confirm("该功能正在努力开发中...", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        })
          .then(() => {})
          .catch(() => {});
      }
    },
    dbClickEvent() {
      this.$route.path !== "/" && this.$router.push("/");
      this.$store.commit("setBeforeSearch", "");
      this.$store.commit("setSearchForm", { text: "", num: 1 });
    },
  },
};
</script>

<style scoped lang="less">
.navbarlabel {
  margin-left: 20px;
  display: flex;
  color: #fff;
}
.navbarlabel > div > span:hover {
  width: 40px;
  color: #0099ff;
  font-weight: 550;
  cursor: pointer;
}
</style>