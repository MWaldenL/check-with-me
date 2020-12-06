export const bSourceHasBlack = (board, coords) => board[coords.nRow - 1][coords.nCol - 1].bHasBlackChip
export const bSourceHasWhite = (board, coords) => board[coords.nRow - 1][coords.nCol - 1].bHasWhiteChip
export const bSourceHasBlackKing = (board, coords) => board[coords.nRow - 1][coords.nCol - 1].bHasBlackKing
export const bSourceHasWhiteKing = (board, coords) => board[coords.nRow - 1][coords.nCol - 1].bHasWhiteKing

export const bBlackExistsAdj = (board, coords) => {
  if (coords.nDestRow && coords.nDestCol) {
    const bTopRight = coords.nDestRow === coords.nRow + 2 && coords.nDestCol === coords.nCol + 2
    const bTopLeft = coords.nDestRow === coords.nRow + 2 && coords.nDestCol === coords.nCol - 2

    if (bTopRight) {
      return board[coords.nRow + 1 - 1][coords.nCol + 1 - 1].bHasBlackChip
    } else if (bTopLeft) {
      return board[coords.nRow + 1 - 1][coords.nCol - 1 - 1].bHasBlackChip
    }
  } else {
    return board[coords.nRow + 1 - 1][coords.nCol + 1 - 1].bHasBlackChip ||
      board[coords.nRow + 1 - 1][coords.nCol - 1 - 1].bHasBlackChip
  }
}

export const bWhiteExistsAdj = (board, coords) => {
  if (coords.nDestRow && coords.nDestCol) {
    const bBottomRight = coords.nDestRow === coords.nRow - 2 && coords.nDestCol === coords.nCol + 2
    const bBottomLeft = coords.nDestRow === coords.nRow - 2 && coords.nDestCol === coords.nCol - 2

    if (bBottomRight) {
      return board[coords.nRow - 1 - 1][coords.nCol + 1 - 1].bHasWhiteChip
    } else if (bBottomLeft) {
      return board[coords.nRow - 1 - 1][coords.nCol - 1 - 1].bHasWhiteChip
    }
  } else {
    return board[coords.nRow - 1 - 1][coords.nCol + 1 - 1].bHasWhiteChip ||
      board[coords.nRow - 1 - 1][coords.nCol - 1 - 1].bHasWhiteChip
  }
}

export const bPieceExistsAfterAdj = (board, coords) =>
  board[coords.nDestRow - 1][coords.nDestCol - 1].bHasBlackChip ||
  board[coords.nDestRow - 1][coords.nDestCol - 1].bHasWhiteChip

export const bNoBlackJumps = (board, coords) => {
  let bFound = true

  if (coords.nRow < coords.nDestRow && coords.nCol < coords.nDestCol) { // Check northeast
    let nRowTraverser = coords.nRow + 1
    let nColTraverser = coords.nCol + 1
    while (nRowTraverser <= 8 && nColTraverser <= 8) {
      if (board[nRowTraverser - 1][nColTraverser - 1].bHasBlackChip) {
        break
      } else {
        nRowTraverser++
        nColTraverser++
      }
    }
    if (coords.nDestRow >= nRowTraverser && coords.nDestCol >= nColTraverser) {
      bFound = false
    }
  } else if (coords.nRow > coords.nDestRow && coords.nCol < coords.nDestCol) { // Check southeast
    let nRowTraverser = coords.nRow - 1
    let nColTraverser = coords.nCol + 1
    while (nRowTraverser >= 1 && nColTraverser <= 8) {
      if (board[nRowTraverser - 1][nColTraverser - 1].bHasBlackChip) {
        break
      } else {
        nRowTraverser--
        nColTraverser++
      }
    }
    if (coords.nDestRow <= nRowTraverser && coords.nDestCol >= nColTraverser) {
      bFound = false
    }
  } else if (coords.nRow > coords.nDestRow && coords.nCol > coords.nDestCol) { // Check southwest
    let nRowTraverser = coords.nRow - 1
    let nColTraverser = coords.nCol - 1
    while (nRowTraverser >= 1 && nColTraverser >= 1) {
      if (board[nRowTraverser - 1][nColTraverser - 1].bHasBlackChip) {
        break
      } else {
        nRowTraverser--
        nColTraverser--
      }
    }
    if (coords.nDestRow <= nRowTraverser && coords.nDestCol <= nColTraverser) {
      bFound = false
    }
  } else if (coords.nRow < coords.nDestRow && coords.nCol > coords.nDestCol) { // Check northwest
    let nRowTraverser = coords.nRow + 1
    let nColTraverser = coords.nCol - 1
    while (nRowTraverser <= 8 && nColTraverser >= 1) {
      if (board[nRowTraverser - 1][nColTraverser - 1].bHasBlackChip) {
        break
      } else {
        nRowTraverser++
        nColTraverser--
      }
    }
    if (coords.nDestRow >= nRowTraverser && coords.nDestCol <= nColTraverser) {
      bFound = false
    }
  }
  return bFound
}

export const bNoWhiteJumps = (board, coords) => {
  let bFound = true

  if (coords.nRow < coords.nDestRow && coords.nCol < coords.nDestCol) { // Check northeast
    let nRowTraverser = coords.nRow + 1
    let nColTraverser = coords.nCol + 1
    while (nRowTraverser <= 8 && nColTraverser <= 8) {
      if (board[nRowTraverser - 1][nColTraverser - 1].bHasWhiteChip) {
        break
      } else {
        nRowTraverser++
        nColTraverser++
      }
    }
    if (coords.nDestRow >= nRowTraverser && coords.nDestCol >= nColTraverser) {
      bFound = false
    }
  } else if (coords.nRow > coords.nDestRow && coords.nCol < coords.nDestCol) { // Check southeast
    let nRowTraverser = coords.nRow - 1
    let nColTraverser = coords.nCol + 1
    while (nRowTraverser >= 1 && nColTraverser <= 8) {
      if (board[nRowTraverser - 1][nColTraverser - 1].bHasWhiteChip) {
        break
      } else {
        nRowTraverser--
        nColTraverser++
      }
    }
    if (coords.nDestRow <= nRowTraverser && coords.nDestCol >= nColTraverser) {
      bFound = false
    }
  } else if (coords.nRow > coords.nDestRow && coords.nCol > coords.nDestCol) { // Check southwest
    let nRowTraverser = coords.nRow - 1
    let nColTraverser = coords.nCol - 1
    while (nRowTraverser >= 1 && nColTraverser >= 1) {
      if (board[nRowTraverser - 1][nColTraverser - 1].bHasWhiteChip) {
        break
      } else {
        nRowTraverser--
        nColTraverser--
      }
    }
    if (coords.nDestRow <= nRowTraverser && coords.nDestCol <= nColTraverser) {
      bFound = false
    }
  } else if (coords.nRow < coords.nDestRow && coords.nCol > coords.nDestCol) { // Check northwest
    let nRowTraverser = coords.nRow + 1
    let nColTraverser = coords.nCol - 1
    while (nRowTraverser <= 8 && nColTraverser >= 1) {
      if (board[nRowTraverser - 1][nColTraverser - 1].bHasWhiteChip) {
        break
      } else {
        nRowTraverser++
        nColTraverser--
      }
    }
    if (coords.nDestRow >= nRowTraverser && coords.nDestCol <= nColTraverser) {
      bFound = false
    }
  }
  return bFound
}
