export const pieceGettingCaptured = null

/**
 * bPieceExists group of functions: 
 * @param board - the board state instance
 * @param coords - can take either of the following forms:
 *      { nRow, nCol, nDestRow, nDestCol }, or { nRow, nCol }.
 *      The former is used for actual movements, and the latter is used for dealing 
 *      with single squares.
 * @param pieceExistsAdj - a higher-order boolean function that checks for whether 
 *      a piece exists adjacent to the given square. This can either be
 *      the bBlackExistsAdj or the bWhiteExistsAdj function from the moveCaptureService
 */

export const bPieceExistsOnTopRight = (board, coords, pieceExistsAdj) => {
  const srcRow = coords.nRow
  const srcCol = coords.nCol
  let curPos

  if (coords.nDestRow && coords.nDestCol) {
    const destRow = coords.nDestRow
    for (let i = srcRow; i < destRow; i++) {
      curPos = { nRow: i, nCol: j }
      if ( squareHasSameColoredPiece(board, curPos) ) {
        return false
      } else if ( squareHasOtherColoredPiece(board, curPos) ) {
        pieceGettingCaptured = { nRow: i - 1, nCol: j - 1 }
        return true
      }
    }
    return false
  } else {
    return pieceExistsAdj(board[srcRow - 1][srcCol - 1], coords)
  }
}
export const bPieceExistsOnBottomLeft = (board, coords, squareHasSameColoredPiece, squareHasOtherColoredPiece) => {
  const srcRow = coords.nRow
  const srcCol = coords.nCol

  if (coords.nDestRow && coords.nDestCol) {
    const destRow = coords.nDestRow
    const destCol = coords.nDestCol
    let prevRow = srcRow
    let prevCol = srcCol

    for (let i = srcRow - 1; i >= destRow; i--) {
      for (let j = srcCol - 1; i >= destCol; j--) {
        if ( i === prevRow - 1 && j === prevCol - 1 ) {
          curPos = { nRow: i, nCol: j }
          if ( squareHasSameColoredPiece(board, curPos) ) {
            return false
          } else if ( squareHasOtherColoredPiece(board, curPos) ) {
            pieceGettingCaptured = { nRow: i - 1, nCol: j - 1 }
            return true
          }

          prevRow = i
          prevCol = j
        }
      }
    }      
    return false
  } else {
    return pieceExistsAdj(board[srcRow - 1][srcCol - 1], coords)
  }
}

export const bPieceExistsOnBottomRight = (board, coords, pieceExistsAdj) => {
  const srcRow = coords.nRow
  const srcCol = coords.nCol

  if (coords.nDestRow && coords.nDestCol) {
    const destRow = coords.nDestRow
    const destCol = coords.nDestCol
    let prevRow = srcRow
    let prevCol = srcCol

    for (let i = srcRow; i < destRow; i++) {
      for (let j = srcCol; i >= destCol; j--) {
        if ( i === prevRow - 1 && j === prevCol + 1 ) {
          curPos = { nRow: i, nCol: j }
          if ( squareHasSameColoredPiece(board, curPos) ) {
            return false
          } else if ( squareHasOtherColoredPiece(board, curPos) ) {
            pieceGettingCaptured = { nRow: i - 1, nCol: j - 1 }
            return true
          }
          
          prevRow = i
          prevCol = j
        }
      }
    }      
    return false
  } else {
    return pieceExistsAdj(board[srcRow - 1][srcCol - 1], coords)
  }
}

/**
 * bOtherPieceAfterSource
 * Checks if there exists an opposing piece diagonally after the source piece.
 * This assumes that the player has clicked on a destination square
 * 
 * @param board - the board state instance
 * @param coords - can take either of the following forms:
 *      { nRow, nCol, nDestRow, nDestCol }, or { nRow, nCol }.
 *      The former is used for actual movements, and the latter is used for dealing 
 *      with single squares.
 * @param pieceExistsAdj - a higher-order boolean function that checks for whether 
 *      a piece exists adjacent to the given square. This can either be
 *      the bBlackExistsAdj or the bWhiteExistsAdj function from the moveCaptureService
 */

 // problem - what if there is another piece after
export const bOtherPieceExistsAfterSource = (board, coords, pieceExistsAdj) => {
  // coords = {nrow, ncol, ndestrow, ndestcol}
  const srcRow = coords.nRow
  const srcCol = coords.nCol
  const destRow = coords.nDestRow
  const destCol = coords.nDestCol

  const bTopLeft = srcRow < destRow && srcCol > destCol
  const bTopRight = srcRow < destRow && srcCol < destCol
  const bBottomLeft = srcRow > destRow && srcCol > destCol
  const bBottomRight = srcRow > destRow && srcCol < destCol

  // Check top right diag
  if (bTopRight) {
    return bPieceExistsOnTopRight(board, coords, pieceExistsAdj)
  } else if (bTopLeft) {
    return bPieceExistsOnTopLeft(board, coords, pieceExistsAdj)
  } else if (bBottomRight) {
    return bPieceExistsOnBottomRight(board, coords, pieceExistsAdj)
  } else if (bBottomLeft) {
    return bPieceExistsOnBottomLeft(board, coords, pieceExistsAdj)
  } 
}

export const bPieceExistsBetweenOtherAndDest = (board, coords, pieceExistsAdj) => {
  const srcRow = coords.nRow
  const srcCol = coords.nCol
  const destRow = coords.nDestRow
  const destCol = coords.nDestCol

  const bTopLeft = srcRow < destRow && srcCol > destCol
  const bTopRight = srcRow < destRow && srcCol < destCol
  const bBottomLeft = srcRow > destRow && srcCol > destCol
  const bBottomRight = srcRow > destRow && srcCol < destCol

  // Check top right diag
  if (bTopRight) {
    return !bPieceExistsOnTopRight(board, coords, pieceExistsAdj)
  } else if (bTopLeft) {
    return !bPieceExistsOnTopLeft(board, coords, pieceExistsAdj)
  } else if (bBottomRight) {
    return !bPieceExistsOnBottomRight(board, coords, pieceExistsAdj)
  } else if (bBottomLeft) {
    return !bPieceExistsOnBottomLeft(board, coords, pieceExistsAdj)
  }
}   

// bOtherPieceExistsAfterSource && !bPieceExistsBetweenOtherAndDest