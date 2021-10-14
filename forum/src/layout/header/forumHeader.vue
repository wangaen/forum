<template>
  <div class="nav-main">
    <div class="logo-search">
      <img src="../../assets/logo.png" alt="" />
      <el-form>
        <el-input placeholder="请输入内容" v-model="beforeSearch" class="input-with-select" style="width: 400px">
          <el-button slot="append" icon="el-icon-search" @click="searchArticles" class="search-button"></el-button>
        </el-input>
      </el-form>
      <headLabel></headLabel>
    </div>
    <div class="btn-main" v-if="!getToken">
      <el-button type="primary" @click="$router.push('/register')">注册</el-button>
      <el-button type="success" @click="$router.push('/login')">登录</el-button>
    </div>
    <div class="my-box" v-else>
      <img :src="avatarUrl" alt=" " @mouseenter="ifShowAvatar = false" v-show="ifShowAvatar" />
      <el-button type="danger" @click="sendBtn" :class="{ opacitySend: $route.name == 'SendArticle' || $route.name == 'UpdateArticle' }">发布</el-button>
    </div>
    <div @mouseenter="ifShowAvatar = false" @mouseleave="ifShowAvatar = true" v-show="!ifShowAvatar" class="avatar-hover">
      <headMenu @closeMenu="closeMenu"></headMenu>
    </div>
  </div>
</template>

<script>
import headLabel from "./components/headLabel.vue";
import headMenu from "./components/headMenu.vue";
import { userAuthority } from "@/utils/authority";
import { getUserInfo } from "@/api/api";
import { mapGetters } from "vuex";

export default {
  name: "navbar",
  components: {
    headMenu,
    headLabel,
  },
  data() {
    return {
      ifShowAvatar: true,
      userId: "",
      timer: null,
    };
  },
  created() {
    this.init();
    this.timer = userAuthority();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  computed: {
    ...mapGetters({
      getBeforeSearch: "getBeforeSearch",
    }),
    beforeSearch: {
      get() {
        return this.getBeforeSearch;
      },
      set(text) {
        return this.$store.commit("setBeforeSearch", text);
      },
    },
    getToken() {
      return !!this.$store.getters.getToken;
    },
    avatarUrl() {
      return this.$store.getters.getUser.avatar;
    },
  },
  methods: {
    async init() {
      this.userId = this.$utils.getUserId();
      if (this.userId) {
        let res = await getUserInfo({ id: this.userId });
        if (res) {
          this.$store.commit("setUser", res.data);
        }
      }
    },
    sendBtn() {
      this.$router.push("/article/send");
    },
    closeMenu(value) {
      this.ifShowAvatar = value;
    },
    //模糊查询文章
    searchArticles() {
      if (this.$route.path != "/") {
        this.$router.push("/");
        setTimeout(() => {
          this.$store.commit("setSearchForm", { text: this.beforeSearch, num: 1 });
        }, 50);
      } else {
        this.$store.commit("setSearchForm", { text: this.beforeSearch, num: 1 });
      }
    },
  },
};
</script>

<style scoped lang="less">
.nav-main {
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: space-between;
  background-color: #444d56;
  line-height: 64px;
  text-align: center;
}
.logo-search {
  width: 770px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.search-button:hover {
  width: 56px;
  /deep/.el-icon-search {
    &::before {
      font-size: 16px;
      font-weight: 600;
    }
  }
}
.btn-main {
  margin-right: 30px;
}
.logo-search > img {
  width: 40px;
  height: 40px;
  margin-right: 20px;
  border-radius: 50%;
}
.el-form-item {
  margin-bottom: 0px;
}
.el-form > .el-input {
  width: 300px;
}
.my-box > img {
  width: 32px;
  height: 32px;
  margin-right: 20px;
  border-radius: 50%;
  cursor: pointer;
}
.my-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 30px;
}
.opacitySend {
  visibility: hidden;
}
.avatar-hover {
  position: fixed;
  top: 64px;
  right: 50px;
  z-index: 2021;
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
</style>