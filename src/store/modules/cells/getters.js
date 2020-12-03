const getters = {
  getEntireBoard: state => state.cells,
  getWhiteCount: state => state.nWhiteCount,
  getBlackCount: state => state.nBlackCount,
  getFirstClick: state => state.firstClick,
  getBlackCells: state => state.filter(cell => cell.bHasBlackChip || cell.bHasBlackKing),
  getWhiteCells: state => state.filter(cell => cell.bHasWhiteChip || cell.bHasWhiteKing)
}

export default getters
