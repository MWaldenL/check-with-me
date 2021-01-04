import { getPDNFromBoard } from '@/store/services/boardParsingService' 
import { getBoard } from './board'

const turn = 'O'
describe('Converting Board to PDN', () => {
  describe('Starting position', () => {
    it ('returns the starting position given the PDN string', () => {
      // Arrange
      const whitePosList = [1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 21, 23]
      const blackPosList = [42, 44, 46, 48, 49, 51, 53, 55, 56, 58, 60, 62, 64]
      const whiteKingList = []
      const blackKingList = []
      const board = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)
      
      const expected = `[FEN "O:W1,3,5,7,10,12,14,16,17,19,21,23:B42,44,46,48,49,51,53,55,56,58,60,62,64"]`
      
      // Act
      const result = getPDNFromBoard(board, turn)

      // Assert
      expect(result).toEqual(expected)
    })
  }),

  describe('Two Kings', () => {
    it ('returns a PDN representing a board with two kings where their positions are defined', () => {
      // Arrange
      const whitePosList = []
      const blackPosList = []
      const whiteKingList = [1]
      const blackKingList = [42]
      const board = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)
      
      const expected = `[FEN "O:WK1:BK42"]`

      // Act 
      const result = getPDNFromBoard(board, turn)

      // Assert
      expect(result).toStrictEqual(expected)
    })
  }),

  describe('One white piece only', () => {
    it ('returns a PDN representing a board with only one white piece 1', () => {
      // Arrange
      const whitePosList = [19]
      const blackPosList = []
      const whiteKingList = []
      const blackKingList = []
      const board = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)
      
      const expected = `[FEN "O:W19"]`

      // Act 
      const result = getPDNFromBoard(board, turn)

      // Assert
      expect(result).toStrictEqual(expected)
    })
  }),
  
  describe('One black piece only', () => {
    it ('returns a PDN representing a board with only one black piece', () => {
      // Arrange
      const whitePosList = []
      const blackPosList = [42]
      const whiteKingList = []
      const blackKingList = []
      const board = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)
      
      const expected = `[FEN "O:B42"]`

      // Act
      const result = getPDNFromBoard(board, turn)

      // Assert
      expect(result).toStrictEqual(expected)
    })
  }),

  describe('One white king only', () => {
    it ('returns a board with only one white king', () => {
      // Arrange
      const whitePosList = []
      const blackPosList = []
      const whiteKingList = [1]
      const blackKingList = []
      const board = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)
      const expected = `[FEN "O:WK1"]`

      // Act 
      const result = getPDNFromBoard(board, turn)

      // Assert
      expect(result).toStrictEqual(expected)
    })
  }),

  describe('One black king only', () => {
    it ('returns a board with only one black king', () => {
      // Arrange
      const whitePosList = []
      const blackPosList = []
      const whiteKingList = []
      const blackKingList = [64]
      const board = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)
      const expected = `[FEN "O:BK64"]`

      // Act 
      const result = getPDNFromBoard(board, turn)

      // Assert
      expect(result).toStrictEqual(expected)
    })
  }),

  describe('Custom positions', () => {
    it ('returns a board with the correct piece positions', () => {
      // Arrange
      const whitePosList = [5,7,1,3,10,12,16,23,25,19]
      const blackPosList = [42,46,44,48,53,49,58,62,64]
      const whiteKingList = []
      const blackKingList = []
      const board = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)
      const expected = `[FEN "O:W1,3,5,7,10,12,16,19,23,25:B42,44,46,48,49,53,58,62,64"]`

      // Act 
      const result = getPDNFromBoard(board, turn)

      // Assert
      expect(result).toStrictEqual(expected)
    }),

    it ('returns a board with the correct piece positions 2', () => {
      // Arrange
      const whitePosList = [5,1,3,12,23,25,19]
      const blackPosList = [42,46,44,49,62,64]
      const whiteKingList = [10]
      const blackKingList = [53, 58]
      const expected = `[FEN "O:W1,3,5,K10,12,19,23,25:B42,44,46,49,K53,K58,62,64"]`
      const board = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)

      // Act 
      const result = getPDNFromBoard(board, turn)

      // Assert
      expect(result).toStrictEqual(expected)
    }),

    it ('returns a board with the correct piece positions 3', () => {
      // Arrange
      const whitePosList = [5,1,3,25,19]
      const blackPosList = [42,46,49,62,64]
      const whiteKingList = [10, 12, 23]
      const blackKingList = [44, 53, 58]
      const board = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)
      const expected = `[FEN "O:W1,3,5,K10,K12,19,K23,25:B42,K44,46,49,K53,K58,62,64"]`

      // Act 
      const result = getPDNFromBoard(board, turn)

      // Assert
      expect(result).toStrictEqual(expected)
    }),

    it ('returns a board with the correct piece positions 3', () => {
      // Arrange
      const whitePosList = [1,17,33,49]
      const blackPosList = [8,24,40,56]
      const whiteKingList = []
      const blackKingList = []
      const board = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)
      const expected = `[FEN "O:W1,17,33,49:B8,24,40,56"]`

      // Act     
      const result = getPDNFromBoard(board, turn)

      // Assert
      expect(result).toStrictEqual(expected)
    })
  })
})