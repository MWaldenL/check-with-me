import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  user: {
    isLoggedIn: false,
    data: null
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
