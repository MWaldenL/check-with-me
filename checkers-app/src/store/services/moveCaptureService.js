export const bSourceHasBlack = (board, coords) => board[coords.nRow - 1][coords.nCol - 1].bHasBlackChip
export const bSourceHasWhite = (board, coords) => board[coords.nRow - 1][coords.nCol - 1].bHasWhiteChip

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
