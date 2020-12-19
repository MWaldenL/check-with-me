const mutations = {
  setUserLoggedIn(state, isLoggedIn) {
    state.user.isLoggedIn = isLoggedIn
  },

  setUserData(state, data) {
    state.user.data = data
  }
}

export default mutations