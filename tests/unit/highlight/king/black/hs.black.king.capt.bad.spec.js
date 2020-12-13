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

describe('blocked capture attempt for black king', () => {
  /**
   * _ _ _ _ _ _ _ B
   * _ _ _ _ _ _ W _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ B _ _ _ _
   * _ _ W _ _ _ _ _
   * _ W _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('when one or more diagonals with direct whites have chips right after, \
    return all spaces before white for movement, also return all free and valid spaces on other diagonals', () => {
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

    board[6][6] = {
      nRow: 7, 
      nCol: 7, 
      bHasBlackChip: false,
      bHasWhiteChip: true,
      bHasBlackKing: false, 
      bHasWhiteKing: false
    }

    board[7][7] = {
      nRow: 8, 
      nCol: 8, 
      bHasBlackChip: true,
      bHasWhiteChip: false,
      bHasBlackKing: false, 
      bHasWhiteKing: false
    }

    board[2][2] = {
      nRow: 3, 
      nCol: 3, 
      bHasBlackChip: false,
      bHasWhiteChip: true,
      bHasBlackKing: false, 
      bHasWhiteKing: false
    }

    board[1][1] = {
      nRow: 2, 
      nCol: 2, 
      bHasBlackChip: false,
      bHasWhiteChip: true,
      bHasBlackKing: false, 
      bHasWhiteKing: false
    }

    const expected = [
      [4, 4, 0],
      [5, 5, 0],
      [2, 4, 0],
      [1, 5, 0],
      [0, 6, 0],
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
   * _ _ _ _ _ _ W _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ B _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ B _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('when one or more diagonals with indirect whites have a free and valid space right after, \
    return all spaces before blocking chip for movement, also return all free and valid spaces on other diagonals', () => {
    // arrange
    const board = getBoard()
    const row = 2
    const col = 2

    board[row][col] = {
      nRow: row + 1, 
      nCol: col + 1, 
      bHasBlackChip: true,
      bHasWhiteChip: false,
      bHasBlackKing: true, 
      bHasWhiteKing: false
    }

    board[4][4] = {
      nRow: 5, 
      nCol: 5, 
      bHasBlackChip: true,
      bHasWhiteChip: false,
      bHasBlackKing: false, 
      bHasWhiteKing: false
    }

    board[6][6] = {
      nRow: 7, 
      nCol: 7, 
      bHasBlackChip: false,
      bHasWhiteChip: true,
      bHasBlackKing: false, 
      bHasWhiteKing: false
    }

    const expected = [
      [3, 3, 0],
      [1, 3, 0],
      [0, 4, 0],
      [1, 1, 0],
      [0, 0, 0],
      [3, 1, 0],
      [4, 0, 0]
    ]

    // act
    const result = getPossibleMoveBlackKing(board, row + 1, col + 1)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ W
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ B _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ W _
   */
  it('when one or more diagonals with direct whites do not have a free and valid space right after, \
    return all spaces before whites for movement, also return all free and valid spaces on other diagonals', () => {
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

    board[7][7] = {
      nRow: 8, 
      nCol: 8, 
      bHasBlackChip: false,
      bHasWhiteChip: true,
      bHasBlackKing: false, 
      bHasWhiteKing: false
    }

    board[0][6] = {
      nRow: 1, 
      nCol: 7, 
      bHasBlackChip: false,
      bHasWhiteChip: true,
      bHasBlackKing: false, 
      bHasWhiteKing: false
    }

    const expected = [
      [4, 4, 0],
      [5, 5, 0],
      [6, 6, 0],
      [2, 4, 0],
      [1, 5, 0],
      [2, 2, 0],
      [1, 1, 0],
      [0, 0, 0],
      [4, 2, 0],
      [5, 1, 0],
      [6, 0, 0],
    ]

    // act
    const result = getPossibleMoveBlackKing(board, row + 1, col + 1)

    // assert
    expect(result).toStrictEqual(expected)
  })
})