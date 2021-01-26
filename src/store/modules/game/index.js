import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  currentGameID: '6ZAthUNxdMWjhmph8v1q',
  boardState: '',
  hostUser: 'nkR8RnJ4GqSJHCaTY89HLrywpt13',
  otherUser: 'LLyi0mw1IuaFX1AZeCYP0NcWdL83',
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
