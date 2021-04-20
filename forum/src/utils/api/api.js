import createServe from './createApi'

const ApiGet = createServe.get;
const ApiPost = createServe.post;
const ApiPut = createServe.put;
const ApiDelete = createServe.delete;


const api = {

  loginApi: (req) => {return ApiPost(`/login`, req)},  //登录
  registerApi: (req) => {return ApiPost(`/register`, req)},  //注册
  deleteImg: (req) => {return ApiDelete(`/delete_img`,req)}, //删除图片

  /********************************************************************************************************
   ******************************************  user 用户  *************************************************
   ********************************************************************************************************/

  getUserInfo: (req) => {return ApiGet('/user/get_info', req)}, // 获取个人信息
  editUserInfo: (req) => {return ApiPost('/user/edit', req)}, //修改用户信息
  updatePassApi: (req) => {return ApiPut(`/user/change_password`,req)}, //修改密码
  uploadAvatarImgApi: (req,config) => {return ApiPost(`/user/avatar/upload`,req,config)}, //上传头像图片
  
  /********************************************************************************************************
   ******************************************  article 文章  *************************************************
   ********************************************************************************************************/

  getArticle: (req) => {return ApiGet('/article/get',req)}, //获取该页的所有文章
  getUserAllArticles: (req) => {return ApiGet('/article/user_all_articles',req)}, //获取对应用户的所有文章
  getArticleInfo: (req) => {return ApiGet(`/getArticleInfo`,req)}, //获取文章信息
  articleSendApi: (req) => {return ApiPost(`/article/send`, req)},  //发表文章
  totalReticleReadLikeApi: (req) => {return ApiGet(`/article/total_reticle_read_like`, req)},  //获取总浏览量，点赞总数，文章总数
  uploadArticleImgApi: (req,config) => {return ApiPost(`/article/upload`,req,config)}, //上传文章图片
  addReadNumApi: (req) => {return ApiPost(`/article/add_read_num`, req)}, //每点击一次文章，浏览量 + 1
  articleUpdate: (req) => {return ApiPut(`/article/update`, req)},
  articleDelete: (req) => {return ApiDelete(`/article/delete`, req)},
  /********************************************************************************************************
   ******************************************  comment 评论  *************************************************
   ********************************************************************************************************/

  commentAddApi: (req) => {return ApiPost(`/comment/add`,req)}, //添加评论
  commentGetApi: (req) => {return ApiGet(`/comment/get_all`,req)}, //获取某一篇文章下的评论

  /********************************************************************************************************
   ******************************************  reply 回复  *************************************************
   ********************************************************************************************************/
  
  replyAddApi: (req) => {return ApiPost(`/reply/add`,req)}, //添加回复

  /********************************************************************************************************
   ******************************************  like 点赞  *************************************************
   ********************************************************************************************************/
   addLikeNum: (req) => {return ApiPost(`/like/add_like_num`, req)}, //点赞
   ifLikeArticle: (req) => {return ApiGet(`/like/if_like_article`, req)}, //判断用户是否已点赞此文章

}

export default api