<template>
  <div class="forum_wrap">
    <articleMain v-if="$route.path === '/'"></articleMain>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import articleMain from "@/views/article/articleMain/articleMain.vue";
export default {
  name: "forumMain",
  components: { articleMain },
};
</script>
