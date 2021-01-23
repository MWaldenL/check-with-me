const mutations = {
  mSetCurrentGame(state, gameID) {
    state.currentGameID = gameID
  },

  mSetHostUser(state, uid) {
    state.hostUser = uid
  },

  mSetOtherUser(state, uid) {
    state.otherUser = uid
  },
  
  mSetEnemyUsername(state, username) {
    state.enemyUsername = username
  },

  mSetHostTimeLeft(state, time) {
    state.hostTimeLeft = time
  },

  mSetOtherTimeLeft(state, time) {
    state.otherTimeLeft = time
  },
  
  mSetHostIsWhite(state, isWhite) {
    state.isHostWhite = isWhite
  }
}

export default mutations