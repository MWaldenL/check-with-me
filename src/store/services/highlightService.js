export const getPossibleMoveBlack = (board, nRow, nCol) => {
  let moves = []

  const bBottLeftValid = nRow - 2 >= 0 && nRow - 2 < 8 && nCol - 2 >= 0 && nCol - 2 < 8
  const bBottRightValid = nRow - 2 >= 0 && nRow - 2 < 8 && nCol >= 0 && nCol < 8

  const bBottLeftCaptValid = nRow - 3 >= 0 && nRow - 3 < 8 && nCol - 3 >= 0 && nCol - 3 < 8
  const bBottLeftCaptUnblocked = bBottLeftCaptValid  && !board[nRow - 3][nCol - 3].bHasBlackChip && !board[nRow - 3][nCol - 3].bHasWhiteChip
  const bBottRightCaptValid = nRow - 3 >= 0 && nRow - 3 < 8 && nCol + 1 >= 0 && nCol + 1 < 8
  const bBottRightCaptUnblocked = bBottRightCaptValid && !board[nRow - 3][nCol + 1].bHasBlackChip && !board[nRow - 3][nCol + 1].bHasWhiteChip

  if (bBottLeftValid) {
    const bBottLeft = board[nRow - 2][nCol - 2]

    if (!bBottLeft.bHasBlackChip && !bBottLeft.bHasWhiteChip) {
      moves.push([nRow - 2, nCol - 2, 0])
    } else if (bBottLeft.bHasBlackChip) {
      // skip
    } else if (bBottLeft.bHasWhiteChip && bBottLeftCaptValid && !bBottLeftCaptUnblocked) {
      // skip
    } else if (bBottLeft.bHasWhiteChip && bBottLeftCaptValid && bBottLeftCaptUnblocked) {
      moves.push([nRow - 2, nCol - 2, 1])
      moves.push([nRow - 3, nCol - 3, 0])
    }
    
  }

  if (bBottRightValid) {
    const bBottRight = board[nRow - 2][nCol]

    if (!bBottRight.bHasBlackChip && !bBottRight.bHasWhiteChip) {
      moves.push([nRow - 2, nCol, 0])
    } else if (bBottRight.bHasBlackChip) {
      // skip
    } else if (bBottRight.bHasWhiteChip && bBottRightCaptValid && !bBottRightCaptUnblocked) {
      // skip
    } else if (bBottRight.bHasWhiteChip && bBottRightCaptValid && bBottRightCaptUnblocked) {
      moves.push([nRow - 2, nCol, 1])
      moves.push([nRow - 3, nCol + 1, 0])
    } 
    
  }
  return moves
}

export const getPossibleMoveWhite = (board, nRow, nCol) => {
  let moves = []

  const bTopLeftValid = nRow >= 0 && nRow < 8 && nCol - 2 >= 0 && nCol - 2 < 8
  const bTopRightValid = nRow >= 0 && nRow < 8 && nCol >= 0 && nCol < 8

  const bTopLeftCaptValid = nRow + 1 >= 0 && nRow + 1 < 8 && nCol - 3 >= 0 && nCol - 3 < 8
  const bTopLeftCaptUnblocked = bTopLeftCaptValid  && !board[nRow + 1][nCol - 3].bHasBlackChip && !board[nRow + 1][nCol - 3].bHasWhiteChip
  const bTopRightCaptValid = nRow + 1 >= 0 && nRow + 1 < 8 && nCol + 1 >= 0 && nCol + 1 < 8
  const bTopRightCaptUnblocked = bTopRightCaptValid && !board[nRow + 1][nCol + 1].bHasBlackChip && !board[nRow + 1][nCol + 1].bHasWhiteChip

  if (bTopLeftValid) {
    const bTopLeft = board[nRow][nCol - 2]

    if (!bTopLeft.bHasBlackChip && !bTopLeft.bHasWhiteChip) {
      moves.push([nRow, nCol - 2, 0])
    } else if (bTopLeft.bHasWhiteChip) {
      // skip
    } else if (bTopLeft.bHasBlackChip && bTopLeftCaptValid && !bTopLeftCaptUnblocked) {
      // skip
    } else if (bTopLeft.bHasBlackChip && bTopLeftCaptValid && bTopLeftCaptUnblocked) {
      moves.push([nRow, nCol - 2, 1])
      moves.push([nRow + 1, nCol - 3, 0])
    }
    
  }

  if (bTopRightValid) {
    const bTopRight = board[nRow][nCol]

    if (!bTopRight.bHasBlackChip && !bTopRight.bHasWhiteChip) {
      moves.push([nRow, nCol, 0])
    } else if (bTopRight.bHasWhiteChip) {
      // skip
    } else if (bTopRight.bHasBlackChip && bTopRightCaptValid && !bTopRightCaptUnblocked) {
      // skip
    } else if (bTopRight.bHasBlackChip && bTopRightCaptValid && bTopRightCaptUnblocked) {
      moves.push([nRow, nCol, 1])
      moves.push([nRow + 1, nCol + 1, 0])
    } 
    
  }

  return moves
}

