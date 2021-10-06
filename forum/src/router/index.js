import Vue from 'vue'
import VueRouter from 'vue-router'
import user from "./modules/user"
import article from "./modules/article"

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
      ...user,
      ...article,
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
