export default [
  {
    path: '/user/center',
    name: 'UserCenter',
    meta: {
      breadcrumbName: "个人中心",
    },
    component: () => import("@/views/user/userCenter/userCenter.vue")
  },
  {
    path: '/user/update_pass',
    name: 'UpdatePass',
    meta: {
      breadcrumbName: "修改密码",
    },
    component: () => import('@/views/user/updatePass/updatePass.vue')
  },
]