import Board from './board'
import {
  bSourceHasBlack,
  bSourceHasWhite,
  bBlackExistsAdj,
  bWhiteExistsAdj,
  bPieceExistsAfterAdj
} from '../services/moveCaptureService'

const state = {
  cells: Board.getBoard(),
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

  /**
   * aMoveForward moves a black or white chip to an empty cell 1 space diagonally
   * @param nRow - 1-based row of active cell with piece to move
   * @param nCol - 1-based column of active cell with piece to move
   * @param nDestRow - 1-based row of empty destination cell
   * @param nDestCol - 1-based column of empty destination cell
   */
  async aMoveForward ({ commit }, coords) {
    commit('mMoveForward', coords)
  },

  /**
   * aCapturePiece moves a black or white chip to capture an opposite-colored piece
   * diagonally adjacent from it.
   *
   * @param coords - an object containing the source and destination coordinates
   */
  async aCapturePiece ({ commit }, coords) {
    commit('mCapturePiece', coords)
  }
}

const mutations = {
  mHighlight: (state, coords) => {
    // TODO: Highlight legal
    state.firstClick = coords
  },

  mMoveForward: (state, coords) => {
    console.log('Mutate ' + coords.nRow + ', ' + coords.nCol)
    if (coords.nDestCol >= 1 && coords.nDestCol <= 8 && coords.nDestRow >= 1 && coords.nDestRow <= 8) {
      const newCurr = {
        nRow: coords.nRow,
        nCol: coords.nCol,
        bHasBlackChip: false,
        bHasWhiteChip: false,
        bHasBlackKing: false,
        bHasWhiteKing: false
      }
      const newDest = {
        nRow: coords.nDestRow,
        nCol: coords.nDestCol,
        bHasBlackChip: false,
        bHasWhiteChip: false,
        bHasBlackKing: false,
        bHasWhiteKing: false
      }

      let bIsValid = false

      const srcCell = state.cells[coords.nRow - 1][coords.nCol - 1]
      const destCell = state.cells[coords.nDestRow - 1][coords.nDestCol - 1]

      const bIsSquareOpen = !(destCell.bHasBlackChip || destCell.bHasWhiteChip)
      const bIsColLeftOrRight = coords.nCol - 1 === coords.nDestCol || coords.nCol + 1 === coords.nDestCol

      const bSourceHasBlack = srcCell.bHasBlackChip
      const bNextRowBelow = coords.nRow - 1 === coords.nDestRow
      const bLastRowBelow = coords.nDestRow === 1
      const bSourceHasWhite = srcCell.bHasWhiteChip
      const bNextRowAbove = coords.nRow + 1 === coords.nDestRow
      const bLastRowAbove = coords.nDestRow === 8

      if (bIsSquareOpen && bIsColLeftOrRight && bSourceHasBlack && bNextRowBelow && bLastRowBelow) {
        bIsValid = true
        newDest.bHasBlackChip = true
        newDest.bHasBlackKing = true
      } else if (bIsSquareOpen && bIsColLeftOrRight && bSourceHasWhite && bNextRowAbove && bLastRowAbove) {
        bIsValid = true
        newDest.bHasWhiteChip = true
        newDest.bHasWhiteKing = true
      } else if (bIsSquareOpen && bIsColLeftOrRight && bSourceHasBlack && bNextRowBelow) {
        bIsValid = true
        newDest.bHasBlackChip = true
      } else if (bIsSquareOpen && bIsColLeftOrRight && bSourceHasWhite && bNextRowAbove) {
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
  },

  mCapturePiece: (state, coords) => {
    const newCur = {
      nRow: coords.nRow,
      nCol: coords.nCol,
      bHasBlackChip: false,
      bHasWhiteChip: false
    }

    const adjacent = {
      nRow: Math.floor((coords.nRow + coords.nDestRow) / 2),
      nCol: Math.floor((coords.nCol + coords.nDestCol) / 2),
      bHasBlackChip: false,
      bHasWhiteChip: false
    }

    const newDest = {
      nRow: coords.nDestRow,
      nCol: coords.nDestCol,
      bHasBlackChip: false,
      bHasWhiteChip: false
    }

    let bIsValidCapture = false
    const bNextRowBelow = coords.nRow - 2 === coords.nDestRow
    const bNextRowAbove = coords.nRow + 2 === coords.nDestRow
    const bWhiteCanCapture = bSourceHasWhite(state.cells, coords) && bBlackExistsAdj(state.cells, coords) && bNextRowAbove
    const bBlackCanCapture = bSourceHasBlack(state.cells, coords) && bWhiteExistsAdj(state.cells, coords) && bNextRowBelow

    if (bWhiteCanCapture) {
      if (!bPieceExistsAfterAdj(state.cells, coords)) {
        bIsValidCapture = true
        newDest.bHasWhiteChip = true
      }
    } else if (bBlackCanCapture) {
      if (!bPieceExistsAfterAdj(state.cells, coords)) {
        bIsValidCapture = true
        newDest.bHasBlackChip = true
      }
    }

    if (bIsValidCapture) {
      const stateClone = JSON.parse(JSON.stringify(state.cells))

      stateClone[newCur.nRow - 1][newCur.nCol - 1] = newCur
      stateClone[adjacent.nRow - 1][adjacent.nCol - 1] = adjacent
      stateClone[newDest.nRow - 1][newDest.nCol - 1] = newDest

      state.cells = stateClone
    }

    state.firstClick = null
  }

}

export default {
  state,
  getters,
  actions,
  mutations
}
