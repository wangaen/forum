export default {
  state: {
    token: localStorage.getItem("token"),
    user: {}
  },
  mutations: {
    setToken(stare, token) {
      localStorage.setItem("token", JSON.stringify(token));
      stare.token = localStorage.getItem("token")
    },
    setUser(state, info) {
      state.user = info
    }
  },
  getters: {
    getToken(state) {
      if (state.token) {
        return JSON.parse(state.token)
      }
      return null
    },
    getUser(state) {
      return state.user
    }
  }
}

