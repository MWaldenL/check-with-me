import { getPossibleMoveBlack } from '@/store/services/highlightService'

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
        bHasWhiteChip: false
      }

      board[r][c] = cell
    }
  }
  return board
}

describe('movement for black', () => {
  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ B _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('return coordinates of southwest and southeast spaces if both are free and valid', () => {
    // arrange
    const board = getBoard()

    board[3][2] = {
      nRow: 4, 
      nCol: 3, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    const expected = [
      [2, 1, 0],
      [2, 3, 0]
    ]

    // act
    const result = getPossibleMoveBlack(board, board[3][2].nRow, board[3][2].nCol)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ B
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('return coordinates of southwest when it is free and valid, southeast is out of bounds', () => {
    // arrange
    const board = getBoard()

    board[3][7] = {
      nRow: 4, 
      nCol: 8, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    const expected = [
      [2, 6, 0]
    ]

    // act
    const result = getPossibleMoveBlack(board, board[3][7].nRow, board[3][7].nCol)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * B _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('return coordinates of southeast when it is free and valid, southwest is out of bounds', () => {
    // arrange
    const board = getBoard()

    board[3][0] = {
      nRow: 4, 
      nCol: 1, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    const expected = [
      [2, 1, 0]
    ]

    // act
    const result = getPossibleMoveBlack(board, board[3][0].nRow, board[3][0].nCol)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ B _ _ _ _ _
   * _ _ _ B _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('return coordinates of southwest when it is free and valid, southeast has black chip', () => {
    // arrange
    const board = getBoard()

    board[3][2] = {
      nRow: 4, 
      nCol: 3, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    board[2][3] = {
      nRow: 3, 
      nCol: 4, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    const expected = [
      [2, 1, 0]
    ]

    // act
    const result = getPossibleMoveBlack(board, board[3][2].nRow, board[3][2].nCol)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ B _ _ _ _ _
   * _ B _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('return coordinates of southeast when it is free and valid, southwest has black chip', () => {
    // arrange
    const board = getBoard()

    board[3][2] = {
      nRow: 4, 
      nCol: 3, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    board[2][1] = {
      nRow: 3, 
      nCol: 2, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    const expected = [
      [2, 3, 0]
    ]

    // act
    const result = getPossibleMoveBlack(board, board[3][2].nRow, board[3][2].nCol)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ B _ _ _ _ _
   * _ B _ B _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('return none when southwest and southeast have black chips', () => {
    // arrange
    const board = getBoard()

    board[3][2] = {
      nRow: 4, 
      nCol: 3, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    board[2][3] = {
      nRow: 3, 
      nCol: 4, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    board[2][1] = {
      nRow: 3, 
      nCol: 2, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    const expected = []

    // act
    const result = getPossibleMoveBlack(board, board[3][2].nRow, board[3][2].nCol)

    // assert
    expect(result).toStrictEqual(expected)
  })
})