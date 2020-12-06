const getters = {
  getEntireBoard: state => state.cells,
  getWhiteCount: state => state.nWhiteCount,
  getBlackCount: state => state.nBlackCount,
  getFirstClick: state => state.firstClick,
  getActiveGame: state => state.bActiveGame,
  getInactiveGame: state => !state.bActiveGame,
  getWinner: state => state.cWinner
}

export default getters
