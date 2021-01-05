import {
  bSourceHasBlack,
  bSourceHasWhite,
  bPieceExistsAdj,
  bPieceExistsAfterAdj,
  bNoBlackJumps,
  bNoWhiteJumps
} from '../../services/moveCaptureService'

import {
  getPossibleMoves,
  getPossibleMoveBlackKing,
  getPossibleMoveWhiteKing
} from '../../services/highlightService'

import { getBoardFromPDN } from '../../services/boardParsingService'
import { bIsValidCapture } from '../../services/kingCaptureService'
import { getBoard } from '../board'

const helpers = {
  handleValidMove: (state, newCurr, newDest, adjacent) => {
    // Perform a deep copy for board updating
    const boardClone = JSON.parse(JSON.stringify(state.cells))

    boardClone[newCurr.nRow - 1][newCurr.nCol - 1] = newCurr
    boardClone[newDest.nRow - 1][newDest.nCol - 1] = newDest
    if (adjacent) {
      boardClone[adjacent.nRow - 1][adjacent.nCol - 1] = adjacent
    }

    // Update the state
    state.cells = boardClone
    state.firstClick = null
    mutations.mUnhighlight(state)
  },

  handleIllegalMove: (state, coords) => {
    // Signal the cell component that the last move was illegal
    state.bLastMoveLegal = false

    const bDestHasWhite = state.cells[coords.nDestRow - 1][coords.nDestCol - 1].bHasWhiteChip
    const bDestHasBlack = state.cells[coords.nDestRow - 1][coords.nDestCol - 1].bHasBlackChip
    const bSrcDestBlack = bSourceHasBlack(state.cells, coords) && bDestHasBlack
    const bSrcDestWhite = bSourceHasWhite(state.cells, coords) && bDestHasWhite

    const bDestHasWhiteKing = state.cells[coords.nDestRow - 1][coords.nDestCol - 1].bHasWhiteKing
    const bDestHasBlackKing = state.cells[coords.nDestRow - 1][coords.nDestCol - 1].bHasBlackKing

    // If both the source and destination pieces have the same color -
    // this happens when clicking on a piece followed by clicking another
    // same-colored piece adjacent to it, highlight the new piece
    if (bSrcDestBlack || bSrcDestWhite) {
      let newCoords = {
        nRow: coords.nDestRow,
        nCol: coords.nDestCol,
        bHasWhiteChip: bDestHasWhite,
        bHasBlackChip: bDestHasBlack,
        bHasWhiteKing: bDestHasWhiteKing,
        bHasBlackKing: bDestHasBlackKing
      }
      mutations.mUnhighlight(state)
      state.firstClick = newCoords
      mutations.mHighlight(state, newCoords)
    } else { // Otherwise, simply unhighlight the square
      mutations.mUnhighlight(state)
    }
  }
}

