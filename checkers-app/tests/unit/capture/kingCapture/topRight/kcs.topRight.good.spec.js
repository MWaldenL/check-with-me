/**
 * Tests for valid king capture attempts
 */

import {
  bOtherExistsOnTopRight,
  bOtherExistsAfterSource,
  bPieceExistsBetweenTargetAndDest,
  bIsValidCapture
} from '@/store/services/kingCaptureService'

import {
  bSourceHasBlack,
  bSourceHasWhite
} from '@/store/services/moveCaptureService'


// 5 x 5 board
const getBoard = () => {
  const board = new Array(5).fill(null).map(() => Array(5))
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      // initialize empty cell
      const cell = {
        nRow: r + 1, // nRow number 1-8, 1 is bottom
        nCol: c + 1, // column number 1-8, 1 is leftmost
        bHasBlackChip: false, // boolean
        bHasWhiteChip: false // boolean
      }

      board[r][c] = cell
    }
  }
  return board
}

/**
 * _ _ _ _ _
 * _ _ _ _ _
 * _ _ b _ _
 * _ _ _ _ _
 * w _ _ _ _
 */
describe('bOtherExistsOnTopRight', () => {
  describe('White Source Piece', () => {
    it('returns an object { targetPiece: { nRow, nCol }, pieceExists: true } \
      if a black piece exists on the top left diagonal from a given source', () => {
      // Arrange
      const board = getBoard()
      const coords = { nRow: 1, nCol: 1, nDestRow: 5, nDestCol: 5 }
      board[0][0] = {
        nRow: 1, nCol: 1, bHasWhiteChip: true, bHasBlackChip: false, bHasWhiteKing: true, bHasBlackKing: false
      }

      board[2][2] = {
        nRow: 3, nCol: 3, bHasWhiteChip: false, bHasBlackChip: true, bHasWhiteKing: false, bHasBlackKing: false
      }

      const expected = {
        targetPiece: { nRow: 3, nCol: 3 },
        pieceExists: true
      }

      // Act
      const result = bOtherExistsOnTopRight(board, coords, bSourceHasWhite, bSourceHasBlack)

      // Assert
      expect(result).toStrictEqual(expected)
    })
  }),
  
  describe('Black Source Piece', () => {
    it('returns an object containing the piece and a boolean pieceExists = true \
      if a white piece exists on the top left diagonal from a given source', () => {
      // Arrange
      const board = getBoard()
      const coords = { nRow: 1, nCol: 1, nDestRow: 5, nDestCol: 5 }
      board[0][0] = {
        nRow: 1, nCol: 5, bHasWhiteChip: false, bHasBlackChip: true, bHasWhiteKing: false, bHasBlackKing: true
      }

      board[2][2] = {
        nRow: 3, nCol: 3, bHasWhiteChip: true, bHasBlackChip: false, bHasWhiteKing: false, bHasBlackKing: false
      }

      const expected = {
        targetPiece: { nRow: 3, nCol: 3 },
        pieceExists: true
      }

      // Act
      const result = bOtherExistsOnTopRight(board, coords, bSourceHasBlack, bSourceHasWhite)

      // Assert
      expect(result).toStrictEqual(expected)
    })
  })
})

 /**
 * _ _ b
 * _ _ _
 * w _ _
 */
