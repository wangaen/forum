import Vue from 'vue'
import Vuex from 'vuex'
import user from "./modules/user"
import article from "./modules/article"
import common from "./modules/common"
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    article,
    common
  }
})