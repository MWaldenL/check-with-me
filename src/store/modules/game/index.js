import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  currentGameID: '',
  boardState: '',
  hostUser: '',
  otherUser: '',
  enemyUsername: '',
  hostTimeLeft: 0,
  otherTimeLeft: 0,
  isHostWhite: true,
  lastPlayerMoved: ''
}

export default {
  state,
  getters,
  actions,
  mutations
}
