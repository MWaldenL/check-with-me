const mutations = {
  setUserLoggedIn(state, isLoggedIn) {
    state.user.isLoggedIn = isLoggedIn
  },

  setUserData(state, data) {
    state.user.data = data
  },

  setPassword(state, newPass) {
    state.pass = newPass
  }
}

export default mutations