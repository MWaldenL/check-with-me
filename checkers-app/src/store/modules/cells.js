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
  nBlackCount: 12,
  firstClick: null
}

const getters = {
  getEntireBoard: state => state.cells,
  getWhiteCount: state => state.nWhiteCount,
  getBlackCount: state => state.nBlackCount,
  getFirstClick: state => state.firstClick
}

const actions = {
  async aHighlight ({ commit }, coords) {
    commit('mHighlight', coords)
  },
  /*
    aMoveForward moves a black or white chip to an empty cell 1 space diagonally

    @param nRow - 1-based row of active cell with piece to move
    @param nCol - 1-based column of active cell with piece to move
    @param nDestRow - 1-based row of empty destination cell
    @param nDestCol - 1-based column of empty destination cell
    */
  async aMoveForward ({ commit }, coords) {
    console.log('Action ' + coords.nRow + ', ' + coords.nCol + ' to ' + coords.nDestRow + ', ' + coords.nDestCol)

    commit('mMoveForward', coords)
  }
}

const mutations = {
  mHighlight: (state, coords) => {
    // check if has moves
    /*
    bIsOpenLeft =
    bIsOpenRight =

    if(bIsOpenLeft || bIsOpenRight)
      */
    state.firstClick = coords
  },
  mMoveForward: (state, coords) => {
    console.log('Mutate ' + coords.nRow + ', ' + coords.nCol)
    if (coords.nDestCol >= 1 && coords.nDestCol <= 8 && coords.nDestRow >= 1 && coords.nDestRow <= 8) {
      const newCurr = {
        nRow: coords.nRow,
        nCol: coords.nCol,
        bHasBlackChip: false,
        bHasWhiteChip: false
      }
      const newDest = {
        nRow: coords.nDestRow,
        nCol: coords.nDestCol,
        bHasBlackChip: false,
        bHasWhiteChip: false
      }

      let bIsValid = false
      const bIsOpen = !(state.cells[coords.nDestRow - 1][coords.nDestCol - 1].bHasBlackChip || state.cells[coords.nDestRow - 1][coords.nDestCol - 1].bHasWhiteChip)
      const bIsDiagonal = coords.nCol - 1 === coords.nDestCol || coords.nCol + 1 === coords.nDestCol

      if (bIsOpen && bIsDiagonal && state.cells[coords.nRow - 1][coords.nCol - 1].bHasBlackChip === true && coords.nRow - 1 === coords.nDestRow) {
        bIsValid = true
        newDest.bHasBlackChip = true
      } else if (bIsOpen && bIsDiagonal && state.cells[coords.nRow - 1][coords.nCol - 1].bHasWhiteChip === true && coords.nRow + 1 === coords.nDestRow) {
        bIsValid = true
        newDest.bHasWhiteChip = true
      }

      if (bIsValid) {
        const stateClone = JSON.parse(JSON.stringify(state.cells))

        stateClone[newCurr.nRow - 1][newCurr.nCol - 1] = newCurr
        stateClone[newDest.nRow - 1][newDest.nCol - 1] = newDest

        state.cells = stateClone
      }
      state.firstClick = null
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
