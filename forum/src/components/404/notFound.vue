<template>
  <div class="error-container">
    <div class="error-img">
      <img
        alt="404"
        src="../../assets/404.png"
      />
    </div>
    <div class="error-info">
      <div class="error-info-oops">{{ oops }}</div>
      <div class="error-info-headline">{{ headline }}</div>
      <div class="error-info-msg">{{ info }}</div>
      <div class="my-button-a bg-blue" @click="goIndex">返 回 首 页</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "notFound",
    data() {
      return {
        oops: "抱歉!",
        headline: "当前页面不存在...",
        info: "请检查您输入的网址是否正确，或点击下面的按钮返回首页。",
      };
    },
    methods: {
      goIndex() {
        this.$router.push('/')
      }
    },
  };
</script>

<style lang="less" scoped>
  .error-container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;

    > div {
      margin-bottom: 150px;
    }
  }

  .error-img {
    width: 500px;
    height: 270px;
    position: relative;
    overflow: hidden;

    > img:first-child {
      height: 100%;
      width: 100%;
      display: inline-block;
      /*background-size: 100%;*/
    }

    .img-cloud {
      position: absolute;
      top: 0;
      right: 50%;
      height: 60px;
      width: 60px;
      opacity: 0;
      display: inline-block;
      animation: move 2s ease;
      animation-delay: .5s;
    }

    @keyframes move {
      0% {
        opacity: .7;
        transform: translate(0, 0);
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0;
        transform: translate(-140px, 50px);
      }
    }
  }

  .error-info {
    position: relative;
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px 0;
    overflow: hidden;
    transform: translateX(-80px);

    &-oops {
      margin-bottom: 20px;
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      color: #0099ff;
      opacity: 0;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }

    &-headline {
      margin-bottom: 10px;
      font-size: 20px;
      font-weight: bold;
      line-height: 24px;
      color: #222;
      opacity: 0;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
    }

    &-msg {
      margin-bottom: 30px;
      font-size: 13px;
      line-height: 21px;
      color: #aaa;
      opacity: 0;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }

    .my-button-a {
      cursor: pointer;
      width: 200px;
      height: 40px;
      border-radius: 10px;
      line-height: 40px;
      text-align: center;
      opacity: 0;
      box-shadow: 2px 2px 40px rgba(#0099ff, .6);
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.35s;
      animation-fill-mode: forwards;
      transition: box-shadow .2s ease;
    }

    .my-button-a:hover {
      border: 1px solid #0099ff;
      background: rgba(#0099ff, .3);
      box-shadow: none;
    }

    @keyframes slideUp {
      0% {
        opacity: 0;
        transform: translateY(60px);
      }

      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
</style>
