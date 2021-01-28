const mutations = {
  mInitializeGame(state, gameDetails) {
    const { 
      roomID, 
      host_user,
      other_user,
      timer_id,
      is_host_white,
      last_player_moved
    } = gameDetails

    state.boardState = '[FEN "O:W1,3,5,7,10,12,14,16,17,19,21,23:B42,44,46,48,49,51,53,55,58,60,62,64"]'
    state.currentGameID = roomID
    state.currentTimerID = timer_id.id
    state.hostUser = host_user
    state.otherUser = other_user
    state.isHostWhite = is_host_white
    state.lastPlayerMoved = last_player_moved.id
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
  },

  mClearGameState(state) {
    state.currentGameID = '',
    state.timerID = '',
    state.boardState = '',
    state.hostUser = '',
    state.otherUser = '',
    state.enemyUsername = '',
    state.hostTimeLeft = 0,
    state.otherTimeLeft = 0,
    state.isHostWhite = true,
    state.lastPlayerMoved = '',
    state.drawCounter = 0
  },

  mInitGame(state, { roomID, boardState, hostUser, otherUser, isHostWhite, lastPlayerMoved, timerID, timeLeft }) {
    state.currentGameID = roomID,
    state.timerID = timerID,
    state.boardState = boardState,
    state.hostUser = hostUser,
    state.otherUser = otherUser,
    state.enemyUsername = '',
    state.hostTimeLeft = timeLeft,
    state.otherTimeLeft = timeLeft,
    state.isHostWhite = isHostWhite,
    state.lastPlayerMoved = lastPlayerMoved,
    state.drawCounter = 0
  }
}

export default mutations