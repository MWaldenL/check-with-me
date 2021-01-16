import { checkIfEnemyStuck } from '@/store/services/winCheckerService'
import { getBoardFromPDN } from '@/store/services/boardParsingService'

describe ('Checking if the enemy is stuck', () => {
  describe ('Checking if black has no more legal moves', () => {
    describe ('black piece stuck', () => {
      it ('black piece blocked from top right corner', () => {
        // Arrange
        const pdn = `[FEN "O:W55,46:B64"]`
        const isBlack = true
        const board = getBoardFromPDN(pdn, !isBlack)
        const expected = true

        // Act
        const result = checkIfEnemyStuck(board, true)

        // Assert
        expect(result).toEqual(expected)
      }),

      it ('black piece blocked on both directions', () => {
        // Arrange
        const pdn = `[FEN "O:W19,23,28,30:B37"]`
        const isBlack = true
        const board = getBoardFromPDN(pdn, !isBlack)
        const expected = true

        // Act
        const result = checkIfEnemyStuck(board, true)

        // Assert
        expect(result).toEqual(expected)
      })    
    })

    describe ('black king stuck', () => {
      it ('black king blocked from bottom left corner', () => {
        // Arrange
        const pdn = `[FEN "O:W55,46:BK64"]`
        const isBlack = true
        const board = getBoardFromPDN(pdn, !isBlack)
        const expected = true

        // Act
        const result = checkIfEnemyStuck(board, true)

        // Assert
        expect(result).toEqual(expected)
      }),
      it ('black king blocked on all four directions', () => {
        // Arrange
        const pdn = `[FEN "O:W55,51,46,44,30,28,23,19:BK37"]`
        const isBlack = true
        const board = getBoardFromPDN(pdn, !isBlack)
        const expected = true

        // Act
        const result = checkIfEnemyStuck(board, true)

        // Assert
        expect(result).toEqual(expected)
      })
    })
  })  
})