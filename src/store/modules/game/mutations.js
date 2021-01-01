const mutations = {
  setCurrentGame(state, gameID) {
    state.currentGameID = gameID
  },

  setCurrentBoardState(state, boardState) {
    state.boardState = boardState
  },

  setHostUser(state, uid) {
    state.hostUser = uid
  },

  setOtherUser(state, uid) {
    state.otherUser = uid
  },

  setHostTimeLeft(state, time) {
    state.hostTimeLeft = time
  },

  setOtherTimeLeft(state, time) {
    state.otherTimeLeft = time
  },
  
  setHostIsWhite(state, isWhite) {
    state.isHostWhite = isWhite
  },

  setLastPlayerMoved(state, player) {
    state.lastPlayerMoved = player
  },
}

export default mutations