const mutations = {
  setCurrentGame(state, gameID) {
    state.currentGameID = gameID
  },

  setHostUser(state, uid) {
    state.hostUser = uid
  },

  setOtherUser(state, uid) {
    state.otherUser = uid
  },
  
  setEnemyUsername(state, username) {
    state.enemyUsername = username
  },

  setHostTimeLeft(state, time) {
    state.hostTimeLeft = time
  },

  setOtherTimeLeft(state, time) {
    state.otherTimeLeft = time
  },
  
  setHostIsWhite(state, isWhite) {
    state.isHostWhite = isWhite
  }
}

export default mutations