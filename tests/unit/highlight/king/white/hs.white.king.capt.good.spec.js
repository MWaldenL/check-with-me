import { getPossibleMoveWhiteKing } from '@/store/services/highlightService'

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

describe('unblocked capture attempt for black king', () => {
  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ B _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ W _ _ _ _
   * _ _ B _ _ _ _ _
   * _ _ _ _ _ B _ _
   * _ _ _ _ _ _ _ _
   */
  it('when one or more diagonals have direct blacks with a free and valid space after, \
  return all spaces until before blacks for movement, spaces of blacks for capture, and all free and valid spaces after for movement, \
  also return all free and valid spaces on clean diagonals', () => {
    // arrange
    const board = getBoard()
    const row = 3
    const col = 3

    board[row][col] = {
      nRow: row + 1, 
      nCol: col + 1, 
      bHasBlackChip: false,
      bHasWhiteChip: true,
      bHasBlackKing: false, 
      bHasWhiteKing: true
    }

    board[6][6] = {
      nRow: 7, 
      nCol: 7, 
      bHasBlackChip: true,
      bHasWhiteChip: false,
      bHasBlackKing: false, 
      bHasWhiteKing: false
    }

    board[1][5] = {
      nRow: 2, 
      nCol: 6, 
      bHasBlackChip: true,
      bHasWhiteChip: false,
      bHasBlackKing: false, 
      bHasWhiteKing: false
    }

    board[2][2] = {
      nRow: 3, 
      nCol: 3, 
      bHasBlackChip: true,
      bHasWhiteChip: false,
      bHasBlackKing: false, 
      bHasWhiteKing: false
    }

    const expected = [
      [4, 4, 0],
      [5, 5, 0],
      [6, 6, 1],
      [7, 7, 0],
      [2, 4, 0],
      [1, 5, 1],
      [0, 6, 0],
      [2, 2, 1],
      [1, 1, 0],
      [0, 0, 0],
      [4, 2, 0],
      [5, 1, 0],
      [6, 0, 0]
    ]

    // act
    const result = getPossibleMoveWhiteKing(board, row + 1, col + 1)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ B _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ B _ _ _ _ _ _
   * W _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('when one or more diagonals have direct black with a free and valid space after, \
  return all spaces until before black for movement, spaces of black for capture, and all free and valid spaces until before next black for movement, \
  also return all free and valid spaces on clean diagonals', () => {
    // arrange
    const board = getBoard()

    const row = 3
    const col = 0

    board[row][col] = {
      nRow: row + 1, 
      nCol: col + 1, 
      bHasBlackChip: false,
      bHasWhiteChip: true,
      bHasBlackKing: false, 
      bHasWhiteKing: true
    }

    board[4][1] = {
      nRow: 5, 
      nCol: 2, 
      bHasBlackChip: true,
      bHasWhiteChip: false,
      bHasBlackKing: false, 
      bHasWhiteKing: false
    }

    board[6][3] = {
      nRow: 7, 
      nCol: 4, 
      bHasBlackChip: true,
      bHasWhiteChip: false,
      bHasBlackKing: false, 
      bHasWhiteKing: false
    }

    const expected = [
      [4, 1, 1],
      [5, 2, 0],
      [2, 1, 0],
      [1, 2, 0],
      [0, 3, 0]
    ]

    // act
    const result = getPossibleMoveWhiteKing(board, row + 1, col + 1)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ W
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ B _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ W _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('when one or more diagonals have direct false with a free and valid space after, \
  return all spaces until before false for movement, spaces of false for capture, and all free and valid spaces until before next white for movement, \
  also return all free and valid spaces on other diagonals', () => {
    // arrange
    const board = getBoard()

    const row = 6
    const col = 7

    board[row][col] = {
      nRow: row + 1, 
      nCol: col + 1, 
      bHasBlackChip: false,
      bHasWhiteChip: true,
      bHasBlackKing: false, 
      bHasWhiteKing: true
    }

    board[4][5] = {
      nRow: 5, 
      nCol: 6, 
      bHasBlackChip: true,
      bHasWhiteChip: false,
      bHasBlackKing: false, 
      bHasWhiteKing: false
    }

    board[1][2] = {
      nRow: 2, 
      nCol: 3, 
      bHasBlackChip: false,
      bHasWhiteChip: true,
      bHasBlackKing: false, 
      bHasWhiteKing: false
    }

    const expected = [
      [5, 6, 0],
      [4, 5, 1],
      [3, 4, 0],
      [2, 3, 0],
      [7, 6, 0],
    ]

    // act
    const result = getPossibleMoveWhiteKing(board, row + 1, col + 1)

    // assert
    expect(result).toStrictEqual(expected)
  })
})