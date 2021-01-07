export const getPossibleMoves = (board, nRow, nCol, isWhite) => {
  let moves = []

  const bTopLeftValid = nRow >= 0 && nRow < 8 && nCol - 2 >= 0 && nCol - 2 < 8
  const bTopRightValid = nRow >= 0 && nRow < 8 && nCol >= 0 && nCol < 8

  const bTopLeftCaptValid = nRow + 1 >= 0 && nRow + 1 < 8 && nCol - 3 >= 0 && nCol - 3 < 8
  const bTopLeftCaptUnblocked = bTopLeftCaptValid && !board[nRow + 1][nCol - 3].bHasBlackChip && !board[nRow + 1][nCol - 3].bHasWhiteChip
  const bTopRightCaptValid = nRow + 1 >= 0 && nRow + 1 < 8 && nCol + 1 >= 0 && nCol + 1 < 8
  const bTopRightCaptUnblocked = bTopRightCaptValid && !board[nRow + 1][nCol + 1].bHasBlackChip && !board[nRow + 1][nCol + 1].bHasWhiteChip

  if (bTopLeftValid) {
    const bTopLeft = board[nRow][nCol - 2]
    const bHasFriendlyPiece = isWhite ? bTopLeft.bHasWhiteChip : bTopLeft.bHasBlackChip 
    const bHasEnemyPiece = isWhite ? bTopLeft.bHasBlackChip : bTopLeft.bHasWhiteChip

    if (!bTopLeft.bHasBlackChip && !bTopLeft.bHasWhiteChip) {
      moves.push([nRow, nCol - 2, 0])
    } else if (bHasFriendlyPiece) {
      // skip
    } else if (bHasEnemyPiece && bTopLeftCaptValid && !bTopLeftCaptUnblocked) {
      // skip
    } else if (bHasEnemyPiece && bTopLeftCaptValid && bTopLeftCaptUnblocked) {
      moves.push([nRow, nCol - 2, 1])
      moves.push([nRow + 1, nCol - 3, 0])
    }
  }

  if (bTopRightValid) {
    const bTopRight = board[nRow][nCol]
    const bHasFriendlyPiece = isWhite ? bTopRight.bHasWhiteChip : bTopRight.bHasBlackChip
    const bHasEnemyPiece = isWhite ? bTopRight.bHasBlackChip : bTopRight.bHasWhiteChip

    if (!bTopRight.bHasBlackChip && !bTopRight.bHasWhiteChip) {
      moves.push([nRow, nCol, 0])
    } else if (bHasFriendlyPiece) {
      // skip
    } else if (bHasEnemyPiece && bTopRightCaptValid && !bTopRightCaptUnblocked) {
      // skip
    } else if (bHasEnemyPiece && bTopRightCaptValid && bTopRightCaptUnblocked) {
      moves.push([nRow, nCol, 1])
      moves.push([nRow + 1, nCol + 1, 0])
    }
  }

  return moves
}

export const getPossibleCaptures = (board, nRow, nCol, isWhite) => {
  let moves = []

  const bTopLeftValid = nRow >= 0 && nRow < 8 && nCol - 2 >= 0 && nCol - 2 < 8
  const bTopRightValid = nRow >= 0 && nRow < 8 && nCol >= 0 && nCol < 8

  const bTopLeftCaptValid = nRow + 1 >= 0 && nRow + 1 < 8 && nCol - 3 >= 0 && nCol - 3 < 8
  const bTopLeftCaptUnblocked = bTopLeftCaptValid && !board[nRow + 1][nCol - 3].bHasBlackChip && !board[nRow + 1][nCol - 3].bHasWhiteChip
  const bTopRightCaptValid = nRow + 1 >= 0 && nRow + 1 < 8 && nCol + 1 >= 0 && nCol + 1 < 8
  const bTopRightCaptUnblocked = bTopRightCaptValid && !board[nRow + 1][nCol + 1].bHasBlackChip && !board[nRow + 1][nCol + 1].bHasWhiteChip

  if (bTopLeftValid) {
    const bTopLeft = board[nRow][nCol - 2]
    const bHasEnemyPiece = isWhite ? bTopLeft.bHasBlackChip : bTopLeft.bHasWhiteChip

    if (bHasEnemyPiece && bTopLeftCaptValid && bTopLeftCaptUnblocked) {
      moves.push([nRow, nCol - 2, 1])
      moves.push([nRow + 1, nCol - 3, 0])
    }
  }

  if (bTopRightValid) {
    const bTopRight = board[nRow][nCol]
    const bHasEnemyPiece = isWhite ? bTopRight.bHasBlackChip : bTopRight.bHasWhiteChip

    if (bHasEnemyPiece && bTopRightCaptValid && bTopRightCaptUnblocked) {
      moves.push([nRow, nCol, 1])
      moves.push([nRow + 1, nCol + 1, 0])
    }
  }
  return moves
}

export const getPossibleMoveBlackKing = (board, nRow, nCol, isCaptureRequired) => {
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
      if (!isCaptureRequired) {
        moves.push([nRowTraverser, nColTraverser, 0])
      }
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
      if (!isCaptureRequired) {
        moves.push([nRowTraverser, nColTraverser, 0])
      }
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
      if (!isCaptureRequired) {
        moves.push([nRowTraverser, nColTraverser, 0])
      }
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
      if (!isCaptureRequired) {
        moves.push([nRowTraverser, nColTraverser, 0])
      }
    }
    nRowTraverser++
    nColTraverser--
  }

  return moves
}

export const getPossibleMoveWhiteKing = (board, nRow, nCol, isCaptureRequired) => {
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
      if (!isCaptureRequired) {
        moves.push([nRowTraverser, nColTraverser, 0])
      }
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
      if (!isCaptureRequired) {
        moves.push([nRowTraverser, nColTraverser, 0])
      }
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
      if (!isCaptureRequired) {
        moves.push([nRowTraverser, nColTraverser, 0])
      }
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
      if (!isCaptureRequired) {
        moves.push([nRowTraverser, nColTraverser, 0])
      }
    }
    nRowTraverser++
    nColTraverser--
  }

  return moves
}

export const getPossibleKingCaptures = (board, nRow, nCol, isWhite) => {
  return isWhite ? 
    getPossibleMoveWhiteKing(board, nRow, nCol, true) : 
    getPossibleMoveBlackKing(board, nRow, nCol, true)
}