export const getPossibleMoveBlackKing = (board, nRow, nCol) => {
  let moves = []

  let nRowTraverser = nRow
  let nColTraverser = nCol

  while (nRowTraverser < 8 && nColTraverser < 8) {
    if (board[nRowTraverser][nColTraverser].bHasBlackChip) {
      break
    } else if (board[nRowTraverser][nColTraverser].bHasWhiteChip) {
      if (nRowTraverser + 1 < 8 && nColTraverser + 1 < 8) {
        if (!(board[nRowTraverser + 1][nColTraverser + 1].bHasBlackChip || board[nRowTraverser + 1][nColTraverser + 1].bHasWhiteChip)) {
          moves.push([nRowTraverser, nColTraverser, 1])
          nRowTraverser++
          nColTraverser++
          while (nRowTraverser < 8 && nColTraverser < 8 && !board[nRowTraverser][nColTraverser].bHasBlackChip && !board[nRowTraverser][nColTraverser].bHasWhiteChip) {
            moves.push([nRowTraverser, nColTraverser, 0])
            nRowTraverser++
            nColTraverser++
          }
          break
        } else {
          break
        }
      } else {
        break
      }
    } else {
      moves.push([nRowTraverser, nColTraverser, 0])
    }
    nRowTraverser++
    nColTraverser++
  }

  nRowTraverser = nRow - 2
  nColTraverser = nCol

  while (nRowTraverser >= 0 && nColTraverser < 8) {
    if (board[nRowTraverser][nColTraverser].bHasBlackChip) {
      break
    } else if (board[nRowTraverser][nColTraverser].bHasWhiteChip) {
      if (nRowTraverser - 1 >= 0 && nColTraverser + 1 < 8) {
        if (!(board[nRowTraverser - 1][nColTraverser + 1].bHasBlackChip || board[nRowTraverser - 1][nColTraverser + 1].bHasWhiteChip)) {
          moves.push([nRowTraverser, nColTraverser, 1])
          nRowTraverser--
          nColTraverser++
          while (nRowTraverser >= 0 && nColTraverser < 8 && !board[nRowTraverser][nColTraverser].bHasBlackChip && !board[nRowTraverser][nColTraverser].bHasWhiteChip) {
            moves.push([nRowTraverser, nColTraverser, 0])
            nRowTraverser--
            nColTraverser++
          }
          break
        } else {
          break
        }
      } else {
        break
      }
    } else {
      moves.push([nRowTraverser, nColTraverser, 0])
    }
    nRowTraverser--
    nColTraverser++
  }

  nRowTraverser = nRow - 2
  nColTraverser = nCol - 2

  while (nRowTraverser >= 0 && nColTraverser >= 0) {
    if (board[nRowTraverser][nColTraverser].bHasBlackChip) {
      break
    } else if (board[nRowTraverser][nColTraverser].bHasWhiteChip) {
      if (nRowTraverser - 1 >= 0 && nColTraverser - 1 >= 0) {
        if (!(board[nRowTraverser - 1][nColTraverser - 1].bHasBlackChip || board[nRowTraverser - 1][nColTraverser - 1].bHasWhiteChip)) {
          moves.push([nRowTraverser, nColTraverser, 1])
          nRowTraverser--
          nColTraverser--
          while (nRowTraverser >= 0 && nColTraverser >= 0 && !board[nRowTraverser][nColTraverser].bHasBlackChip && !board[nRowTraverser][nColTraverser].bHasWhiteChip) {
            moves.push([nRowTraverser, nColTraverser, 0])
            nRowTraverser--
            nColTraverser--
          }
          break
        } else {
          break
        }
      } else {
        break
      }
    } else {
      moves.push([nRowTraverser, nColTraverser, 0])
    }
    nRowTraverser--
    nColTraverser--
  }

  nRowTraverser = nRow
  nColTraverser = nCol - 2

  while (nRowTraverser < 8 && nColTraverser >= 0) {
    if (board[nRowTraverser][nColTraverser].bHasBlackChip) {
      break
    } else if (board[nRowTraverser][nColTraverser].bHasWhiteChip) {
      if (nRowTraverser + 1 < 8 && nColTraverser - 1 >= 0) {
        if (!(board[nRowTraverser + 1][nColTraverser - 1].bHasBlackChip || board[nRowTraverser + 1][nColTraverser - 1].bHasWhiteChip)) {
          moves.push([nRowTraverser, nColTraverser, 1])
          nRowTraverser++
          nColTraverser--
          while (nRowTraverser < 8 && nColTraverser >= 0 && !board[nRowTraverser][nColTraverser].bHasBlackChip && !board[nRowTraverser][nColTraverser].bHasWhiteChip) {
            moves.push([nRowTraverser, nColTraverser, 0])
            nRowTraverser++
            nColTraverser--
          }
          break
        } else {
          break
        }
      } else {
        break
      }
    } else {
      moves.push([nRowTraverser, nColTraverser, 0])
    }
    nRowTraverser++
    nColTraverser--
  }

  return moves
}

