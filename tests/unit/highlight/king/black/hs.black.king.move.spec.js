import { getPossibleMoveBlackKing } from '@/store/services/highlightService'

// dummy 8 x 8 board
const getBoard = () => {
  const board = new Array(8).fill(null).map(() => Array(8))
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      // initialize empty cell
      const cell = {
        nRow: r + 1, // nRow number 1-8, 1 is bottom
        nCol: c + 1, // column number 1-8, 1 is leftmost
        bHasBlackChip: false, // boolean
        bHasWhiteChip: false,
        bHasBlackKing: false, // boolean
        bHasWhiteKing: false
      }

      board[r][c] = cell
    }
  }
  return board
}

describe('movement for black king', () => {
  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ B _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('return coordinates of all spaces on diagonals when all are free and valid', () => {
    // arrange
    const board = getBoard()
    const row = 3
    const col = 3

    board[row][col] = {
      nRow: row + 1, 
      nCol: col + 1, 
      bHasBlackChip: true,
      bHasWhiteChip: false,
      bHasBlackKing: true, 
      bHasWhiteKing: false
    }

    const expected = [
      [4, 4, 0],
      [5, 5, 0],
      [6, 6, 0],
      [7, 7, 0],
      [2, 4, 0],
      [1, 5, 0],
      [0, 6, 0],
      [2, 2, 0],
      [1, 1, 0],
      [0, 0, 0],
      [4, 2, 0],
      [5, 1, 0],
      [6, 0, 0]
    ]

    // act
    const result = getPossibleMoveBlackKing(board, row + 1, col + 1)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * B _ _ _ _ _ _ _
   */
  it('return coordinates of all all spaces on northeast diagonal when all are free and valid', () => {
    // arrange
    const board = getBoard()
    const row = 0
    const col = 0

    board[row][col] = {
      nRow: row + 1, 
      nCol: col + 1, 
      bHasBlackChip: true,
      bHasWhiteChip: false,
      bHasBlackKing: true, 
      bHasWhiteKing: false
    }

    const expected = [
      [1, 1, 0],
      [2, 2, 0],
      [3, 3, 0],
      [4, 4, 0],
      [5, 5, 0],
      [6, 6, 0],
      [7, 7, 0]
    ]

    // act
    const result = getPossibleMoveBlackKing(board, row + 1, col + 1)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * B _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('return coordinates of all spaces on southeast when all are free and valid', () => {
    // arrange
    const board = getBoard()
    const row = 7
    const col = 0

    board[row][col] = {
      nRow: row + 1, 
      nCol: col + 1, 
      bHasBlackChip: true,
      bHasWhiteChip: false,
      bHasBlackKing: true, 
      bHasWhiteKing: false
    }

    const expected = [
      [6, 1, 0],
      [5, 2, 0],
      [4, 3, 0],
      [3, 4, 0],
      [2, 5, 0],
      [1, 6, 0],
      [0, 7, 0]
    ]

    // act
    const result = getPossibleMoveBlackKing(board, row + 1, col + 1)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ B
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('return coordinates of all spaces on southwest diagonal when all are free and valid', () => {
    // arrange
    const board = getBoard()
    const row = 7
    const col = 7

    board[row][col] = {
      nRow: row + 1, 
      nCol: col + 1, 
      bHasBlackChip: true,
      bHasWhiteChip: false,
      bHasBlackKing: true, 
      bHasWhiteKing: false
    }

    const expected = [
      [6, 6, 0],
      [5, 5, 0],
      [4, 4, 0],
      [3, 3, 0],
      [2, 2, 0],
      [1, 1, 0],
      [0, 0, 0]
    ]

    // act
    const result = getPossibleMoveBlackKing(board, row + 1, col + 1)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ B
   */
  it('return coordinates of all spaces on northwest diagonal when all are free and valid', () => {
    // arrange
    const board = getBoard()
    const row = 0
    const col = 7

    board[row][col] = {
      nRow: row + 1, 
      nCol: col + 1, 
      bHasBlackChip: true,
      bHasWhiteChip: false,
      bHasBlackKing: true, 
      bHasWhiteKing: false
    }

    const expected = [
      [1, 6, 0],
      [2, 5, 0],
      [3, 4, 0],
      [4, 3, 0],
      [5, 2, 0],
      [6, 1, 0],
      [7, 0, 0]
    ]

    // act
    const result = getPossibleMoveBlackKing(board, row + 1, col + 1)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ _
   * B _ _ _ _ _ _ _
   * _ _ _ _ _ B _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ B _ _ _ _
   * _ _ _ _ B _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('return coordinates of all free and valid spaces on diagonals until before nearest black chip', () => {
    // arrange
    const board = getBoard()
    const row = 3
    const col = 3

    board[row][col] = {
      nRow: row + 1, 
      nCol: col + 1, 
      bHasBlackChip: true,
      bHasWhiteChip: false,
      bHasBlackKing: true, 
      bHasWhiteKing: false
    }

    board[5][5] = {
      nRow: 6, 
      nCol: 6, 
      bHasBlackChip: true,
      bHasWhiteChip: false,
      bHasBlackKing: false, 
      bHasWhiteKing: false
    }

    board[2][4] = {
      nRow: 3, 
      nCol: 5, 
      bHasBlackChip: true,
      bHasWhiteChip: false,
      bHasBlackKing: false, 
      bHasWhiteKing: false
    }

    board[6][0] = {
      nRow: 7, 
      nCol: 1, 
      bHasBlackChip: true,
      bHasWhiteChip: false,
      bHasBlackKing: false, 
      bHasWhiteKing: false
    }

    const expected = [
      [4, 4, 0],
      [2, 2, 0],
      [1, 1, 0],
      [0, 0, 0],
      [4, 2, 0],
      [5, 1, 0]
    ]

    // act
    const result = getPossibleMoveBlackKing(board, row + 1, col + 1)

    // assert
    expect(result).toStrictEqual(expected)
  })
})