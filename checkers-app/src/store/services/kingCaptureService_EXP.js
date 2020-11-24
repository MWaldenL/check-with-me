import {
  bSourceHasBlack,
  bSourceHasWhite
} from '@/store/services/moveCaptureService'

/**
 * Top Left
 */
export const checkDiagonal = (action, board, curPos, hasFriendly, hasEnemy) => {
  if (action === 'srcToTarget') {
    if ( hasEnemy(board, curPos) ) {
      return { targetPiece: curPos, pieceExists: true }
    } else if ( hasFriendly(board, curPos) ) {
      return { targetPiece: null, pieceExists: false }
    }
  } else if (action === 'targetToDest') {
    console.log('pieceExistsBetween')
    return bSourceHasBlack(board, curPos) || bSourceHasWhite(board, curPos)
  }
}

export const checkTopLeft = (action, board, coords, hasFriendly, hasEnemy, targetPiece) => {
  let srcRow, srcCol
  if (targetPiece === null) {
    srcRow = coords.nRow
    srcCol = coords.nCol
  } else {
    srcRow = targetPiece.nRow
    srcCol = targetPiece.nCol 
  }

  if (coords.nDestRow && coords.nDestCol) {
    let prevRow = srcRow
    let prevCol = srcCol
    let curPos
    let result

    // Always check the previous diagonally adjacent square 
    for (let i = srcRow; i <= coords.nDestRow; i++) {
      for (let j = srcCol; j >= coords.nDestCol; j--) {
        if ( i === prevRow + 1 && j === prevCol - 1 ) {
          curPos = { nRow: i, nCol: j }
          result = checkDiagonal(action, board, curPos, hasFriendly, hasEnemy)
          if (hasEnemy !== null && hasFriendly !== null) { // Checking src to target
            if (hasEnemy(board, curPos) || hasFriendly(board, curPos)) {
              return result
            }
          } else if (targetPiece !== null) { // Checking target to dest
            return result
          }
          prevRow = i
          prevCol = j
        }
      }
    }      
    return result
  }
  return null
}

export const checkTopRight = (action, board, coords, hasFriendly, hasEnemy, targetPiece) => {
  let srcRow, srcCol
  if (targetPiece === null) {
    srcRow = coords.nRow
    srcCol = coords.nCol
  } else {
    srcRow = targetPiece.nRow
    srcCol = targetPiece.nCol
  }

  if (coords.nDestRow && coords.nDestCol) {
    let prevRow = srcRow
    let prevCol = srcCol
    let curPos
    let result
    
    for (let i = srcRow; i <= coords.nDestRow; i++) {
      for (let j = srcCol; j <= coords.nDestCol; j++) {
        if ( i === prevRow + 1 && j === prevCol + 1 ) {
          curPos = { nRow: i, nCol: j }
          result = checkDiagonal(action, board, curPos, hasFriendly, hasEnemy)
          if (hasEnemy !== null && hasFriendly !== null) { // Checking src to target
            if (hasEnemy(board, curPos) || hasFriendly(board, curPos)) {
              return result
            }
          } else if (targetPiece !== null) { // Checking target to dest
            return result
          }
          prevRow = i
          prevCol = j
        }
      }
    }
    return result
  }
  return null
}

export const checkBottomLeft = (action, board, coords, hasFriendly, hasEnemy, targetPiece) => {
  let srcRow, srcCol
  if (targetPiece === null) {
    srcRow = coords.nRow
    srcCol = coords.nCol
  } else {
    srcRow = targetPiece.nRow
    srcCol = targetPiece.nCol 
  }

  if (coords.nDestRow && coords.nDestCol) {
    let prevRow = coords.nRow
    let prevCol = coords.nCol
    let curPos
    let result

    for (let i = srcRow; i >= coords.nDestRow; i--) {
      for (let j = srcCol; j >= coords.nDestCol; j--) {
        if ( i === prevRow - 1 && j === prevCol - 1 ) {
          curPos = { nRow: i, nCol: j }
          result = checkDiagonal(action, board, curPos, hasFriendly, hasEnemy)
          if (hasEnemy !== null && hasFriendly !== null) { // Checking src to target
            if (hasEnemy(board, curPos) || hasFriendly(board, curPos)) {
              return result
            }
          } else if (targetPiece !== null) { // Checking target to dest
            return result
          }
          prevRow = i
          prevCol = j
        }
      }
    }      
    return result
  } 
  return null
}

export const checkBottomRight = (action, board, coords, hasFriendly, hasEnemy, targetPiece) => {
  let srcRow, srcCol
  if (targetPiece === null) {
    srcRow = coords.nRow
    srcCol = coords.nCol
  } else {
    srcRow = targetPiece.nRow
    srcCol = targetPiece.nCol 
  }

  if (coords.nDestRow && coords.nDestCol) {
    let prevRow = srcRow
    let prevCol = srcCol
    let curPos
    let result

    for (let i = srcRow; i >= coords.nDestRow; i--) {
      for (let j = srcCol; j <= coords.nDestCol; j++) {
        if ( i === prevRow - 1 && j === prevCol + 1 ) {
          curPos = { nRow: i, nCol: j }
          result = checkDiagonal(action, board, curPos, hasFriendly, hasEnemy)
          if (hasEnemy !== null && hasFriendly !== null) { // Checking src to target
            if (hasEnemy(board, curPos) || hasFriendly(board, curPos)) {
              return result
            }
          } else if (targetPiece !== null) { // Checking target to dest
            return result
          }
          prevRow = i
          prevCol = j
        }
      }
    }      
    return result
  } 
  return null
}

export const bOtherExistsAfterSource = (board, coords, hasFriendly, hasEnemy) => {
  const isDiag = Math.abs(coords.nRow - coords.nDestRow) === Math.abs(coords.nCol - coords.nDestCol)
  const bTopLeft = coords.nRow < coords.nDestRow && coords.nCol > coords.nDestCol && isDiag
  const bTopRight = coords.nRow < coords.nDestRow && coords.nCol < coords.nDestCol && isDiag
  const bBottomLeft = coords.nRow > coords.nDestRow && coords.nCol > coords.nDestCol && isDiag
  const bBottomRight = coords.nRow > coords.nDestRow && coords.nCol < coords.nDestCol && isDiag

  if (bTopLeft) {
    return checkTopLeft('srcToTarget', board, coords, hasFriendly, hasEnemy, null)
  } else if (bTopRight) {
    return checkTopRight('srcToTarget', board, coords, hasFriendly, hasEnemy, null)
  } else if (bBottomLeft) {
    return checkBottomLeft('srcToTarget', board, coords, hasFriendly, hasEnemy, null)
  } else if (bBottomRight) {
    return checkBottomRight('srcToTarget', board, coords, hasFriendly, hasEnemy, null)
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
    return checkTopLeft('targetToDest', board, coords, null, null, targetPiece)
  } else if (bTopRight) {
    return checkTopRight('targetToDest', board, coords, null, null, targetPiece)
  } else if (bBottomLeft) {
    console.log('pieceExistsBetween')
    return checkBottomLeft('targetToDest', board, coords, null, null, targetPiece)
  } else if (bBottomRight) {
    return checkBottomRight('targetToDest', board, coords, null, null, targetPiece)
  } else {
    console.log('no pieceExistsBetween')
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