import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userData:userDataInit(),
    update_avatar_statu: '',
    refresh_index: '',
    search: ''
  },
  mutations: {
    //保存搜索框中的值
    setSearch: (state,text) => {
      state.search = text
    },
    //设置localStorage缓存用户信息
    setUserData: (state,data) => {
      state.userData.u_id = data._id
      state.userData.u_avatar = data.avatar
      state.userData.u_name = data.nickname
      window.localStorage.setItem('u_id',data._id)
      window.localStorage.setItem('u_avatar',data.avatar)
      window.localStorage.setItem('u_name',data.nickname)
    },
    //删除localStorage缓存
    removeUserData:(state) => {
      state.userData.u_id = ''
      state.userData.u_avatar = ''
      state.userData.u_name = ''
      window.localStorage.removeItem('u_id')
      window.localStorage.removeItem('u_avatar')
      window.localStorage.removeItem('u_name')
    },
    //改变头像状态
    setUpdateAvatarStatu: (state,statu) => {
      state.update_avatar_statu = statu
    },
    //点击首页状态
    setRefreshIndex: (state,statu) => {
      state.refresh_index = statu
    },
  },
  getters:{
    //获取更新头像的状态
    getUpdateAvatarStatu:(state) => {
      return state.update_avatar_statu
    },
    //获取点击首页的状态
    getRefreshIndex:(state) => {
      return state.refresh_index
    },
    //获取id
    getUserID:(state) => {
      return state.userData.u_id
    },
    //获取用户名
    getUserName:(state) => {
      return state.userData.u_name
    },
    //获取头像
    getUserAvatar:(state) => {
      return state.userData.u_avatar
    },
    getSearch(state){
      return state.search
    }
  },
})

// 初始化,获得LocaStorage的值
function userDataInit(){
  let u_id = window.localStorage.getItem('u_id')
  let u_avatar = window.localStorage.getItem('u_avatar')
  let u_name = window.localStorage.getItem('u_name')
  let userData = {}
  userData.u_id = u_id
  userData.u_avatar = u_avatar
  userData.u_name = u_name 
  return userData
}