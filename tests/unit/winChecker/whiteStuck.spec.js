import { checkIfSelfStuck } from '@/store/services/winCheckerService'
import { getBoardFromPDN } from '@/store/services/boardParsingService'

describe ('Checking if white has no more legal moves', () => {
  describe ('White piece stuck', () => {
    it ('white piece blocked from bottom left corner', () => {
      // Arrange
      const pdn = `[FEN "O:W1:B10,19"]`
      const board = getBoardFromPDN(pdn)
      const isWhite = true
      const expected = true

      // Act
      const result = checkIfSelfStuck(board, isWhite)

      // Assert
      expect(result).toEqual(expected)
    }),

    it ('white piece blocked on both directions', () => {
      // Arrange
      const pdn = `[FEN "O:W28:B35,37,42,46"]`
      const board = getBoardFromPDN(pdn)
      const isWhite = true
      const expected = true

      // Act
      const result = checkIfSelfStuck(board, isWhite)

      // Assert
      expect(result).toEqual(expected)
    })    
  })

  describe ('White king stuck', () => {
    it ('white king blocked from bottom left corner', () => {
      // Arrange
      const pdn = `[FEN "O:WK1:B10,19"]`
      const board = getBoardFromPDN(pdn)
      const isWhite = true
      const expected = true

      // Act
      const result = checkIfSelfStuck(board, isWhite)

      // Assert
      expect(result).toEqual(expected)
    })
  }),

  it ('white king blocked on all four directions', () => {
    // Arrange
    const pdn = `[FEN "O:WK28:B10,14,19,21,35,37,42,46"]`
    const board = getBoardFromPDN(pdn)
    const isWhite = true
    const expected = true

    // Act
    const result = checkIfSelfStuck(board, isWhite)

    // Assert
    expect(result).toEqual(expected)
  })
})  