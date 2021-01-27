import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  currentGameID: '6ZAthUNxdMWjhmph8v1q',
  boardState: '',
  hostUser: 'ktreyVNxpqRTE7mQPjreB0iWyFi1',
  otherUser: '4pSu14srMSelGWQkSgGpRsA2jGf1',
  enemyUsername: '',
  hostTimeLeft: 0,
  otherTimeLeft: 0,
  isHostWhite: true,
  lastPlayerMoved: '',
  currentTimerID: 'ugqDqFx9a17vk1zFYhLE'
}

export default {
  state,
  getters,
  actions,
  mutations
}
