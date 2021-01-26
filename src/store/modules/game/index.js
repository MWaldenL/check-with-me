import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  currentGameID: 'VUqGnWBLmgulz3X5O13h',
  boardState: '',
  hostUser: 'nkR8RnJ4GqSJHCaTY89HLrywpt13',
  otherUser: 'LLyi0mw1IuaFX1AZeCYP0NcWdL83',
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
