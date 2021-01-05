import { getPDNFromBoard } from '@/store/services/boardParsingService' 
import { getBoard } from '../board'

const turn = 'O'
const isPlayerBlack = true
describe('Converting Board to PDN (Reversed)', () => {
  describe('Starting position', () => {
    it ('returns the starting position given the PDN string', () => {
      // Arrange
      const whitePosList = [42, 44, 46, 48, 49, 51, 53, 55, 56, 58, 60, 62, 64]
      const blackPosList = [1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 21, 23]
      const whiteKingList = []
      const blackKingList = []
      const board = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)
      
      const expected = `[FEN "O:W23,21,19,17,16,14,12,10,9,7,5,3,1:B64,62,60,58,55,53,51,49,48,46,44,42"]`
      
      // Act
      const result = getPDNFromBoard(board, turn, isPlayerBlack)

      // Assert
      expect(result).toEqual(expected)
    })
  }),

  describe('Two Kings', () => {
    for (let i=0; i < 3; i++) {
      it (`returns a PDN representing a board with two kings where their positions are defined ${i}`, () => {
        // Arrange
        const min = 1
        const max = 65
        const randRange = (min, max) => Math.floor(Math.random() * (max - min) + min) 
        const whiteKPos = randRange(min, max) 
        let blackKPos = randRange(min, max)
        while (blackKPos === whiteKPos) {
          blackKPos = randRange(min, max)
        }

        const whitePosList = []
        const blackPosList = []
        const whiteKingList = [65 - whiteKPos]
        const blackKingList = [65 - blackKPos]
        const board = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)
        
        const expected = `[FEN "O:WK${whiteKPos}:BK${blackKPos}"]`
        
        // Act 
        const result = getPDNFromBoard(board, turn, isPlayerBlack)
        
        // Assert
        expect(result).toStrictEqual(expected)
      })
    }
  }),

  describe('One white piece only', () => {
    for (let i=1; i < 65; i++) {
      it (`returns a PDN representing a board with only one white piece ${i}`, () => {
        // Arrange
        const whitePosList = [i]
        const blackPosList = []
        const whiteKingList = []
        const blackKingList = []
        const board = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)
        
        const expected = `[FEN "O:W${65-i}"]`

        // Act 
        const result = getPDNFromBoard(board, turn, isPlayerBlack)

        // Assert
        expect(result).toStrictEqual(expected)
      })
  }
  }),
  
  describe('One black piece only', () => {
    for (let i=1; i < 65; i++) {
      it (`returns a PDN representing a board with only one black piece ${i}`, () => {
        // Arrange
        const whitePosList = []
        const blackPosList = [i]
        const whiteKingList = []
        const blackKingList = []
        const board = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)
        
        const expected = `[FEN "O:B${65-i}"]`

        // Act
        const result = getPDNFromBoard(board, turn, isPlayerBlack)

        // Assert
        expect(result).toStrictEqual(expected)
      })
    }
  }),

  describe('One white king only', () => {
    for (let i=1; i < 65; i++) {
      it (`returns a board with only one white king ${i}`, () => {
        // Arrange
        const whitePosList = []
        const blackPosList = []
        const whiteKingList = [i]
        const blackKingList = []
        const board = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)
        const expected = `[FEN "O:WK${65-i}"]`

        // Act 
        const result = getPDNFromBoard(board, turn, isPlayerBlack)

        // Assert
        expect(result).toStrictEqual(expected)
      })
    }
  }),

  describe('One black king only', () => {
    for (let i=1; i < 65; i++) {
      it (`returns a board with only one black king ${i}`, () => {
        // Arrange
        const whitePosList = []
        const blackPosList = []
        const whiteKingList = []
        const blackKingList = [i]
        const board = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)
        const expected = `[FEN "O:BK${65-i}"]`

        // Act 
        const result = getPDNFromBoard(board, turn, isPlayerBlack)

        // Assert
        expect(result).toStrictEqual(expected)
      })
    }
  }),

  describe('Custom positions', () => {
    it ('returns a board with the correct piece positions', () => {
      // Arrange
      let whitePosList = [5,7,1,3,10,12,16,23,25,19]
      let blackPosList = [42,46,44,48,53,49,58,62,64]

      whitePosList = whitePosList.map(i => 65 - i)
      blackPosList = blackPosList.map(i => 65 - i)

      const whiteKingList = []
      const blackKingList = []
      const board = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)
      const expected = `[FEN "O:W25,23,19,16,12,10,7,5,3,1:B64,62,58,53,49,48,46,44,42"]`

      // Act 
      const result = getPDNFromBoard(board, turn, isPlayerBlack)

      // Assert
      expect(result).toStrictEqual(expected)
    }),

    it ('returns a board with the correct piece positions 2', () => {
      // Arrange
      let blackPosList = [5,1,3,12,23,25,19]
      let whitePosList = [42,46,44,49,62,64]
      let blackKingList = [10]
      let whiteKingList = [53, 58]
      whitePosList = whitePosList.map(i => 65 - i)
      blackPosList = blackPosList.map(i => 65 - i)
      whiteKingList = whiteKingList.map(i => 65 - i)
      blackKingList = blackKingList.map(i => 65 - i)

      const expected = `[FEN "O:W64,62,K58,K53,49,46,44,42:B25,23,19,12,K10,5,3,1"]`
      const board = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)

      // Act 
      const result = getPDNFromBoard(board, turn, isPlayerBlack)

      // Assert
      expect(result).toStrictEqual(expected)
    }),

    it ('returns a board with the correct piece positions 3', () => {
      // Arrange
      let whitePosList = [5,1,3,25,19]
      let blackPosList = [42,46,49,62,64]
      let whiteKingList = [10, 12, 23]
      let blackKingList = [44, 53, 58]
      whitePosList.map(i => 65 - i)
      blackPosList.map(i => 65 - i)
      whiteKingList.map(i => 65 - i)
      blackKingList.map(i => 65 - i)

      const board = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)
      const expected = `[FEN "O:W64,62,60,K55,K53,46,K42,40:B23,K21,19,16,K12,K7,3,1"]`

      // Act 
      const result = getPDNFromBoard(board, turn, isPlayerBlack)

      // Assert
      expect(result).toStrictEqual(expected)
    }),

    it ('returns a board with the correct piece positions 4', () => {
      // Arrange
      let whitePosList = [1,17,33,49]
      let blackPosList = [8,24,40,56]
      let whiteKingList = []
      let blackKingList = []

      whitePosList = whitePosList.map(i => 65 - i)
      blackPosList = blackPosList.map(i => 65 - i)

      const board = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)
      const expected = `[FEN "O:W49,33,17,1:B56,40,24,8"]`

      // Act     
      const result = getPDNFromBoard(board, turn, isPlayerBlack)

      // Assert
      expect(result).toStrictEqual(expected)
    })
  })
})