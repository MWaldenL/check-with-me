import {
  bSourceHasBlack, 
  bSourceHasWhite
} from '@/store/services/moveCaptureService'


/**
 * Top 
 */
export const bPieceExistsOnTargetTopLeft = (board, coords, targetPiece) => {
  const srcRow = targetPiece.nRow
  const srcCol = targetPiece.nCol
  const destRow = coords.nDestRow
  const destCol = coords.nDestCol

  let prevRow = srcRow
  let prevCol = srcCol
  let curPos

  // Always check the previous diagonally adjacent square 
  for (let i = srcRow; i <= destRow; i++) {
    for (let j = srcCol; j >= destCol; j--) {
      if ( i === prevRow + 1 && j === prevCol - 1 ) {
        curPos = { nRow: i, nCol: j }
        if (bSourceHasBlack(board, curPos) || bSourceHasWhite(board, curPos)) {
          return true
        }
        prevRow = i
        prevCol = j
      }
    }
  }      
  return false 
}

export const bOtherExistsOnTopLeft = (board, coords, squareHasSameColoredPiece, squareHasOtherColoredPiece) => {
  const srcRow = coords.nRow
  const srcCol = coords.nCol

  if (coords.nDestRow && coords.nDestCol) {
    const destRow = coords.nDestRow
    const destCol = coords.nDestCol

    let prevRow = srcRow
    let prevCol = srcCol
    let curPos

    // Always check the previous diagonally adjacent square 
    for (let i = srcRow; i <= destRow; i++) {
      for (let j = srcCol; j >= destCol; j--) {
        if ( i === prevRow + 1 && j === prevCol - 1 ) {
          curPos = { nRow: i, nCol: j }

          if ( squareHasOtherColoredPiece(board, curPos) ) {
            return {
              targetPiece: { nRow: i, nCol: j },
              pieceExists: true
            }
          } else if ( squareHasSameColoredPiece(board, curPos) ) {
            return { targetPiece: null, pieceExists: false }
          }

          prevRow = i
          prevCol = j
        }
      }
    }      

    return { targetPiece: null, pieceExists: false }
  }

  return { targetPiece: null, pieceExists: false }
}

export const bPieceExistsOnTargetTopRight = (board, coords, targetPiece) => {
  const srcRow = targetPiece.nRow
  const srcCol = targetPiece.nCol
  const destRow = coords.nDestRow

  let prevRow = srcRow
  let prevCol = srcCol
  let curPos

  // Always check the previous diagonally adjacent square 
  for (let i = srcRow; i <= destRow; i++) {
    if ( i === prevRow + 1 && i === prevCol + 1 ) {
      curPos = { nRow: i, nCol: i }
      if (bSourceHasBlack(board, curPos) || bSourceHasWhite(board, curPos)) {
        return true
      }
      prevRow = i
      prevCol = i
    }
  }      
  return false 
}

export const bOtherExistsOnTopRight = (board, coords, squareHasSameColoredPiece, squareHasOtherColoredPiece) => {
  const srcRow = coords.nRow
  const srcCol = coords.nCol

  if (coords.nDestRow && coords.nDestCol) {
    const destRow = coords.nDestRow
    let prevRow = srcRow
    let prevCol = srcCol
    let curPos

    for (let i = srcRow; i <= destRow; i++) {
      if ( i === prevRow + 1 && i === prevCol + 1 ) {
        curPos = { nRow: i, nCol: i }
        if ( squareHasOtherColoredPiece(board, curPos) ) {
          return {
            targetPiece: { nRow: i, nCol: i },
            pieceExists: true
          }
        } else if ( squareHasSameColoredPiece(board, curPos) ) {
          return { targetPiece: null, pieceExists: false }
        }

        prevRow = i
        prevCol = i
      }
    }
    return { targetPiece: null, pieceExists: false }
  }
  return { targetPiece: null, pieceExists: false }
}

/**
 * Bottom
 */
