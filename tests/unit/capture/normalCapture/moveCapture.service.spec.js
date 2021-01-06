import {
  bSourceHasBlack,
  bSourceHasWhite,
  bPieceExistsAdj,
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

describe ('Capture moves', () => {
  describe ('White captures', () => {
    describe ('bSourceHasWhite', () => {
      it ('returns true if a source square contains a white piece', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 5
        }

        board[2][2] = {
          nRow: 3, nCol: 3, bHasWhiteChip: true, bHasBlackChip: false
        }

        const expected = true

        // Act
        const result = bSourceHasWhite(board, coords);

        // Assert
        expect(result).toBe(expected)
      }),

      it ('returns false if a source square is empty', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 5
        }

        board[2][2] = {
          nRow: 3, nCol: 3, bHasWhiteChip: false, bHasBlackChip: false
        }

        const expected = false

        // Act
        const result = bSourceHasWhite(board, coords);

        // Assert
        expect(result).toBe(expected)
      }) 

      it ('returns false if a source square contains a black piece', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 5
        }

        board[2][2] = {
          nRow: 3, nCol: 3, bHasWhiteChip: false, bHasBlackChip: true
        }

        const expected = false

        // Act
        const result = bSourceHasWhite(board, coords);

        // Assert
        expect(result).toBe(expected)
      }) 
    }),

    describe ('bPieceExistsAdj', () => {
      it ('returns true if the top right adjacent piece is black', () => {
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
        const result = bPieceExistsAdj(board, coords, true)
  
        // Assert
        /**
         * _ _ _ _ _
         * _ _ _ b _
         * _ _ w _ _
         * _ _ _ _ _
         * _ _ _ _ _
         */
        expect(result).toBe(expected)
      }), 

      it ('returns true if the top left adjacent piece is black', () => {
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
        const result = bPieceExistsAdj(board, coords, true)
  
        // Assert
        /**
         * _ _ _ _ _
         * _ b _ _ _
         * _ _ w _ _
         * _ _ _ _ _
         * _ _ _ _ _
         */
        expect(result).toBe(expected)
      }),

      it ('returns false if there is no piece adjacent to the top left or right', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 1
        }

        board[2][2] = {
          nRow: 3, nCol: 3, bHasWhiteChip: true, bHasBlackChip: false
        }

        const expected = false
  
        // Act
        const result = bPieceExistsAdj(board, coords, true)
  
        // Assert
        /**
         * _ _ _ _ _
         * _ _ _ _ _
         * _ _ w _ _
         * _ _ _ _ _
         * _ _ _ _ _
         */
        expect(result).toBe(expected)
      }),

      it ('returns false if there is a white piece adjacent to the top left', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 1
        }
  
        board[2][2] = {
          nRow: 3, nCol: 3, bHasWhiteChip: true, bHasBlackChip: false
        }
        board[3][1] = {
          nRow: 4, nCol: 2, bHasWhiteChip: true, bHasBlackChip: false
        }
  
        const expected = false
  
        // Act
        const result = bPieceExistsAdj(board, coords, true)
  
        // Assert
        /**
         * _ _ _ _ _
         * _ w _ _ _
         * _ _ w _ _
         * _ _ _ _ _
         * _ _ _ _ _
         */
        expect(result).toBe(expected)
      }),

      it ('returns false if there is a white piece adjacent to the top right', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 1
        }
  
        board[2][2] = {
          nRow: 3, nCol: 3, bHasWhiteChip: true, bHasBlackChip: false
        }
        board[3][3] = {
          nRow: 4, nCol: 2, bHasWhiteChip: true, bHasBlackChip: false
        }
  
        const expected = false
  
        // Act
        const result = bPieceExistsAdj(board, coords, true)
  
        // Assert
        /**
         * _ _ _ _ _
         * _ _ _ w _
         * _ _ w _ _
         * _ _ _ _ _
         * _ _ _ _ _
         */
        expect(result).toBe(expected)
      })
    })
  })

  describe ('Black captures', () => {
    describe ('bSourceHasBlack', () => {
      it ('returns true if the source piece is black', () => {
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
        /**
         * _ _ _ _ _
         * _ _ _ _ _
         * _ _ b _ _
         * _ _ _ _ _
         * _ _ _ _ _
         */
        expect(result).toBe(expected)
      }), 

      it ('returns false if the source square is empty', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 5
        }
  
        board[2][2] = {
          nRow: 3, nCol: 3, bHasWhiteChip: false, bHasBlackChip: false
        }
  
        const expected = false
  
        // Act
        const result = bSourceHasBlack(board, coords);
  
        // Assert
        /**
         * _ _ _ _ _
         * _ _ _ _ _
         * _ _ _ _ _
         * _ _ _ _ _
         * _ _ _ _ _
         */
        expect(result).toBe(expected)
      }),

      it ('returns false if the source piece is white', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 5
        }
  
        board[2][2] = {
          nRow: 3, nCol: 3, bHasWhiteChip: true, bHasBlackChip: false
        }
  
        const expected = false
  
        // Act
        const result = bSourceHasBlack(board, coords);
  
        // Assert
        /**
         * _ _ _ _ _
         * _ _ _ _ _
         * _ _ w _ _
         * _ _ _ _ _
         * _ _ _ _ _
         */
        expect(result).toBe(expected)
      })
    })

    describe ('bPieceExistsAdj', () => {
      it ('returns true if the top right adjacent piece is white', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 5
        }
  
        board[2][2] = {
          nRow: 3, nCol: 3, bHasWhiteChip: false, bHasBlackChip: true
        }
        board[3][3] = {
          nRow: 4, nCol: 4, bHasWhiteChip: true, bHasBlackChip: false
        }
  
        const expected = true
  
        // Act
        const result = bPieceExistsAdj(board, coords, false)
  
        // Assert
        /**
         * _ _ _ _ _
         * _ _ _ w _
         * _ _ b _ _
         * _ _ _ _ _
         * _ _ _ _ _
         */
        expect(result).toBe(expected)
      }), 

      it ('returns true if the top left adjacent piece is white', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 1
        }
  
        board[2][2] = {
          nRow: 3, nCol: 3, bHasWhiteChip: false, bHasBlackChip: true
        }
        board[3][1] = {
          nRow: 4, nCol: 2, bHasWhiteChip: true, bHasBlackChip: false
        }
  
        const expected = true
  
        // Act
        const result = bPieceExistsAdj(board, coords, false)

  
        // Assert
        /**
         * _ _ _ _ _
         * _ w _ _ _
         * _ _ b _ _
         * _ _ _ _ _
         * _ _ _ _ _
         */
        expect(result).toBe(expected)
      }),

      it ('returns false if there is no piece adjacent to the top left or right', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 1
        }

        board[2][2] = {
          nRow: 3, nCol: 3, bHasWhiteChip: false, bHasBlackChip: true
        }

        const expected = false
  
        // Act
        const result = bPieceExistsAdj(board, coords, false)
  
        // Assert
        /**
         * _ _ _ _ _
         * _ _ _ _ _
         * _ _ b _ _
         * _ _ _ _ _
         * _ _ _ _ _
         */
        expect(result).toBe(expected)
      }),

      it ('returns false if there is a black piece adjacent to the top left', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 1
        }
  
        board[2][2] = {
          nRow: 3, nCol: 3, bHasWhiteChip: false, bHasBlackChip: true
        }
        board[3][1] = {
          nRow: 4, nCol: 2, bHasWhiteChip: false, bHasBlackChip: true
        }
  
        const expected = false
  
        // Act
        const result = bPieceExistsAdj(board, coords, false)
  
        // Assert
        /**
         * _ _ _ _ _
         * _ b _ _ _
         * _ _ b _ _
         * _ _ _ _ _
         * _ _ _ _ _
         */
        expect(result).toBe(expected)
      }),
 
      it ('returns false if there is a black piece adjacent to the top left', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 1
        }
  
        board[2][2] = {
          nRow: 3, nCol: 3, bHasWhiteChip: false, bHasBlackChip: true
        }
        board[3][3] = {
          nRow: 4, nCol: 2, bHasWhiteChip: false, bHasBlackChip: true
        }
  
        const expected = false
  
        // Act
        const result = bPieceExistsAdj(board, coords, false)
  
        // Assert
        /**
         * _ _ _ _ _
         * _ _ _ b _
         * _ _ b _ _
         * _ _ _ _ _
         * _ _ _ _ _
         */
        expect(result).toBe(expected)
      })
    })
  }) 

  describe ('bPieceExistsAfterAdj', () => {
    describe ('White checks', () => {
      it ('returns false if the adjacent square to the top right after that is empty', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 5
        }
  
        board[2][2] = {
          nRow: 3, nCol: 3, bHasWhiteChip: true, bHasBlackChip: false
        }
  
        const expected = false
  
        // Act
        const result = bPieceExistsAfterAdj(board, coords);
  
        // Assert
        /**
         * _ _ _ _ _
         * _ _ _ _ _
         * _ _ w _ _
         * _ _ _ _ _
         * _ _ _ _ _
         */
        expect(result).toBe(expected)
      }),
  
      it ('returns false if the adjacent square to the top left after that is empty', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 1
        }
  
        board[2][2] = {
          nRow: 3, nCol: 3, bHasWhiteChip: true, bHasBlackChip: false
        }
  
        const expected = false
  
        // Act
        const result = bPieceExistsAfterAdj(board, coords);
  
        // Assert
        /**
         * _ _ _ _ _
         * _ _ _ _ _
         * _ _ w _ _
         * _ _ _ _ _
         * _ _ _ _ _
         */
        expect(result).toBe(expected)
      }),
  
      it ('returns true if the adjacent square to the top right after that contains a white piece', () => {
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
        /**
         * _ _ _ _ w
         * _ _ _ _ _
         * _ _ w _ _
         * _ _ _ _ _
         * _ _ _ _ _
         */
        expect(result).toBe(expected)
      }),
  
      it('returns true if the adjacent square to the top left after that contains a black piece', () => {
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
    }),

    describe ('Black checks', () => {
      it ('returns false if the adjacent square to the top right after that is empty', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 5
        }
  
        board[2][2] = {
          nRow: 3, nCol: 3, bHasWhiteChip: false, bHasBlackChip: true
        }
  
        const expected = false
  
        // Act
        const result = bPieceExistsAfterAdj(board, coords);
  
        // Assert
        /**
         * _ _ _ _ _
         * _ _ _ _ _
         * _ _ b _ _
         * _ _ _ _ _
         * _ _ _ _ _
         */
        expect(result).toBe(expected)
      }),
  
      it ('returns false if the adjacent square to the top left after that is empty', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 1
        }
  
        board[2][2] = {
          nRow: 3, nCol: 3, bHasWhiteChip: false, bHasBlackChip: true
        }
  
        const expected = false
  
        // Act
        const result = bPieceExistsAfterAdj(board, coords);
  
        // Assert
        /**
         * _ _ _ _ _
         * _ _ _ _ _
         * _ _ b _ _
         * _ _ _ _ _
         * _ _ _ _ _
         */
        expect(result).toBe(expected)
      }),
  
      it ('returns true if the adjacent square to the top right after that contains a black piece', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 5
        }
  
        board[2][2] = {
          nRow: 3, nCol: 3, bHasWhiteChip: false, bHasBlackChip: true
        }
        board[4][4] = {
          nRow: 5, nCol: 5, bHasWhiteChip: false, bHasBlackChip: true
        }
  
        const expected = true
  
        // Act
        const result = bPieceExistsAfterAdj(board, coords);
  
        // Assert
        /**
         * _ _ _ _ b
         * _ _ _ _ _
         * _ _ b _ _
         * _ _ _ _ _
         * _ _ _ _ _
         */
        expect(result).toBe(expected)
      }),
  
      it('returns true if the adjacent square to the top left after that contains a white piece', () => {
        // Arrange
        const board = getBoard()
        const coords = {
          nRow: 3, nCol: 3, nDestRow: 5, nDestCol: 1
        }
  
        board[2][2] = {
          nRow: 3, nCol: 3, bHasWhiteChip: false, bHasBlackChip: true
        }
        board[4][0] = {
          nRow: 5, nCol: 1, bHasWhiteChip: true, bHasBlackChip: false
        }
  
        const expected = true
  
        // Act
        const result = bPieceExistsAfterAdj(board, coords);
  
        // Assert
        /**
         * b _ _ _ _
         * _ _ _ _ _
         * _ _ b _ _
         * _ _ _ _ _
         * _ _ _ _ _
         */
        expect(result).toBe(expected)
      })
    })
  })

  describe ('bCanCapture', () => {
    
  })
})