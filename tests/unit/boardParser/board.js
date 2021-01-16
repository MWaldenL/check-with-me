export const getBoard = (whitePosList, blackPosList, whiteKingList, blackKingList) => { // [1, 3, 5, 7, 9...]
  const board = new Array(8).fill(null).map(() => Array(8))
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      // initialize empty cell
      const cell = {
        nRow: r + 1, // nRow number 1-8, 1 is bottom
        nCol: c + 1, // column number 1-8, 1 is leftmost
        bHasBlackChip: false, // boolean
        bHasWhiteChip: false, // boolean
        bHasBlackKing: false, // boolean
        bHasWhiteKing: false, // boolean,
        isHighlighted: false,
        isPossibleMove: false,
        isPossibleCapture: false
      }

      board[r][c] = cell
    }
  }

  // Place pieces at the given positions
  for (let piece of whitePosList) {
    const row = Math.floor((Number(piece) - 1) / 8) + 1
    const col = ((Number(piece) - 1) % 8) + 1
    
    board[row-1][col-1] = {
      nRow: row, // nRow number 1-8, 1 is bottom
      nCol: col, // column number 1-8, 1 is leftmost
      bHasBlackChip: false,
      bHasWhiteChip: true,
      bHasBlackKing: false,
      bHasWhiteKing: false,
      isHighlighted: false,
      isPossibleMove: false,
      isPossibleCapture: false
    }
  }

  for (let piece of blackPosList) {
    const row = Math.floor((Number(piece) - 1) / 8) + 1
    const col = ((Number(piece) - 1) % 8) + 1
    
    board[row-1][col-1] = {
      nRow: row, // nRow number 1-8, 1 is bottom
      nCol: col, // column number 1-8, 1 is leftmost
      bHasBlackChip: true,
      bHasWhiteChip: false,
      bHasBlackKing: false,
      bHasWhiteKing: false,
      isHighlighted: false,
      isPossibleMove: false,
      isPossibleCapture: false
    }
  }

  for (let piece of whiteKingList) {
    const row = Math.floor((Number(piece) - 1) / 8) + 1
    const col = ((Number(piece) - 1) % 8) + 1
    
    board[row-1][col-1] = {
      nRow: row, // nRow number 1-8, 1 is bottom
      nCol: col, // column number 1-8, 1 is leftmost
      bHasBlackChip: false,
      bHasWhiteChip: true,
      bHasBlackKing: false,
      bHasWhiteKing: true,
      isHighlighted: false,
      isPossibleMove: false,
      isPossibleCapture: false
    }
  }

  for (let piece of blackKingList) {
    const row = Math.floor((Number(piece) - 1) / 8) + 1
    const col = ((Number(piece) - 1) % 8) + 1
    
    board[row-1][col-1] = {
      nRow: row, // nRow number 1-8, 1 is bottom
      nCol: col, // column number 1-8, 1 is leftmost
      bHasBlackChip: true,
      bHasWhiteChip: false,
      bHasBlackKing: true,
      bHasWhiteKing: false,
      isHighlighted: false,
      isPossibleMove: false,
      isPossibleCapture: false
    }
  }

  return board
}