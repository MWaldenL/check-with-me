import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  currentGameID: 'VUqGnWBLmgulz3X5O13h',
  boardState: '',
  hostUser: 'ktreyVNxpqRTE7mQPjreB0iWyFi1',
  otherUser: '4pSu14srMSelGWQkSgGpRsA2jGf1',
  enemyUsername: '',
  hostTimeLeft: 0,
  otherTimeLeft: 0,
  isHostWhite: true,
  lastPlayerMoved: '',
  drawCounter: 0
}

export default {
  state,
  getters,
  actions,
  mutations
}
