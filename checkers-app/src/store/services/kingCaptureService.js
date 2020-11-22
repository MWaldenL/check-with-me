import {
  bSourceHasBlack,
  bSourceHasWhite,
  bBlackExistsAdj,
  bWhiteExistsAdj,
  bPieceExistsAfterAdj
} from './moveCaptureService'

export const bExistsOnTopLeft = (board, coords, pieceExists) => {
  let prevRow = srcRow
  let prevCol = srcCol

  for (let i = srcRow; i < destRow; i++) {
    for (let j = srcCol; i >= destCol; j--) {
      if ( i == prevRow + 1 && j == prevCol - 1 ) {
        if ( pieceExists(board[i-1][j-1], coords) ) {
          return true
        }
        prevRow = i
        prevCol = j
      }
    }
  }      

  return false
}

export const bExistsOnTopRight = () => {
  // Walk the diagonal until a black piece is seen
  for (let i = srcRow; i < destRow; i++) {
    if ( bBlackExistsAdj(board[i-1][i-1], coords) ) {
      return true
    }
  }      

  return false
}
export const bExistsOnBottomLeft = () => {}
export const bExistsOnBottomRight = () => {}

export const bBlackExistsInDiagonal = (board, coords, pieceExists) => {
  // coords = {nrow, ncol, ndestrow, ndestcol}
  let srcRow = coords.nRow
  let srcCol = coords.nCol
  let destRow = coords.nDestRow
  let destCol = coords.nDestCol

  const bTopLeft = srcRow < destRow && srcCol > destCol
  const bTopRight = srcRow < destRow && srcCol < destCol
  const bBottomLeft = srcRow > destRow && srcCol > destCol
  const bBottomRight = srcRow > destRow && srcCol < destCol

  const bFoundBlackPiece = false

  // Check top right diag
  if (bTopRight) {

  } else if (bTopLeft) {
    return bExistsOnTopLeft(board, coords, pieceExists)
  } else if (bBottomRight) {
    let prevRow = srcRow
    let prevCol = srcCol

    for (let i = srcRow; i < destRow; i++) {
      for (let j = srcCol; i >= destCol; j--) {
        if ( i == prevRow + 1 && j == prevCol - 1 ) {
          if ( bBlackExistsAdj(board[i-1][j-1], coords) ) {
            return true
          }
          prevRow = i
          prevCol = j
        }
      }
    }      

    return false
  } else if (bBottomLefts) {
    let prevRow = srcRow
    let prevCol = srcCol

    for (let i = srcRow; i < destRow; i++) {
      for (let j = srcCol; i >= destCol; j--) {
        if ( i == prevRow + 1 && j == prevCol - 1 ) {
          if ( bBlackExistsAdj(board[i-1][j-1], coords) ) {
            return true
          }
          prevRow = i
          prevCol = j
        }
      }
    }      

    return false
  } 
}
export const bCanCaptureBlack = () => {
  
}