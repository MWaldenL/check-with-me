const board = new Array(8).fill(null).map(() => Array(8))
for (let r = 0; r < 8; r++) {
  for (let c = 0; c < 8; c++) {
    // initialize empty cell
    const cell = {
      nRow: r + 1, // nRow number 1-8, 1 is bottom
      nCol: c + 1, // column number 1-8, 1 is leftmost
      bHasBlackChip: false, // boolean
      bHasWhiteChip: false // boolean
    }

    if (cell.nRow >= 6 && ((cell.nCol % 2 === 1 && cell.nRow % 2 === 1) || (cell.nCol % 2 === 0 && cell.nRow % 2 === 0))) {
      // put black chip
      cell.bHasBlackChip = true
    } else if (cell.nRow <= 3 && ((cell.nCol % 2 === 1 && cell.nRow % 2 === 1) || (cell.nCol % 2 === 0 && cell.nRow % 2 === 0))) {
      // put white chip
      cell.bHasWhiteChip = true
    }

    board[r][c] = cell
  }
}

const state = {
  cells: board,
  nWhiteCount: 12,
  nBlackCount: 12
}

const getters = {
  getEntireBoard: state => state.cells,
  getWhiteCount: state => state.nWhiteCount,
  getBlackCount: state => state.nBlackCount
}

const actions = {
  /*
    aMoveForward moves a black or white chip to an empty cell 1 space diagonally

    @param nRow - 1-based row of active cell with piece to move
    @param nCol - 1-based column of active cell with piece to move
    @param nDestRow - 1-based row of empty destination cell
    @param nDestCol - 1-based column of empty destination cell
    */
  aMoveForward ({ commit }, nRow, nCol, nDestRow, nDestCol) {
    const newCurr = {
      nRow: nRow,
      nCol: nCol,
      bHasBlackChip: false,
      bHasWhiteChip: false
    }
    const newDest = {
      nRow: nDestRow,
      nCol: nDestCol,
      bHasBlackChip: false,
      bHasWhiteChip: false
    }
    let bIsValid = false
    const bIsOpen = !(state.cells[nDestRow - 1][nDestCol - 1].bHasBlackChip || state.cells[nDestRow - 1][nDestCol - 1].bHasWhiteChip)
    const bIsDiagonal = nCol - 1 === nDestCol || nCol + 1 === nDestCol

    if (bIsOpen && bIsDiagonal && state.cells[nRow - 1][nCol - 1].bHasBlackChip === true && nRow - 1 === nDestRow) {
      bIsValid = true
      newDest.bHasBlackChip = true
    } else if (bIsOpen && bIsDiagonal && state.cells[nRow - 1][nCol - 1].bHasWhiteChip === true && nRow + 1 === nDestRow) {
      bIsValid = true
      newDest.bHasWhiteChip = true
    }

    if (bIsValid) {
      commit('mMoveForward', newCurr, newDest)
    }
  }
}

const mutations = {
  mMoveForward: (state, newCurr, newDest) => {
    state.cells[newCurr.nRow - 1][newCurr.nCol - 1] = newCurr
    state.cells[newDest.nRow - 1][newDest.nCol - 1] = newDest
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
