const getters = {
  getEntireBoard: state => state.cells,
  getWhiteCount: state => state.nWhiteCount,
  getBlackCount: state => state.nBlackCount,
  getFirstClick: state => state.firstClick
}

export default getters
