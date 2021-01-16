import { checkIfSelfStuck } from '@/store/services/winCheckerService'
import { getBoardFromPDN } from '@/store/services/boardParsingService'

describe ('Positions where white still has legal moves', () => {
  describe ('White piece free', () => {
    it ('starting position', () => {
      // Arrange
      const pdn = `[FEN "O:W1,3,5,7,10,12,14,16,17,19,21,23:B42,44,46,48,49,51,53,55,56,58,60,62,64"]`
      const board = getBoardFromPDN(pdn)
      const isWhite = true
      const expected = false

      // Act
      const result = checkIfSelfStuck(board, isWhite)

      // Assert
      expect(result).toEqual(expected)
    }),

    it ('can still make a capture', () => {
      // Arrange
      const pdn = `[FEN "O:W1:B10"]`
      const board = getBoardFromPDN(pdn)
      const isWhite = true
      const expected = false

      // Act
      const result = checkIfSelfStuck(board, isWhite)

      // Assert
      expect(result).toEqual(expected)
    }),

    it ('can still make a move', () => {
      // Arrange
      const pdn = `[FEN "O:W1:B19"]`
      const board = getBoardFromPDN(pdn)
      const isWhite = true
      const expected = false

      // Act
      const result = checkIfSelfStuck(board, isWhite)

      // Assert
      expect(result).toEqual(expected)
    })
  })

  describe ('White king free', () => {
    it ('can still make a capture', () => {
      // Arrange
      const pdn = `[FEN "O:WK1:B10"]`
      const board = getBoardFromPDN(pdn)
      const isWhite = true
      const expected = false

      // Act
      const result = checkIfSelfStuck(board, isWhite)

      // Assert
      expect(result).toEqual(expected)
    }),

    it ('can still make a move', () => {
      // Arrange
      const pdn = `[FEN "O:WK1:B19"]`
      const board = getBoardFromPDN(pdn)
      const isWhite = true
      const expected = false

      // Act
      const result = checkIfSelfStuck(board, isWhite)

      // Assert
      expect(result).toEqual(expected)
    })
  })
})