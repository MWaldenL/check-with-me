const filterWhite = board => {
  let whiteCells = []
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c].bHasWhiteChip || board[r][c].bHasWhiteKing) {
        whiteCells.push(board[r][c])
      }
    }
  }

  return whiteCells
}

const filterBlack = board => {
  let blackCells = []
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c].bHasBlackChip || board[r][c].bHasBlackKing)
        blackCells.push(board[r][c])
    }
  }

  return blackCells
}

/**
 * Checks if the current player is stuck from their point of view
 */
export const checkIfSelfStuck = (board, isWhite) => {
  let cells = isWhite ? filterWhite(board) : filterBlack(board)
  let bIsBlocked = true
  let topLeft, topRight, currentSquare, hasEnemyPiece

  for (const cell of cells) {
    const { nRow, nCol } = cell
    
    // Check whether top right is blocked
    currentSquare = board[nRow][nCol]
    if (bIsBlocked && nCol < 8 && nRow < 8) {
      hasEnemyPiece = isWhite ? 
        currentSquare.bHasBlackChip || currentSquare.bHasBlackKing : 
        currentSquare.bHasWhiteChip || currentSquare.bHasWhiteKing
      
      if (hasEnemyPiece) { // check for top right capture
        if (nCol < 7 && nRow < 7) {
          topRight = board[nRow + 1][nCol + 1]
          bIsBlocked = 
            topRight.bHasBlackChip || 
            topRight.bHasBlackKing || 
            topRight.bHasWhiteChip || 
            topRight.bHasWhiteKing
        } 
      } else {
        bIsBlocked = false
      }
    }

    // Check whether top left is blocked
    currentSquare = board[nRow][nCol - 2]
    if (bIsBlocked && nCol > 1 && nRow < 8) {
      if (hasEnemyPiece) { // check for top left capture
        if (nCol > 2 && nRow < 7) {
          topLeft = board[nRow + 1][nCol - 3]
          bIsBlocked = 
            topLeft.bHasBlackChip || 
            topLeft.bHasBlackKing || 
            topLeft.bHasWhiteChip || 
            topLeft.bHasWhiteKing 
        }
      } else {
        bIsBlocked = false
      }
    }
  }

  return bIsBlocked
}


/**
 * Checks if the opponent is stuck from the current player's point of view
 */
export const checkIfEnemyStuck = (board, isWhite) => {
  let cells = isWhite ? filterBlack(board) : filterWhite(board)
  let bIsBlocked = true
  let bottomLeft, bottomRight, currentSquare, hasEnemyPiece

  for (const cell of cells) {
    // Check if bottom right is blocked
    currentSquare = board[cell.nRow - 2][cell.nCol]
    if (bIsBlocked && cell.nCol < 8 && cell.nRow > 1) {
      // check for top right capture
      hasEnemyPiece = isWhite ? 
        currentSquare.bHasBlackChip || currentSquare.bHasBlackKing : 
        currentSquare.bHasWhiteChip || currentSquare.bHasWhiteKing

      if (hasEnemyPiece) { 
        if (cell.nCol < 7 && cell.nRow > 2) {
          bottomRight = board[cell.nRow - 3][cell.nCol + 1]
          bIsBlocked = 
            bottomRight.bHasBlackChip || 
            bottomRight.bHasBlackKing || 
            bottomRight.bHasWhiteChip || 
            bottomRight.bHasWhiteKing
        } 
      } else {
        bIsBlocked = false
      }
    }

    // Check if bottom left is blocked
    currentSquare = board[cell.nRow - 2][cell.nCol - 2]
    if (bIsBlocked && cell.nCol > 1 && cell.nRow > 1) {
      hasEnemyPiece = isWhite ? 
        currentSquare.bHasBlackChip || currentSquare.bHasBlackKing : 
        currentSquare.bHasWhiteChip || currentSquare.bHasWhiteKing

      if (hasEnemyPiece) { 
        if (cell.nCol > 2 && cell.nRow > 2) {
          bottomLeft = board[cell.nRow - 3][cell.nCol - 3]
          bIsBlocked = 
            bottomLeft.bHasBlackChip || 
            bottomLeft.bHasBlackKing || 
            bottomLeft.bHasWhiteChip || 
            bottomLeft.bHasWhiteKing
        } 
      } else {
        bIsBlocked = false
      }
    }
  }

  return bIsBlocked
}