import axios from '@/api'
const api = '/api'

export const loginApi = (params) => { return axios.post(`${api}/login`, params) };  //登录
export const registerApi = (params) => { return axios.post(`${api}/register`, params) };  //注册
export const deleteImg = (params) => { return axios.delete(`${api}/deleteImg`, { params }) }; //删除图片

/********************************************************************************************************
 ******************************************  user 用户  *************************************************
 ********************************************************************************************************/

export const getUserInfo = (params) => { return axios.get(`${api}/user/getInfo`, { params }) }; // 获取个人信息
export const updateUserInfo = (params) => { return axios.put(`${api}/user/updateInfo`, params) }; //修改用户信息
export const updatePassApi = (params) => { return axios.put(`${api}/user/updatePass`, params) }; //修改密码
export const uploadAvatarImgApi = (params) => { return axios.post(`${api}/user/avatar/upload`, params) }; //上传头像图片

/********************************************************************************************************
 ******************************************  article 文章  *************************************************
 ********************************************************************************************************/

export const getArticleData = (params) => { return axios.post(`${api}/article/getArticleData`, params) }; //获取该页的所有文章
export const getUserAllArticles = (params) => { return axios.post(`${api}/article/allArticles`, params) }; //获取对应用户的所有文章
export const getOneArticleInfo = (params) => { return axios.post(`${api}/article/getOneArticleInfo`, params) }; //获取文章信息
export const articleSendApi = (params) => { return axios.post(`${api}/article/send`, params) };  //发表文章
export const totalRaticleReadLikeApi = (params) => { return axios.post(`${api}/article/RaticleReadLike`, params) };  //获取总浏览量，点赞总数，文章总数
export const uploadArticleImgApi = (params) => { return axios.post(`${api}/article/uploadImgs`, params) }; //上传文章图片
export const addReadNumApi = (params) => { return axios.post(`${api}/article/addReadNum`, params) }; //每点击一次文章，浏览量 + 1
export const articleUpdate = (params) => { return axios.put(`${api}/article/update`, params) }; //修改文章
export const articleDelete = (params) => { return axios.delete(`${api}/article/delete`, { params }) }; //删除文章

/********************************************************************************************************
 ******************************************  comment 评论  *************************************************
 ********************************************************************************************************/
export const commentAddApi = (params) => { return axios.post(`${api}/comment/add`, params) }; //添加评论
export const commentGetApi = (params) => { return axios.post(`${api}/comment/allData`, params) }; //获取某一篇文章下的评论
export const commentDelete = (params) => { return axios.delete(`${api}/comment/delete`, { params }) }; //删除评论

/********************************************************************************************************
 ******************************************  like 点赞  *************************************************
 ********************************************************************************************************/
export const addLikeNum = (params) => { return axios.post(`${api}/like/addLikeNum`, params) }; //点赞
export const isLikeArticle = (params) => { return axios.get(`${api}/like/isLikeArticle`, { params }) }; //判断用户是否已点赞此文章

