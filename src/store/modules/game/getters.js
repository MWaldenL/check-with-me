const getters = {
  getCurrentGame: state => state.currentGameID,
  getHostUser: state => state.hostUser,
  getOtherUser: state => state.otherUser,
  getEnemyUsername: state => state.enemyUsername,
  getHostTimeLeft: state => state.hostTimeLeft,
  getOtherTimeLeft: state => state.otherTimeLeft,
  getIsHostWhite: state => state.isHostWhite
}

export default getters
