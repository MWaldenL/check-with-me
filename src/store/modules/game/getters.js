const getters = {
  getCurrentGame: state => state.currentGameID,
  getBoardState: state => state.boardState,
  getHostUser: state => state.hostUser,
  getOtherUser: state => state.otherUser,
  getEnemyUsername: state => state.enemyUsername,
  getHostTimeLeft: state => state.hostTimeLeft,
  getOtherTimeLeft: state => state.otherTimeLeft,
  getIsHostWhite: state => state.isHostWhite,
  getLastPlayerMoved: state => state.lastPlayerMoved
}

export default getters