describe('bOtherExistsAfterSource', () => {
  describe('White Source Piece', () => {
    it('checks if the first piece seen while traversing along the passed direction from the source is black.', () => {
      // Arrange
      const board = getBoard()
      const coords = { nRow: 1, nCol: 1, nDestRow: 5, nDestCol: 5 }
      board[0][0] = {
        nRow: 1, nCol: 1, bHasWhiteChip: true, bHasBlackChip: false, bHasWhiteKing: true, bHasBlackKing: false
      }

      board[2][2] = {
        nRow: 3, nCol: 3, bHasWhiteChip: false, bHasBlackChip: true, bHasWhiteKing: false, bHasBlackKing: false
      }

      const expected = {
        targetPiece: { nRow: 3, nCol: 3 },
        pieceExists: true
      }

      // Act
      const result = bOtherExistsAfterSource(board, coords, bSourceHasWhite, bSourceHasBlack)

      // Assert
      expect(result).toStrictEqual(expected)
    })
  })

  describe('Black Source Piece', () => {
    it('checks if the first piece seen while traversing along the passed direction from the source is white.', () => {
      // Arrange
      const board = getBoard()
      const coords = { nRow: 1, nCol: 1, nDestRow: 5, nDestCol: 5 }
      board[0][0] = {
        nRow: 1, nCol: 1, bHasWhiteChip: false, bHasBlackChip: true, bHasWhiteKing: false, bHasBlackKing: true
      }

      board[2][2] = {
        nRow: 3, nCol: 3, bHasWhiteChip: true, bHasBlackChip: false, bHasWhiteKing: false, bHasBlackKing: false
      }

      const expected = {
        targetPiece: { nRow: 3, nCol: 3 },
        pieceExists: true
      }

      // Act
      const result = bOtherExistsAfterSource(board, coords, bSourceHasBlack, bSourceHasWhite)

      // Assert
      expect(result).toStrictEqual(expected)
    })
  })
}) 

/**
 * _ _ _
 * _ _ _
 * b _ _
 */
describe('bPieceExistsBetweenTargetAndDest', () => {
  it('returns false if no piece exists between the target piece and the destination square', () => {
    // Arrange
    const board = getBoard()
    const coords = { nRow: 1, nCol: 1, nDestRow: 5, nDestCol: 5 }
    const targetPiece = { nRow: 3, nCol: 3 } 

    board[0][0] = {
      nRow: 1, nCol: 1, bHasWhiteChip: false, bHasBlackChip: true, bHasWhiteKing: false, bHasBlackKing: true
    }

    board[2][2] = {
      nRow: 3, nCol: 3, bHasWhiteChip: true, bHasBlackChip: false, bHasWhiteKing: false, bHasBlackKing: false
    }

    const expected = false

    // Act
    const result = bPieceExistsBetweenTargetAndDest(board, coords, targetPiece)

    // Assert
    expect(result).toBe(expected)
  })
})

describe('bIsValidCapture', () => {
  describe('White King Capture', () => {
    it('returns true if a king capture attempt is valid', () => {
      // Arrange
      const board = getBoard()
      const coords = { nRow: 1, nCol: 1, nDestRow: 5, nDestCol: 5 }

      board[0][0] = {
        nRow: 1, nCol: 1, bHasWhiteChip: true, bHasBlackChip: false, bHasWhiteKing: true, bHasBlackKing: false
      }

      board[2][2] = {
        nRow: 3, nCol: 3, bHasWhiteChip: false, bHasBlackChip: true, bHasWhiteKing: false, bHasBlackKing: false
      }

      const expected = true

      // Act
      const result = bIsValidCapture(board, coords, 'white')

      // Assert
      expect(result).toBe(expected)
    })
  }),

  describe('Black King Capture', () => {
    it('returns true if a king capture attempt is valid', () => {
      // Arrange
      const board = getBoard()
      const coords = { nRow: 1, nCol: 1, nDestRow: 5, nDestCol: 5 }

      board[0][0] = {
        nRow: 1, nCol: 1, bHasWhiteChip: false, bHasBlackChip: true, bHasWhiteKing: false, bHasBlackKing: true 
      }

      board[2][2] = {
        nRow: 3, nCol: 3, bHasWhiteChip: true, bHasBlackChip: false, bHasWhiteKing: false, bHasBlackKing: false
      }

      const expected = true

      // Act
      const result = bIsValidCapture(board, coords, 'black')

      // Assert
      expect(result).toBe(expected)
    })
  })
})
