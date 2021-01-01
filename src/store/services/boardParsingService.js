const getEmptyBoard = () => {
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

  return board
}

const placePieces = (board, squares, color) => {
  for (let square of squares) {
    let cell = {
      nRow: 0, // nRow number 1-8, 1 is bottom
      nCol: 0, // column number 1-8, 1 is leftmost
      bHasBlackChip: false, // boolean
      bHasWhiteChip: false, // boolean
      bHasBlackKing: false, // boolean
      bHasWhiteKing: false, // boolean,
      isHighlighted: false,
      isPossibleMove: false,
      isPossibleCapture: false
    }

    if (square.charAt(0) === 'K') {
      square = square.replace('K', '')
      cell = (color === 'w') ? 
        { ...cell, bHasWhiteKing: true } : 
        { ...cell, bHasBlackKing: true }
    } 

    let row = Math.floor(Number(square) / 8)
    if (Number(square) % 8 !== 0) {
      row += 1
    }
    let col = Number(square) % 8
    if (col === 0) {
      col = 8
    }

    cell =  (color === 'w') ? 
      { ...cell, nRow: row, nCol: col, bHasWhiteChip: true } :
      { ...cell, nRow: row, nCol: col, bHasBlackChip: true }

    board[row-1][col-1] = cell
  }
}


/**
 * PDN Grammar: [FEN "[Turn]:[Color 1][K][Square number][,]...]:[Color 2][K][Square number][,]...]"]
 * @param pdn the input in Portable Draughts Notation 
 */
export const getBoardFromPDN = (pdn) => {
  const board = getEmptyBoard()
  let sections = pdn.split(':')
  const turn = sections[0][sections[0].length - 1]

  // White
  let white = sections[1]
    .replace('W', '')
    .split(',')
  placePieces(board, white, 'w')

  // Black 
  let black = sections[2]
    .replace('B', '')
    .replace('"]', '')
    .split(',')
  placePieces(board, black, 'b')

  return board
}

export const getPDNFromBoard = (board, turn) => {
  let res = `[FEN "${turn}:W`
  let white = []
  let black = []

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      let square = 8 * r + c + 1
      if (board[r][c].bHasWhiteChip) {
        if (board[r][c].bHasWhiteKing) {
          white.push('K' + square)
        } else {
          white.push(square)
        }
      } else if (board[r][c].bHasBlackChip) {
        if (board[r][c].bHasBlackKing) {
          black.push('K' + square)
        } else {
          black.push(square)
        }
      }
    }
  }

  for (let s of white) {
    res = res.concat(s).concat(',')
  }
  res = res.slice(0, res.length-1).concat(':B')
  for (let s of black) {
    res = res.concat(s).concat(',')
  }
  res = res.slice(0, res.length-1).concat('"]')
  
  return res
}

// const board = getBoardFromPDN(`[FEN "O:W1,3,5,7,10,12,14,16,17,19,21,23:B42,44,46,48,49,51,53,55,56,58,60,62,64"]`)
// Starting position: 
// [FEN "O:W1,3,5,7,10,12,14,16,17,19,21,23:B42,44,46,48,49,51,53,55,56,58,60,62,64"]
// With Kings: [FEN "O:WK1:BK42"]
