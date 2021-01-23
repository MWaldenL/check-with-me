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
  let topLeft, topRight, bottomLeft, bottomRight, currentSquare, hasEnemyPiece

  if (cells.length === 0)
    return true

  for (const cell of cells) {
    const { nRow, nCol } = cell

    // Check whether top right is blocked
    if (bIsBlocked && nCol < 8 && nRow < 8) {
      currentSquare = board[nRow][nCol]
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
    if (bIsBlocked && nCol > 1 && nRow < 8) {
      currentSquare = board[nRow][nCol - 2]
      hasEnemyPiece = isWhite ? 
        currentSquare.bHasBlackChip || currentSquare.bHasBlackKing : 
        currentSquare.bHasWhiteChip || currentSquare.bHasWhiteKing

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

    if (cell.bHasWhiteKing || cell.bHasBlackKing) {
      if (bIsBlocked && nCol < 8 && nRow > 1) {
        currentSquare = board[nRow - 2][nCol]
        hasEnemyPiece = isWhite ? 
          currentSquare.bHasBlackChip || currentSquare.bHasBlackKing : 
          currentSquare.bHasWhiteChip || currentSquare.bHasWhiteKing

        if (hasEnemyPiece) { // check for top right capture
          if (nCol < 7 && nRow > 2) {
            bottomRight = board[nRow - 3][nCol + 1]
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
      if (bIsBlocked && nCol > 1 && nRow > 1) {
        currentSquare = board[nRow - 2][nCol - 2]
        hasEnemyPiece = isWhite ? 
          currentSquare.bHasBlackChip || currentSquare.bHasBlackKing : 
          currentSquare.bHasWhiteChip || currentSquare.bHasWhiteKing
  
        if (hasEnemyPiece) { 
          if (nCol > 2 && nRow > 2) {
            bottomLeft = board[nRow - 3][nCol - 3]
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
  }

  return bIsBlocked
}


/**
 * Checks if the opponent is stuck from the current player's point of view
 */
export const checkIfEnemyStuck = (board, isWhite) => {
  let cells = isWhite ? filterBlack(board) : filterWhite(board)
  let bIsBlocked = true
  let bottomLeft, bottomRight, topLeft, topRight, currentSquare, hasEnemyPiece

  if (cells.length === 0)
    return true

  for (const cell of cells) {
    const { nRow, nCol } = cell

    // Check if bottom right is blocked
    const isBottomRight = nCol < 8 && nRow > 1 && bIsBlocked
    if (isBottomRight) {
      currentSquare = board[nRow - 2][nCol]
      hasEnemyPiece = isWhite ? 
        currentSquare.bHasWhiteChip || currentSquare.bHasWhiteKing : 
        currentSquare.bHasBlackChip || currentSquare.bHasBlackKing

      if (hasEnemyPiece) { // check for bottom right capture
        if (nCol < 7 && nRow > 2) {
          bottomRight = board[nRow - 3][nCol + 1]
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
    const isBottomLeft = nCol > 1 && nRow > 1 && bIsBlocked
    if (isBottomLeft) {
      currentSquare = board[nRow - 2][nCol - 2]
      hasEnemyPiece = isWhite ? 
        currentSquare.bHasWhiteChip || currentSquare.bHasWhiteKing : 
        currentSquare.bHasBlackChip || currentSquare.bHasBlackKing

      if (hasEnemyPiece) { // check for bottom left capture
        if (nCol > 2 && nRow > 2) {
          bottomLeft = board[nRow - 3][nCol - 3]
          console.log(bottomLeft)
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

    // Checking for kings
    if (cell.bHasWhiteKing || cell.bHasBlackKing) {
      // Check whether top right is blocked
      if (bIsBlocked && nCol < 8 && nRow < 8) {
        currentSquare = board[nRow][nCol]
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
      if (bIsBlocked && nCol > 1 && nRow < 8) {
        currentSquare = board[nRow][nCol - 2]
        hasEnemyPiece = isWhite ? 
          currentSquare.bHasBlackChip || currentSquare.bHasBlackKing : 
          currentSquare.bHasWhiteChip || currentSquare.bHasWhiteKing

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
  }

  return bIsBlocked
}