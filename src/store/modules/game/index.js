import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  currentGameID: '7Z5i6fF4IgKNfzjxIT5w',
  boardState: '',
  hostUser: 'nkR8RnJ4GqSJHCaTY89HLrywpt13',
  otherUser: 'LLyi0mw1IuaFX1AZeCYP0NcWdL83',
  enemyUsername: '',
  hostTimeLeft: 0,
  otherTimeLeft: 0,
  isHostWhite: true,
  lastPlayerMoved: '',
  currentTimerID: 'MqLnzN7nT1tO4khNvV1n'
}

export default {
  state,
  getters,
  actions,
  mutations
}