const mutations = {
  mUnhighlight: state => {
    // Perform a deep copy for board updating
    const boardClone = JSON.parse(JSON.stringify(state.cells))

    // Reset all cells' highlight states 
    for (let i in boardClone) {
      for (let j in boardClone[i]) {
        boardClone[i][j].isPossibleMove = false
        boardClone[i][j].isPossibleCapture = false
        boardClone[i][j].isHighlighted = false
      }
    }

    // Update states
    state.cells = boardClone
    state.firstClick = null
  },

  mHighlight: (state, coords) => {
    // If there is already a previously highlighted square, cancel it 
    if (state.firstClick !== null) {
      mutations.mUnhighlight(state)
      state.firstClick = null
    }

    // Set the first click to the current square clicked 
    state.firstClick = coords

    // Perform a deep copy for board updating
    const boardClone = JSON.parse(JSON.stringify(state.cells))

    // Highlight the source cell
    const srcCell = boardClone[coords.nRow - 1][coords.nCol - 1]
    srcCell.isHighlighted = true

    // Fetch and store legal squares 
    let aPossibleCells = []
    let isWhite = true
    if (srcCell.bHasWhiteKing) {
      aPossibleCells = getPossibleMoveWhiteKing(boardClone, coords.nRow, coords.nCol)
    } else if (srcCell.bHasBlackKing) {
      aPossibleCells = getPossibleMoveBlackKing(boardClone, coords.nRow, coords.nCol)
    } else if (srcCell.bHasWhiteChip) {
      aPossibleCells = getPossibleMoves(boardClone, coords.nRow, coords.nCol, isWhite)
    } else if (srcCell.bHasBlackChip) {
      aPossibleCells = getPossibleMoves(boardClone, coords.nRow, coords.nCol, !isWhite)
    }

    // Set these legal squares on the square object
    for (const array of aPossibleCells) {
      if (array[2] === 0) {
        boardClone[array[0]][array[1]].isPossibleMove = true
      } else { 
        boardClone[array[0]][array[1]].isPossibleCapture = true
      }
    }

    // Update the board state
    state.cells = boardClone
  },

  mMoveForward: (state, coords) => {
    // If the move is within the board's range
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

      let bIsValidMove = false

      // Check for adjacent squares
      const destCell = state.cells[coords.nDestRow - 1][coords.nDestCol - 1]
      const bIsSquareOpen = !(destCell.bHasBlackChip || destCell.bHasWhiteChip)
      const bIsColAdjacent = coords.nCol - 1 === coords.nDestCol || coords.nCol + 1 === coords.nDestCol
      const bNextRowAbove = coords.nRow + 1 === coords.nDestRow
      const bLastRowAbove = coords.nDestRow === 8

      // Check if a destination square is immediately diagonally adjacent
      // and place the corresponding pieces
      if (bIsSquareOpen && bNextRowAbove && bIsColAdjacent) {
        bIsValidMove = true
        if (bSourceHasWhite(state.cells, coords)) {
          newDest.bHasWhiteChip = true
          if (bLastRowAbove) {
            newDest.bHasWhiteKing = true
          }
        } else if (bSourceHasBlack(state.cells, coords)) {
          newDest.bHasBlackChip = true
          if (bLastRowAbove) {
            newDest.bHasBlackKing = true
          }
        }
      }

      // Check if the move is valid
      if (bIsValidMove) {
        helpers.handleValidMove(state, coords, newCurr, newDest)
      } else {
        helpers.handleIllegalMove(state, coords)
      }
    }
  },

  mKingMovement: (state, coords) => {
    // If the move is within the board's range
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

      let bIsValidKingMove = false

      // Check for adjacent squares
      const srcCell = state.cells[coords.nRow - 1][coords.nCol - 1]
      const destCell = state.cells[coords.nDestRow - 1][coords.nDestCol - 1]
      const bIsSquareOpen = !(destCell.bHasBlackChip || destCell.bHasWhiteChip)

      // Check if the source square has a piece at all
      const _bSourceHasBlack = srcCell.bHasBlackChip
      const _bSourceHasBlackKing = srcCell.bHasBlackKing
      const _bSourceHasWhite = srcCell.bHasWhiteChip
      const _bSourceHasWhiteKing = srcCell.bHasWhiteKing

      // Check if the movement is on the diagonal
      const xDiff = Math.abs(coords.nCol - coords.nDestCol)
      const yDiff = Math.abs(coords.nRow - coords.nDestRow)
      const bOnDiagonal = xDiff === yDiff

      // Check for jumps
      const bDoesNoBlackJumps = bNoBlackJumps(state.cells, coords)
      const bDoesNoWhiteJumps = bNoWhiteJumps(state.cells, coords)

      if (bIsSquareOpen && _bSourceHasBlack && _bSourceHasBlackKing && bDoesNoBlackJumps && bDoesNoWhiteJumps && bOnDiagonal) {
        bIsValidKingMove = true
        newDest.bHasBlackChip = true
        newDest.bHasBlackKing = true
      } else if (bIsSquareOpen && _bSourceHasWhite && _bSourceHasWhiteKing && bDoesNoBlackJumps && bDoesNoWhiteJumps && bOnDiagonal) {
        bIsValidKingMove = true
        newDest.bHasWhiteChip = true
        newDest.bHasWhiteKing = true
      }

      // Check if the move is valid
      if (bIsValidKingMove) {
        helpers.handleValidMove(state, newCurr, newDest)
      } else {
        helpers.handleIllegalMove(state, coords)
      }
    }
  },

  mCapturePiece: (state, coords) => {
    const newCurr = {
      nRow: coords.nRow,
      nCol: coords.nCol,
      bHasBlackChip: false,
      bHasWhiteChip: false,
      bHasBlackKing: false,
      bHasWhiteKing: false
    }

    const adjacent = {
      nRow: Math.floor((coords.nRow + coords.nDestRow) / 2),
      nCol: Math.floor((coords.nCol + coords.nDestCol) / 2),
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

    let bIsValidCapture = false

    // Check surrounding rows
    const bNextRowAbove = coords.nRow + 2 === coords.nDestRow
    const bLastRowAbove = coords.nDestRow === 8

    // Check if white and black can capture
    const isWhite = true
    const bWhiteCanCapture = bSourceHasWhite(state.cells, coords) && bPieceExistsAdj(state.cells, coords, isWhite) && bNextRowAbove
    const bBlackCanCapture = bSourceHasBlack(state.cells, coords) && bPieceExistsAdj(state.cells, coords, !isWhite) && bNextRowAbove

    // A piece can make a capture if the following conditions are met:
    // 1. An opposing piece exists diagonally adjacent to the current piece
    // 2. There is no piece of any color diagonally adjacent to the target piece
    let whiteTakes = true
    if (!bPieceExistsAfterAdj(state.cells, coords)) {
      if (bWhiteCanCapture) {
        bIsValidCapture = true
        console.log("white can capture")
        newDest.bHasWhiteChip = true
        if (bLastRowAbove) {
          newDest.bHasWhiteKing = true
        }
        mutations.mReducePiece(state, whiteTakes)
      } else if (bBlackCanCapture) {
        bIsValidCapture = true
        console.log("black can capture")
        newDest.bHasBlackChip = true
        if (bLastRowAbove) {
          newDest.bHasBlackKing = true
        }
        mutations.mReducePiece(state, !whiteTakes)
      }
    }

    if (bIsValidCapture) {
      console.log('valid capture')
      helpers.handleValidMove(state, newCurr, newDest, adjacent)
    } else {
      console.log('invalidCapture')
      helpers.handleIllegalMove(state, coords)
    }
  },

  mKingCapturePiece: (state, coords) => {
    const newCurr = {
      nRow: coords.nRow,
      nCol: coords.nCol,
      bHasWhiteChip: false,
      bHasBlackChip: false,
      bHasWhiteKing: false,
      bHasBlackKing: false
    }

    const newDest = {
      nRow: coords.nDestRow,
      nCol: coords.nDestCol,
      bHasWhiteChip: false,
      bHasBlackChip: false,
      bHasWhiteKing: false,
      bHasBlackKing: false
    }

    // Set color depending on the source square
    let color
    if (bSourceHasWhite(state.cells, coords)) {
      color = 'white'
    } else if (bSourceHasBlack(state.cells, coords)) {
      color = 'black'
    }

    // isValidCapture returns a boolean and a newTarget coordinate tuple
    const result = bIsValidCapture(state.cells, coords, color)
    if (result.validCapture) {
      if (bSourceHasWhite(state.cells, coords)) {
        newDest.bHasWhiteChip = true
        newDest.bHasWhiteKing = true
        mutations.mReducePiece(state, true)
      } else if (bSourceHasBlack(state.cells, coords)) {
        newDest.bHasBlackChip = true
        newDest.bHasBlackKing = true
        mutations.mReducePiece(state, false)
      }

      const newTarget = {
        ...result.targetPiece,
        bHasWhiteChip: false,
        bHasBlackChip: false,
        bHasWhiteKing: false,
        bHasBlackKing: false
      }

      helpers.handleValidMove(state, newCurr, newDest, newTarget)
    }
  },

  mUpdateBoard: (state, payload) => {
    const { boardState, playerIsBlack } = payload
    state.cells = getBoardFromPDN(boardState, playerIsBlack)
  },

  mReducePiece: (state, whiteTakes) => {
    if (!whiteTakes) {
      state.nWhiteCount--
    } else {
      state.nBlackCount--
    }
  },

  mSetActiveGame: (state, bIsActive) => {
    state.bActiveGame = bIsActive
  },

  mResetGame: (state) => {
    state.cells = getBoard()
    state.nWhiteCount = 12
    state.nBlackCount = 12
    state.firstClick = null
    state.bActiveGame = true
    state.cWinner = 'N'
  },

  mSetWinner: (state, winner) => {
    state.cWinner = winner
  }
}

export default mutations
