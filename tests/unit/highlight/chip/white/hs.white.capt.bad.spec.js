import { getPossibleMoves } from '@/store/services/highlightService'

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

const isWhite = true

describe ('Blocked capture attempt for white', () => {
  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ B _ _ _ _
   * _ _ _ _ B _ _ _
   * _ _ _ _ _ W _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it ('returns coordinates of latest for movement \
      when northwest has black chip, two spaces northwest has black chip, northeast is free and valid', 
      () => {
    // Arrange
    const board = getBoard()

    board[4][5] = {
      nRow: 5, 
      nCol: 6, 
      bHasBlackChip: false,
      bHasWhiteChip: true
    }

    board[5][4] = {
      nRow: 6, 
      nCol: 5, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    board[6][3] = {
      nRow: 7, 
      nCol: 4, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    const expected = [
      [5, 6, 0]
    ]

    // act
    const result = getPossibleMoves(board, board[4][5].nRow, board[4][5].nCol, isWhite)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ W _ _ _ _
   * _ _ _ _ B _ _ _
   * _ _ _ _ _ W _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it ('returns coordinates of latest for movement \
    when northwest has black chip, two spaces northwest has white chip, northeast is free and valid', 
    () => {
    // arrange
    const board = getBoard()

    board[4][5] = {
      nRow: 5, 
      nCol: 6, 
      bHasBlackChip: false,
      bHasWhiteChip: true
    }

    board[5][4] = {
      nRow: 6, 
      nCol: 5, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    board[6][3] = {
      nRow: 7, 
      nCol: 4, 
      bHasBlackChip: false,
      bHasWhiteChip: true
    }

    const expected = [
      [5, 6, 0]
    ]

    // act
    const result = getPossibleMoves(board, board[4][5].nRow, board[4][5].nCol, isWhite)

    // assert
    expect(result).toStrictEqual(expected)
  })
  
  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ B
   * _ _ _ _ _ _ B _
   * _ _ _ _ _ W _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('when northeast has black chip, two spaces northeast has black chip, northwest is free and valid, \
  return coordinates of latest for movement', () => {
    // arrange
    const board = getBoard()

    board[4][5] = {
      nRow: 5, 
      nCol: 6, 
      bHasBlackChip: false,
      bHasWhiteChip: true
    }

    board[5][6] = {
      nRow: 6, 
      nCol: 7, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    board[6][7] = {
      nRow: 7, 
      nCol: 8, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    const expected = [
      [5, 4, 0]
    ]

    // act
    const result = getPossibleMoves(board, board[4][5].nRow, board[4][5].nCol, isWhite)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ W
   * _ _ _ _ _ _ B _
   * _ _ _ _ _ W _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('when northeast has black chip, two spaces northeast has white chip, northwest is free and valid, \
  return coordinates of latest for movement', () => {
    // arrange
    const board = getBoard()

    board[4][5] = {
      nRow: 5, 
      nCol: 6, 
      bHasBlackChip: false,
      bHasWhiteChip: true
    }

    board[5][6] = {
      nRow: 6, 
      nCol: 7, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    board[6][7] = {
      nRow: 7, 
      nCol: 8, 
      bHasBlackChip: false,
      bHasWhiteChip: true
    }

    const expected = [
      [5, 4, 0]
    ]

    // act
    const result = getPossibleMoves(board, board[4][5].nRow, board[4][5].nCol, isWhite)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ B
   * _ _ _ _ _ _ W _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('when northeast has white chip, two spaces northeast is invalid, northwest is free and valid, \
  return coordinates of latest for movement', () => {
    // arrange
    const board = getBoard()

    board[4][6] = {
      nRow: 5, 
      nCol: 7, 
      bHasBlackChip: false,
      bHasWhiteChip: true
    }

    board[5][7] = {
      nRow: 6, 
      nCol: 8, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    const expected = [
      [5, 5, 0]
    ]

    // act
    const result = getPossibleMoves(board, board[4][6].nRow, board[4][6].nCol, isWhite)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * B _ _ _ _ _ _ _
   * _ W _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('when northwest has white chip, two spaces northwest is invalid, northeast is free and valid, \
  return coordinates of latest for movement', () => {
    // arrange
    const board = getBoard()

    board[4][1] = {
      nRow: 5, 
      nCol: 2, 
      bHasBlackChip: false,
      bHasWhiteChip: true
    }

    board[5][0] = {
      nRow: 6, 
      nCol: 1, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    const expected = [
      [5, 2, 0]
    ]

    // act
    const result = getPossibleMoves(board, board[4][1].nRow, board[4][1].nCol, isWhite)

    // assert
    expect(result).toStrictEqual(expected)
  })
})