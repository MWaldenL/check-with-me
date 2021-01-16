export const getBoard = (n) => {
  const board = new Array(n).fill(null).map(() => Array(n))
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      board[i][j] = { 
        nRow: i + 1, 
        nCol: j + 1, 
        bHasBlackChip: false, 
        bHasWhiteChip: false,
        bHasBlackKing: false,
        bHasWhiteKing: false,
        isHighlighted: false,
        isPossibleCapture: false,
        isPossibleMove: false
      }
    }
  }
  return board
}
