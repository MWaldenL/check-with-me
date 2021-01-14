import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  currentGameID: 'A0uAJ0jG79JwEd2FCsay',
  boardState: '',
  hostUser: 'a0YSRK3l64Tm0QysXkCYzwfxYa52',
  otherUser: 'NZJqOdbxTkTOKSgNbxSV0tJjmBw2',
  enemyUsername: '',
  hostTimeLeft: 0,
  otherTimeLeft: 0,
  isHostWhite: true,
  lastPlayerMoved: '',
  firstRun: true
}

export default {
  state,
  getters,
  actions,
  mutations
}