export const bPieceExistsOnBottomLeft = (board, coords, squareHasSameColoredPiece, squareHasOtherColoredPiece) => {
  const srcRow = coords.nRow
  const srcCol = coords.nCol

  if (coords.nDestRow && coords.nDestCol) {
    const destRow = coords.nDestRow
    const destCol = coords.nDestCol
    let prevRow = srcRow
    let prevCol = srcCol
    let curPos

    for (let i = srcRow; i >= destRow; i--) {
      for (let j = srcCol; i >= destCol; j--) {
        if ( i === prevRow - 1 && j === prevCol - 1 ) {
          curPos = { nRow: i, nCol: j }
          if ( squareHasOtherColoredPiece(board, curPos) ) {
            return {
              targetPiece: { nRow: i, nCol: i },
              pieceExists: true
            }
          } else if ( squareHasSameColoredPiece(board, curPos) ) {
            return { targetPiece: null, pieceExists: false }
          } 

          prevRow = i
          prevCol = j
        }
      }
    }      
    return { targetPiece: null, pieceExists: false }
  } 
  return { targetPiece: null, pieceExists: false }
}

export const bPieceExistsOnBottomRight = (board, coords, pieceExistsAdj) => {
  const srcRow = coords.nRow
  const srcCol = coords.nCol

  if (coords.nDestRow && coords.nDestCol) {
    const destRow = coords.nDestRow
    const destCol = coords.nDestCol
    let prevRow = srcRow
    let prevCol = srcCol
    let curPos

    for (let i = srcRow; i <= destRow; i++) {
      for (let j = srcCol; i >= destCol; j--) {
        if ( i === prevRow - 1 && j === prevCol + 1 ) {
          curPos = { nRow: i, nCol: j }
          if ( squareHasOtherColoredPiece(board, curPos) ) {
            return {
              targetPiece: { nRow: i, nCol: i },
              pieceExists: true
            }
          } else if ( squareHasSameColoredPiece(board, curPos) ) {
            return { targetPiece: null, pieceExists: false }
          }
          
          prevRow = i
          prevCol = j
        }
      }
    }      
    return { targetPiece: null, pieceExists: false }
  }
  return { targetPiece: null, pieceExists: false }
}



export const bOtherExistsAfterSource = (board, coords, squareHasSameColoredPiece, squareHasOtherColoredPiece) => {
  // coords = {nrow, ncol, ndestrow, ndestcol}
  const bTopLeft = coords.nRow < coords.nDestRow && coords.nCol > coords.nDestCol
  const bTopRight = coords.nRow < coords.nDestRow && coords.nCol < coords.nDestCol

  if (bTopLeft) {
    return bOtherExistsOnTopLeft(board, coords, squareHasSameColoredPiece, squareHasOtherColoredPiece)
  } else if (bTopRight) {
    return bOtherExistsOnTopRight(board, coords, squareHasSameColoredPiece, squareHasOtherColoredPiece)
  }
}

export const bPieceExistsBetweenTargetAndDest = (board, coords, targetPiece) => {
  const bTopLeft = targetPiece.nRow < coords.nDestRow && targetPiece.nCol > coords.nDestCol
  const bTopRight = targetPiece.nRow < coords.nDestRow && targetPiece.nCol < coords.nDestCol

  // Check top right diag
  if (bTopLeft) {
    return bPieceExistsOnTargetTopLeft(board, coords, targetPiece)
  } else if (bTopRight) {
    return bPieceExistsOnTargetTopRight(board, coords, targetPiece)
  }
}   

export const bIsValidCapture = (board, coords, color) => {
  if (color === 'white') {
    let checkOther = bOtherExistsAfterSource(board, coords, bSourceHasWhite, bSourceHasBlack)
    let targetPiece = checkOther.targetPiece

    return checkOther.pieceExists && 
      !bPieceExistsBetweenTargetAndDest(board, coords, targetPiece)
  } else {
    let checkOther = bOtherExistsAfterSource(board, coords, bSourceHasBlack, bSourceHasWhite)
    let targetPiece = checkOther.targetPiece

    return checkOther.pieceExists && 
      !bPieceExistsBetweenTargetAndDest(board, coords, targetPiece)
  }
}