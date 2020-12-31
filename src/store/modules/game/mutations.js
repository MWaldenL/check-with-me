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
  
  setHostIsWhite(state, isWhite) {
    state.isHostWhite = isWhite
  },

  setLastPlayerMoved(state, player) {
    state.lastPlayerMoved = player
  },
}

export default mutations