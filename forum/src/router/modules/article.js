export default [
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