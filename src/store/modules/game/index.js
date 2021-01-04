import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  currentGameID: 'Vc0H4f4EvY6drRKnvsk5',
  boardState: '',
  hostUser: 'ktreyVNxpqRTE7mQPjreB0iWyFi1',
  otherUser: '4pSu14srMSelGWQkSgGpRsA2jGf1',
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
