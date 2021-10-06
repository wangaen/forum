export default {
  state: {
    readyLoginOut: false,
  },
  mutations: {
    setReadyLoginOut(state, status) {
      state.readyLoginOut = status
    },
  },
  getters: {
    getReadyLoginOut(state) {
      return state.readyLoginOut
    },
  }
}

