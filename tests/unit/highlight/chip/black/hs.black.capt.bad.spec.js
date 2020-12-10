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

describe('blocked capture attempt for black', () => {
  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ B _ _ _ _ _
   * _ W _ _ _ _ _ _
   * W _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('when southwest has white chip, two spaces southwest has white chip, southeast is free and valid, \
  return coordinates of latest for movement', () => {
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
      bHasBlackChip: false,
      bHasWhiteChip: true
    }

    board[1][0] = {
      nRow: 2, 
      nCol: 1, 
      bHasBlackChip: false,
      bHasWhiteChip: true
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
   * _ W _ _ _ _ _ _
   * B _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('when southwest has white chip, two spaces southwest has black chip, southeast is free and valid, \
  return coordinates of latest for movement', () => {
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
      bHasBlackChip: false,
      bHasWhiteChip: true
    }

    board[1][0] = {
      nRow: 2, 
      nCol: 1, 
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
   * _ _ _ W _ _ _ _
   * _ _ _ _ W _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('when southeast has white chip, two spaces southeast has white chip, southwest is free and valid, \
  return coordinates of latest for movement', () => {
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
      bHasBlackChip: false,
      bHasWhiteChip: true
    }

    board[1][4] = {
      nRow: 2, 
      nCol: 5, 
      bHasBlackChip: false,
      bHasWhiteChip: true
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
   * _ _ _ W _ _ _ _
   * _ _ _ _ B _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('when southeast has white chip, two spaces southeast has black chip, southwest is free and valid, \
  return coordinates of latest for movement', () => {
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
      bHasBlackChip: false,
      bHasWhiteChip: true
    }

    board[1][4] = {
      nRow: 2, 
      nCol: 5, 
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
   * _ B _ _ _ _ _ _
   * W _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('when southwest has white chip, two spaces southwest is invalid, southeast is free and valid, \
  return coordinates of latest for movement', () => {
    // arrange
    const board = getBoard()

    board[3][1] = {
      nRow: 4, 
      nCol: 2, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    board[2][0] = {
      nRow: 3, 
      nCol: 1, 
      bHasBlackChip: false,
      bHasWhiteChip: true
    }

    const expected = [
      [2, 2, 0]
    ]

    // act
    const result = getPossibleMoveBlack(board, board[3][1].nRow, board[3][1].nCol)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ B _
   * _ _ _ _ _ _ _ W
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('when southeast has white chip, two spaces southeast is invalid, southwest is free and valid, \
  return coordinates of latest for movement', () => {
    // arrange
    const board = getBoard()

    board[3][6] = {
      nRow: 4, 
      nCol: 7, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    board[2][7] = {
      nRow: 3, 
      nCol: 8, 
      bHasBlackChip: false,
      bHasWhiteChip: true
    }

    const expected = [
      [2, 5, 0]
    ]

    // act
    const result = getPossibleMoveBlack(board, board[3][6].nRow, board[3][6].nCol)

    // assert
    expect(result).toStrictEqual(expected)
  })
})