import {
  bSourceHasBlack,
  bSourceHasWhite
} from '@/store/services/moveCaptureService'

/**
 * Top Left
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
      if (i === prevRow + 1 && j === prevCol - 1) {
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

/**
 * Top Right
 */
export const bPieceExistsOnTargetTopRight = (board, coords, targetPiece) => {
  const srcRow = targetPiece.nRow
  const srcCol = targetPiece.nCol
  const destRow = coords.nDestRow
  const destCol = coords.nDestCol

  let prevRow = srcRow
  let prevCol = srcCol
  let curPos

  // Always check the previous diagonally adjacent square 
  for (let i = srcRow; i <= destRow; i++) {
    for (let j = srcCol; j <= destCol; j++) {
      if ( i === prevRow + 1 && j === prevCol + 1 ) {
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

export const bOtherExistsOnTopRight = (board, coords, squareHasSameColoredPiece, squareHasOtherColoredPiece) => {
  const srcRow = coords.nRow
  const srcCol = coords.nCol

  if (coords.nDestRow && coords.nDestCol) {
    const destRow = coords.nDestRow
    const destCol = coords.nDestCol
    let prevRow = srcRow
    let prevCol = srcCol
    let curPos

    for (let i = srcRow; i <= destRow; i++) {
      for (let j = srcCol; j <= destCol; j++) {
        if ( i === prevRow + 1 && j === prevCol + 1 ) {
          curPos = { nRow: i, nCol: j }
          if ( squareHasOtherColoredPiece(board, curPos) ) {
            return {
              targetPiece: curPos,
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

/**
 * Bottom Left
 */
export const bPieceExistsOnTargetBottomLeft = (board, coords, targetPiece) => {
  const srcRow = targetPiece.nRow
  const srcCol = targetPiece.nCol
  const destRow = coords.nDestRow
  const destCol = coords.nDestCol

  let prevRow = srcRow
  let prevCol = srcCol
  let curPos

  // Always check the previous diagonally adjacent square 
  for (let i = srcRow; i >= destRow; i--) {
    for (let j = srcCol; j >= destCol; j--) {
      if ( i === prevRow - 1 && j === prevCol - 1 ) {
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

export const bOtherExistsOnBottomLeft = (board, coords, squareHasSameColoredPiece, squareHasOtherColoredPiece) => {
  const srcRow = coords.nRow
  const srcCol = coords.nCol

  if (coords.nDestRow && coords.nDestCol) {
    const destRow = coords.nDestRow
    const destCol = coords.nDestCol
    let prevRow = srcRow
    let prevCol = srcCol
    let curPos

    for (let i = srcRow; i >= destRow; i--) {
      for (let j = srcCol; j >= destCol; j--) {
        if ( i === prevRow - 1 && j === prevCol - 1 ) {
          curPos = { nRow: i, nCol: j }
          if ( squareHasOtherColoredPiece(board, curPos) ) {
            return {
              targetPiece: curPos,
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

/**
 * Bottom Right
 */

export const bPieceExistsOnTargetBottomRight = (board, coords, targetPiece) => {
  const srcRow = targetPiece.nRow
  const srcCol = targetPiece.nCol
  const destRow = coords.nDestRow
  const destCol = coords.nDestCol

  let prevRow = srcRow
  let prevCol = srcCol
  let curPos

  // Always check the previous diagonally adjacent square 
  for (let i = srcRow; i >= destRow; i--) {
    for (let j = srcCol; j <= destCol; j++) {
      if ( i === prevRow - 1 && j === prevCol + 1 ) {
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

export const bOtherExistsOnBottomRight = (board, coords, squareHasSameColoredPiece, squareHasOtherColoredPiece) => {
  const srcRow = coords.nRow
  const srcCol = coords.nCol

  if (coords.nDestRow && coords.nDestCol) {
    const destRow = coords.nDestRow
    const destCol = coords.nDestCol
    let prevRow = srcRow
    let prevCol = srcCol
    let curPos

    for (let i = srcRow; i >= destRow; i--) {
      for (let j = srcCol; j <= destCol; j++) {
        if ( i === prevRow - 1 && j === prevCol + 1 ) {
          curPos = { nRow: i, nCol: j }
          if ( squareHasOtherColoredPiece(board, curPos) ) {
            return {
              targetPiece: curPos,
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
  const isDiag = Math.abs(coords.nRow - coords.nDestRow) === Math.abs(coords.nCol - coords.nDestCol)
  
  const bTopLeft = coords.nRow < coords.nDestRow && coords.nCol > coords.nDestCol && isDiag
  const bTopRight = coords.nRow < coords.nDestRow && coords.nCol < coords.nDestCol && isDiag
  const bBottomLeft = coords.nRow > coords.nDestRow && coords.nCol > coords.nDestCol && isDiag
  const bBottomRight = coords.nRow > coords.nDestRow && coords.nCol < coords.nDestCol && isDiag

  if (bTopLeft) {
    return bOtherExistsOnTopLeft(board, coords, squareHasSameColoredPiece, squareHasOtherColoredPiece)
  } else if (bTopRight) {
    return bOtherExistsOnTopRight(board, coords, squareHasSameColoredPiece, squareHasOtherColoredPiece)
  } else if (bBottomLeft) {
    return bOtherExistsOnBottomLeft(board, coords, squareHasSameColoredPiece, squareHasOtherColoredPiece)
  } else if (bBottomRight) {
    return bOtherExistsOnBottomRight(board, coords, squareHasSameColoredPiece, squareHasOtherColoredPiece)
  } else {
    return { targetPiece: null, pieceExists: false }
  }
}

export const bPieceExistsBetweenTargetAndDest = (board, coords, targetPiece) => {
  if (targetPiece === null) {
    return false
  }

  if (targetPiece.nRow === coords.nDestRow && targetPiece.nCol === coords.nDestCol) {
    return true
  }

  const isDiag = Math.abs(targetPiece.nRow - coords.nDestRow) === Math.abs(targetPiece.nCol - coords.nDestCol)

  const bTopLeft = targetPiece.nRow <= coords.nDestRow && targetPiece.nCol >= coords.nDestCol && isDiag
  const bTopRight = targetPiece.nRow <= coords.nDestRow && targetPiece.nCol <= coords.nDestCol && isDiag
  const bBottomLeft = targetPiece.nRow >= coords.nDestRow && targetPiece.nCol >= coords.nDestCol && isDiag
  const bBottomRight = targetPiece.nRow >= coords.nDestRow && targetPiece.nCol <= coords.nDestCol && isDiag

  if (bTopLeft) {
    return bPieceExistsOnTargetTopLeft(board, coords, targetPiece)
  } else if (bTopRight) {
    return bPieceExistsOnTargetTopRight(board, coords, targetPiece)
  } else if (bBottomLeft) {
    return bPieceExistsOnTargetBottomLeft(board, coords, targetPiece)
  } else if (bBottomRight) {
    return bPieceExistsOnTargetBottomRight(board, coords, targetPiece)
  } else {
    return false
  }
}   

export const bIsValidCapture = (board, coords, color) => {
  let hasFriendly, hasEnemy
  if (color === 'white') {
    hasFriendly = bSourceHasWhite
    hasEnemy = bSourceHasBlack
  } else {
    hasFriendly = bSourceHasBlack
    hasEnemy = bSourceHasWhite
  }

  const checkOther = bOtherExistsAfterSource(board, coords, hasFriendly, hasEnemy)
  if (checkOther) {
    const targetPiece = checkOther.targetPiece
    const noPieceBetween = !bPieceExistsBetweenTargetAndDest(board, coords, targetPiece)
    const validCapture = checkOther.pieceExists && noPieceBetween
    return { validCapture, targetPiece }
  } else {
    return { validCapture: false, targetPiece: null }
  }
}