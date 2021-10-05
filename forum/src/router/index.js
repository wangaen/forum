import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      breadcrumbName: "首页",
    },
    component: () => import('@/views/home.vue'),
    children: [
      {
        path: '/user/center',
        name: 'UserCenter',
        meta: {
          breadcrumbName: "个人中心",
        },
        component: () => import("@/views/user/userCenter/userCenter.vue")
      },
      {
        path: '/article/send',
        name: 'SendArticle',
        meta: {
          breadcrumbName: "发布文章",
        },
        component: () => import('@/views/article/sendArticle/sendArticle.vue')
      },
      {
        path: '/article/update/:id',
        name: 'UpdateArticle',
        meta: {
          breadcrumbName: "修改文章",
        },
        component: () => import('@/views/article/sendArticle/sendArticle.vue')
      },
      {
        path: '/user/update_pass',
        name: 'UpdatePass',
        meta: {
          breadcrumbName: "修改密码",
        },
        component: () => import('@/views/user/updatePass/updatePass.vue')
      },
      {
        path: '/article/details/:id',
        name: 'AriticleDetails',
        meta: {
          breadcrumbName: "文章详情",
        },
        component: () => import('@/views/article/articleDetails/articleDetails.vue')
      },
      {
        path: '/article/release_manage/:id',
        name: 'ReleaseManage',
        meta: {
          breadcrumbName: "发布管理",
        },
        component: () => import('@/views/article/releaseManage/releaseManage.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/register.vue')
  },
  {
    path: '/not_found',
    name: 'notFound',
    component: () => import('@/components/404/notFound.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // 如果前往的页面是不存在的页面那么跳转到404页面
  if (!to.matched.length) {
    next('/not_found')
  }
  next()
});
export default router
