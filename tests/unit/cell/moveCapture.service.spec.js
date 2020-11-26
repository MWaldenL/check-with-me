import {
  bSourceHasBlack,
  bSourceHasWhite,
  bBlackExistsAdj,
  bWhiteExistsAdj,
  bPieceExistsAfterAdj
} from '@/store/services/moveCaptureService'

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

      if (cell.nRow >= 6 && ((cell.nCol % 2 === 1 && cell.nRow % 2 === 1) || (cell.nCol % 2 === 0 && cell.nRow % 2 === 0))) {
        // put black chip
        cell.bHasBlackChip = true
      } else if (cell.nRow <= 3 && ((cell.nCol % 2 === 1 && cell.nRow % 2 === 1) || (cell.nCol % 2 === 0 && cell.nRow % 2 === 0))) {
        // put white chip
        cell.bHasWhiteChip = true
      }

      board[r][c] = cell
    }
  }
  return board
}

describe('Capture moves', () => {
  describe('White captures', () => {
    it('bSourceHasWhite', () => {
      // Arrange
      const board = getBoard()
      const coords = {
        nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 5
      }

      board[3][3] = {
        nRow: 3, nCol: 3, bHasWhiteChip: true, bHasBlackChip: false
      }

      const expected = true

      // Act
      const result = bSourceHasWhite(board, coords);

      // Assert
      expect(result).toBe(expected)
    }), 

    describe('bBlackExistsAdj', () => {
      it('checks if the adjacent piece is a black piece', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 5
        }
  
        board[2][2] = {
          nRow: 3, nCol: 3, bHasWhiteChip: true, bHasBlackChip: false
        }
        board[3][3] = {
          nRow: 4, nCol: 4, bHasWhiteChip: false, bHasBlackChip: true
        }
  
        const expected = true
  
        // Act
        const result = bBlackExistsAdj(board, coords);
  
        // Assert
        expect(result).toBe(expected)
      }), 

      it('checks if the adjacent piece is a black piece 2', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 1
        }
  
        board[2][2] = {
          nRow: 3, nCol: 3, bHasWhiteChip: true, bHasBlackChip: false
        }
        board[3][1] = {
          nRow: 4, nCol: 2, bHasWhiteChip: false, bHasBlackChip: true
        }
  
        const expected = true
  
        // Act
        const result = bBlackExistsAdj(board, coords);
  
        // Assert
        expect(result).toBe(expected)
      })
    })
  })

  describe('Black captures', () => {
    it('checks if the source piece is black', () => {
      // Arrange
      const board = getBoard()
      const coords = {
        nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 5
      }

      board[2][2] = {
        nRow: 3, nCol: 3, bHasWhiteChip: false, bHasBlackChip: true
      }

      const expected = true

      // Act
      const result = bSourceHasBlack(board, coords);

      // Assert
      expect(result).toBe(expected)
    }), 

    describe('bWhiteExistsAdj', () => {
      it('checks if the adjacent piece to the left is a white piece', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 5, nCol: 5, nDestRow: 3, nDestCol: 3
        }
  
        board[4][4] = {
          nRow: 5, nCol: 5, bsHasWhiteChip: false, bHasBlackChip: true
        }
        board[3][3] = {
          nRow: 4, nCol: 4, bHasWhiteChip: true, bHasBlackChip: false
        }
  
        const expected = true
  
        // Act
        const result = bWhiteExistsAdj(board, coords);
  
        // Assert
        expect(result).toBe(expected)
      }), 

      it('checks if the adjacent piece to the right is a white piece', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 3, nCol: 3, nDestRow: 1, nDestCol: 5
        }
  
        board[2][2] = {
          nRow: 3, nCol: 3, bHasWhiteChip: true, bHasBlackChip: false
        }
        board[0][4] = {
          nRow: 1, nCol: 5, bHasWhiteChip: true, bHasBlackChip: false
        }
  
        const expected = true
  
        // Act
        const result = bWhiteExistsAdj(board, coords);
  
        // Assert
        expect(result).toBe(expected)
      })
    })
  }) 

  describe('bPieceExistsAfterAdj', () => {
    it('checks if the adjacent square to the right after that is empty', () => {
      // Arrange
      const board = getBoard()
      const coords = {
        nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 5
      }

      board[2][2] = {
        nRow: 3, nCol: 3, bHasWhiteChip: true, bHasBlackChip: false
      }
      board[4][4] = {
        nRow: 5, nCol: 5, bHasWhiteChip: false, bHasBlackChip: false
      }

      const expected = false

      // Act
      const result = bPieceExistsAfterAdj(board, coords);

      // Assert
      expect(result).toBe(expected)
    }),

    it('checks if the adjacent square to the left after that is empty 2', () => {
      // Arrange
      const board = getBoard()
      const coords = {
        nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 1
      }

      board[2][2] = {
        nRow: 3, nCol: 3, bHasWhiteChip: true, bHasBlackChip: false
      }
      board[4][0] = {
        nRow: 5, nCol: 1, bHasWhiteChip: false, bHasBlackChip: false
      }

      const expected = false

      // Act
      const result = bPieceExistsAfterAdj(board, coords);

      // Assert
      expect(result).toBe(expected)
    }),

    it('checks if the adjacent square to the right after that is not empty', () => {
      // Arrange
      const board = getBoard()
      const coords = {
        nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 5
      }

      board[2][2] = {
        nRow: 3, nCol: 3, bHasWhiteChip: true, bHasBlackChip: false
      }
      board[4][4] = {
        nRow: 5, nCol: 5, bHasWhiteChip: true, bHasBlackChip: false
      }

      const expected = true

      // Act
      const result = bPieceExistsAfterAdj(board, coords);

      // Assert
      expect(result).toBe(expected)
    }),

    it('checks if the adjacent square to the left after that is not empty', () => {
      // Arrange
      const board = getBoard()
      const coords = {
        nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 1
      }

      board[2][2] = {
        nRow: 3, nCol: 3, bHasWhiteChip: true, bHasBlackChip: false
      }
      board[4][0] = {
        nRow: 5, nCol: 1, bHasWhiteChip: false, bHasBlackChip: true
      }

      const expected = true

      // Act
      const result = bPieceExistsAfterAdj(board, coords);

      // Assert
      expect(result).toBe(expected)
    })
  })
})