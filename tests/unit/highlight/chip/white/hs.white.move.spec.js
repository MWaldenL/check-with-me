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

describe('movement for white', () => {
  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ W _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('return coordinates of northwest and northeast spaces if both are free and valid', () => {
    // arrange
    const board = getBoard()

    board[4][5] = {
      nRow: 5, 
      nCol: 6, 
      bHasBlackChip: false,
      bHasWhiteChip: true
    }

    const expected = [
      [5, 4, 0],
      [5, 6, 0]
    ]

    // act
    const result = getPossibleMoves(board, board[4][5].nRow, board[4][5].nCol, isWhite)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ W
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('return coordinates of northwest when it is free and valid, northeast is out of bounds', () => {
    // arrange
    const board = getBoard()

    board[4][7] = {
      nRow: 5, 
      nCol: 8, 
      bHasBlackChip: false,
      bHasWhiteChip: true
    }

    const expected = [
      [5, 6, 0]
    ]

    // act
    const result = getPossibleMoves(board, board[4][7].nRow, board[4][7].nCol, isWhite)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * W _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('return coordinates of northeast when it is free and valid, northwest is out of bounds', () => {
    // arrange
    const board = getBoard()

    board[4][0] = {
      nRow: 5, 
      nCol: 1, 
      bHasBlackChip: false,
      bHasWhiteChip: true
    }

    const expected = [
      [5, 1, 0]
    ]

    // act
    const result = getPossibleMoves(board, board[4][0].nRow, board[4][0].nCol, isWhite)

    // assert
    expect(result).toStrictEqual(expected)
  })

  /**
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ W _
   * _ _ _ _ _ W _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it ('return coordinates of northwest when it is free and valid, northeast has white chip', () => {
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
   * _ _ _ _ W _ _ _
   * _ _ _ _ _ W _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('return coordinates of northeast when it is free and valid, northwest has white chip', () => {
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
   * _ _ _ _ _ _ _ _
   * _ _ _ _ W _ W _
   * _ _ _ _ _ W _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   * _ _ _ _ _ _ _ _
   */
  it('return none when northwest and northeast have white chips', () => {
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
      bHasBlackChip: false,
      bHasWhiteChip: true
    }

    board[5][4] = {
      nRow: 6, 
      nCol: 5, 
      bHasBlackChip: false,
      bHasWhiteChip: true
    }

    const expected = []

    // act
    const result = getPossibleMoves(board, board[4][5].nRow, board[4][5].nCol, isWhite)

    // assert
    expect(result).toStrictEqual(expected)
  })
})