import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('../views/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/register.vue')
  },
  {
    path: '/user_center',
    name: 'userCenter',
    component: () => import('../views/userCenter.vue')
  },
  {
    path: '/send_article',
    name: 'sendArticle',
    component: () => import('../views/sendArticle.vue')
  },
  {
    path: '/update_password',
    name: 'updatePassword',
    component: () => import('../views/updatePassword.vue')
  },
  {
    path: '/article/details/:id',
    name: 'ariticleDetails',
    component: () => import('../views/indexChind/articleDetails.vue')
  },
  {
    path: '/user_details_info',
    name: 'userDetailsInfo',
    component: () => import('../views/userDetailsInfo.vue')
  },
  {
    path: '/not_found',
    name: 'notFound',
    component: () => import('../components/404/notFound.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // 如果前往的页面是不存在的页面那么跳转到404页面
  if(!to.matched.length){
    next('/not_found')
  }
  next()
});
export default router
