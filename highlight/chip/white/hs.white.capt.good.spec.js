import { getPossibleMoveWhite } from '@/store/services/highlightService'
import { BIconFileEarmarkEaselFill } from 'bootstrap-vue'

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

describe('unblocked capture attempt for white', () => {
  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ B _ _ _
   * _ _ _ _ _ W _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('when northwest has black chip, two spaces northwest is free and valid, northeast is free and valid, \
  return coordinates of former for capture, latter two for movement', () => {
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

    const expected = [
      [5, 4, 1],
      [6, 3, 0],
      [5, 6, 0]
    ]

    // act
    const result = getPossibleMoveWhite(board, board[4][5].nRow, board[4][5].nCol)

    // assert
    expect(result).toStrictEqual(expected)
  })
  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ B _
   * _ _ _ _ _ W _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('when northeast has black chip, two spaces northeast is free and valid, northwest is free and valid, \
  return coordinates of former for capture, latter two for movement', () => {
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

    const expected = [
      [5, 4, 0],
      [5, 6, 1],
      [6, 7, 0]
    ]

    // act
    const result = getPossibleMoveWhite(board, board[4][5].nRow, board[4][5].nCol)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ B _ B _
   * _ _ _ _ _ W _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('when northwest and northeast have black chips, two spaces northeast and northwest are free and valid, \
  return coordinates of former two for capture, latter two for movement', () => {
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

    board[5][6] = {
      nRow: 6, 
      nCol: 7, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    const expected = [
      [5, 4, 1],
      [6, 3, 0],
      [5, 6, 1],
      [6, 7, 0]
    ]

    // act
    const result = getPossibleMoveWhite(board, board[4][5].nRow, board[4][5].nCol)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ B _
   * _ _ _ _ _ _ _ W
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('when northwest has black chip, two spaces northwest is free and valid, northeast is out of bounds, \
  return coordinates of first for capture, second for movement', () => {
    // arrange
    const board = getBoard()

    board[4][7] = {
      nRow: 5, 
      nCol: 8, 
      bHasBlackChip: false,
      bHasWhiteChip: true
    }

    board[5][6] = {
      nRow: 4, 
      nCol: 7, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    const expected = [
      [5, 6, 1],
      [6, 5, 0]
    ]

    // act
    const result = getPossibleMoveWhite(board, board[4][7].nRow, board[4][7].nCol)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ B _ _ _ _ _ _
   * W _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('when northeast has black chip, two spaces northeast is free and valid, northwest is out of bounds, \
  return coordinates of first for capture, second for movement', () => {
    // arrange
    const board = getBoard()

    board[4][0] = {
      nRow: 5, 
      nCol: 1, 
      bHasBlackChip: false,
      bHasWhiteChip: true
    }

    board[5][1] = {
      nRow: 6, 
      nCol: 2, 
      bHasBlackChip: true,
      bHasWhiteChip: false
    }

    const expected = [
      [5, 1, 1],
      [6, 2, 0]
    ]

    // act
    const result = getPossibleMoveWhite(board, board[4][0].nRow, board[4][0].nCol)

    // assert
    expect(result).toStrictEqual(expected)
  })
})