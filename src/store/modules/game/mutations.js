const mutations = {
  mInitializeGame(state, gameDetails) {
    const { 
      roomID, 
      host_user,
      other_user,
      timer_id,
      is_host_white
    } = gameDetails

    state.boardState = '[FEN "O:W1,3,5,7,10,12,14,16,17,19,21,23:B42,44,46,48,49,51,53,55,58,60,62,64"]'
    state.currentGameID = roomID
    state.currentTimerID = timer_id.id
    state.hostUser = host_user
    state.otherUser = other_user
    state.isHostWhite = is_host_white
  },

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