export const getPossibleMoveWhiteKing = (board, nRow, nCol) => {
  let moves = []

  let nRowTraverser = nRow
  let nColTraverser = nCol

  while (nRowTraverser < 8 && nColTraverser < 8) {
    if (board[nRowTraverser][nColTraverser].bHasWhiteChip) {
      break
    } else if (board[nRowTraverser][nColTraverser].bHasBlackChip) {
      if (nRowTraverser + 1 < 8 && nColTraverser + 1 < 8) {
        if (!(board[nRowTraverser + 1][nColTraverser + 1].bHasBlackChip || board[nRowTraverser + 1][nColTraverser + 1].bHasWhiteChip)) {
          moves.push([nRowTraverser, nColTraverser, 1])
          nRowTraverser++
          nColTraverser++
          while (nRowTraverser < 8 && nColTraverser < 8 && !board[nRowTraverser][nColTraverser].bHasBlackChip && !board[nRowTraverser][nColTraverser].bHasWhiteChip) {
            moves.push([nRowTraverser, nColTraverser, 0])
            nRowTraverser++
            nColTraverser++
          }
          break
        } else {
          break
        }
      } else {
        break
      }
    } else {
      moves.push([nRowTraverser, nColTraverser, 0])
    }
    nRowTraverser++
    nColTraverser++
  }

  nRowTraverser = nRow - 2
  nColTraverser = nCol

  while (nRowTraverser >= 0 && nColTraverser < 8) {
    if (board[nRowTraverser][nColTraverser].bHasWhiteChip) {
      break
    } else if (board[nRowTraverser][nColTraverser].bHasBlackChip) {
      if (nRowTraverser - 1 >= 0 && nColTraverser + 1 < 8) {
        if (!(board[nRowTraverser - 1][nColTraverser + 1].bHasBlackChip || board[nRowTraverser - 1][nColTraverser + 1].bHasWhiteChip)) {
          moves.push([nRowTraverser, nColTraverser, 1])
          nRowTraverser--
          nColTraverser++
          while (nRowTraverser >= 0 && nColTraverser < 8 && !board[nRowTraverser][nColTraverser].bHasBlackChip && !board[nRowTraverser][nColTraverser].bHasWhiteChip) {
            moves.push([nRowTraverser, nColTraverser, 0])
            nRowTraverser--
            nColTraverser++
          }
          break
        } else {
          break
        }
      } else {
        break
      }
    } else {
      moves.push([nRowTraverser, nColTraverser, 0])
    }
    nRowTraverser--
    nColTraverser++
  }

  nRowTraverser = nRow - 2
  nColTraverser = nCol - 2

  while (nRowTraverser >= 0 && nColTraverser >= 0) {
    if (board[nRowTraverser][nColTraverser].bHasWhiteChip) {
      break
    } else if (board[nRowTraverser][nColTraverser].bHasBlackChip) {
      if (nRowTraverser - 1 >= 0 && nColTraverser - 1 >= 0) {
        if (!(board[nRowTraverser - 1][nColTraverser - 1].bHasBlackChip || board[nRowTraverser - 1][nColTraverser - 1].bHasWhiteChip)) {
          moves.push([nRowTraverser, nColTraverser, 1])
          nRowTraverser--
          nColTraverser--
          while (nRowTraverser >= 0 && nColTraverser >= 0 && !board[nRowTraverser][nColTraverser].bHasBlackChip && !board[nRowTraverser][nColTraverser].bHasWhiteChip) {
            moves.push([nRowTraverser, nColTraverser, 0])
            nRowTraverser--
            nColTraverser--
          }
          break
        } else {
          break
        }
      } else {
        break
      }
    } else {
      moves.push([nRowTraverser, nColTraverser, 0])
    }
    nRowTraverser--
    nColTraverser--
  }

  nRowTraverser = nRow
  nColTraverser = nCol - 2

  while (nRowTraverser < 8 && nColTraverser >= 0) {
    if (board[nRowTraverser][nColTraverser].bHasWhiteChip) {
      break
    } else if (board[nRowTraverser][nColTraverser].bHasBlackChip) {
      if (nRowTraverser + 1 < 8 && nColTraverser - 1 >= 0) {
        if (!(board[nRowTraverser + 1][nColTraverser - 1].bHasBlackChip || board[nRowTraverser + 1][nColTraverser - 1].bHasWhiteChip)) {
          moves.push([nRowTraverser, nColTraverser, 1])
          nRowTraverser++
          nColTraverser--
          while (nRowTraverser < 8 && nColTraverser >= 0 && !board[nRowTraverser][nColTraverser].bHasBlackChip && !board[nRowTraverser][nColTraverser].bHasWhiteChip) {
            moves.push([nRowTraverser, nColTraverser, 0])
            nRowTraverser++
            nColTraverser--
          }
          break
        } else {
          break
        }
      } else {
        break
      }
    } else {
      moves.push([nRowTraverser, nColTraverser, 0])
    }
    nRowTraverser++
    nColTraverser--
  }

  return moves
}