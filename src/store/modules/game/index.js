import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  currentGameID: 'WhtzOOP4sw05JDTRwCgp',
  currentTimerID: 'v0uDkMMNNe6sfPSSKT6U',
  boardState: '',
  hostUser: 'LEv0XF9oYgU8U0dS0SoNQMtQqHq1',
  otherUser: 'QooU35VzHYa6HuX3hEIGNtzD0J63',
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
