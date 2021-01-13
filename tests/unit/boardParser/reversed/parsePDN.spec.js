import { getBoardFromPDN } from '@/store/services/boardParsingService'
import { getBoard } from '../board'

const isPlayerBlack = true
describe('Converting PDN to board instance (Reversed)', () => {
  describe('Starting position', () => {
    it ('returns the starting position given the PDN string', () => {
      // Arrange
      const pdn = `[FEN "O:W1,3,5,7,10,12,14,16,17,19,21,23:B42,44,46,48,49,51,53,55,56,58,60,62,64"]`
      let whitePosList = [1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 21, 23]
      let blackPosList = [42, 44, 46, 48, 49, 51, 53, 55, 56, 58, 60, 62, 64]

      whitePosList = whitePosList.map(i => 65 - i)
      blackPosList = blackPosList.map(i => 65 - i)

      const whiteKingList = []
      const blackKingList = []
      const expected = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)

      // Act 
      const result = getBoardFromPDN(pdn, isPlayerBlack)

      // Assert
      expect(result).toStrictEqual(expected)
    })
  }),

  describe('Two Kings', () => {
    for (let i=0; i < 3; i++) {
      it ('returns a board with two kings where their positions are defined', () => {
        // Arrange
        const min = 0
        const max = 65
        const randRange = (min, max) => Math.floor(Math.random() * (max - min) + min) 
        const whiteKPos = randRange(min, max) 
        let blackKPos = randRange(min, max)
        while (blackKPos === whiteKPos) {
          blackKPos = randRange(min, max)
        }

        const pdn = `[FEN "O:WK${whiteKPos}:BK${blackKPos}"]`
        const whitePosList = []
        const blackPosList = []
        let whiteKingList = [65 - whiteKPos]
        let blackKingList = [65 - blackKPos]
        const expected = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)

        // Act 
        const result = getBoardFromPDN(pdn, isPlayerBlack)

        // Assert
        expect(result).toStrictEqual(expected)
      })
    }
  }),

  describe('One white piece only', () => {
    for (let i=1; i < 65; i++) {
      it (`returns a board with only one white piece ${i}`, () => {
        // Arrange
        const pdn = `[FEN "O:W${i}"]`
        const whitePosList = [65 - i]
        const blackPosList = []
        const whiteKingList = []
        const blackKingList = []
        const expected = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)
        
        // Act 
        const result = getBoardFromPDN(pdn, isPlayerBlack)
        
        // Assert
        expect(result).toStrictEqual(expected)
      })
    }
  }),

  describe('One black piece only', () => {
    for (let i=1; i < 65; i++) {
      it (`returns a board with only one black piece ${i}`, () => {
        // Arrange
        const pdn = `[FEN "O:B${i}"]`
        const whitePosList = []
        const blackPosList = [65 - i]
        const whiteKingList = []
        const blackKingList = []
        const expected = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)
        
        // Act 
        const result = getBoardFromPDN(pdn, isPlayerBlack)
        
        // Assert
        expect(result).toStrictEqual(expected)
      })
    }
  }),

  describe('One white king only', () => {
    for (let i=1; i < 65; i++) {
      it (`returns a board with only one white king ${i}`, () => {
        // Arrange
        const pdn = `[FEN "O:WK${i}"]`
        const whitePosList = []
        const blackPosList = []
        const whiteKingList = [65 - i]
        const blackKingList = []
        const expected = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)

        // Act 
        const result = getBoardFromPDN(pdn, isPlayerBlack)

        // Assert
        expect(result).toStrictEqual(expected)
      })
    }
  }),

  describe('One black king only', () => {
    for (let i=1; i < 65; i++) {
      it (`returns a board with only one black king ${i}`, () => {
        // Arrange
        const pdn = `[FEN "O:BK${i}"]`
        const whitePosList = []
        const blackPosList = []
        const whiteKingList = []
        const blackKingList = [65-i]
        const expected = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)
        
        // Act 
        const result = getBoardFromPDN(pdn, isPlayerBlack)
        
        // Assert
        expect(result).toStrictEqual(expected)
      })
    }
  }),

  describe('Custom positions', () => {
    it ('returns a board with the correct piece positions', () => {
      // Arrange
      const pdn = `[FEN "O:W5,7,1,3,10,12,16,23,25,19:B42,46,44,48,53,49,58,62,64"]`
      let whitePosList = [5,7,1,3,10,12,16,23,25,19]
      let blackPosList = [42,46,44,48,53,49,58,62,64]
      whitePosList = whitePosList.map(i => 65 - i)
      blackPosList = blackPosList.map(i => 65 - i)
      
      const whiteKingList = []
      const blackKingList = []
      const expected = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)

      // Act 
      const result = getBoardFromPDN(pdn, isPlayerBlack)

      // Assert
      expect(result).toStrictEqual(expected)
    }),

    it ('returns a board with the correct piece positions 2', () => {
      // Arrange
      const pdn = `[FEN "O:W5,1,3,K10,12,23,25,19:B42,46,44,K53,49,K58,62,64"]`
      let whitePosList = [5,1,3,12,23,25,19]
      let blackPosList = [42,46,44,49,62,64]
      let whiteKingList = [10]
      let blackKingList = [53, 58]

      whitePosList = whitePosList.map(i => 65 - i)
      blackPosList = blackPosList.map(i => 65 - i)
      whiteKingList = whiteKingList.map(i => 65 - i)
      blackKingList = blackKingList.map(i => 65 - i)

      const expected = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)

      // Act 
      const result = getBoardFromPDN(pdn, isPlayerBlack)

      // Assert
      expect(result).toStrictEqual(expected)
    }),

    it ('returns a board with the correct piece positions 3', () => {
      // Arrange
      const pdn = `[FEN "O:W5,1,3,K10,K12,K23,25,19:B42,46,K44,K53,49,K58,62,64"]`
      let whitePosList = [5,1,3,25,19]
      let blackPosList = [42,46,49,62,64]
      let whiteKingList = [10, 12, 23]
      let blackKingList = [44, 53, 58]

      whitePosList = whitePosList.map(i => 65 - i)
      blackPosList = blackPosList.map(i => 65 - i)
      whiteKingList = whiteKingList.map(i => 65 - i)
      blackKingList = blackKingList.map(i => 65 - i)

      const expected = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)

      // Act 
      const result = getBoardFromPDN(pdn, isPlayerBlack)

      // Assert
      expect(result).toStrictEqual(expected)
    }),

    it ('returns a board with the correct piece positions 3', () => {
      // Arrange
      const pdn = `[FEN "O:W1,17,33,49:B8,24,40,56"]`
      let whitePosList = [1,17,33,49]
      let blackPosList = [8,24,40,56]
      const whiteKingList = []
      const blackKingList = []

      whitePosList = whitePosList.map(i => 65 - i)
      blackPosList = blackPosList.map(i => 65 - i)

      const expected = getBoard(whitePosList, blackPosList, whiteKingList, blackKingList)

      // Act 
      const result = getBoardFromPDN(pdn, isPlayerBlack)

      // Assert
      expect(result).toStrictEqual(expected)
    })
  })
})