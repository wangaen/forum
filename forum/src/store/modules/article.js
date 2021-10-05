export default {
  state: {
    beforeSearch: '',
    searchForm: {
      search: "",
      pageNum: 1,
    },
  },
  mutations: {
    setBeforeSearch(state, text) {
      state.beforeSearch = text
    },
    setSearchForm(state, obj) {
      state.searchForm.search = obj.text
      state.searchForm.pageNum = obj.num
    },
    setPageNum(state, num) {
      state.searchForm.pageNum = num
    }
  },
  getters: {
    getBeforeSearch(state) {
      return state.beforeSearch
    },
    getAfterSearch(state) {
      return state.searchForm.search
    },
    getSearchForm(state) {
      return state.searchForm
    }
  }
}

