import Cells from '@/store/modules/cells/index.js'
import { getBoard } from './board'

const n = 3
describe('Mutation testing', () => {
  describe('Highlighting the selected cell', () => {
    it(`sets the firstClick cell's to the coordinates of the cell
      clicked`, () => {
        const state = {
          firstClick: null,
          cells: getBoard(n)
        }
        
        let coords = { nRow: 2, nCol: 2 }
        Cells.mutations.mHighlight(state, coords)
        expect(state.firstClick).toBe(coords)
      })
  }),

  describe('Moving a piece forward', () => {
    it('Replaces the board with a deep copy of the updated board which \
      contains the new position of a white chip and sets the first click to null', () => {
      // Arrange
      const board = new Array(2).fill(null).map(() => Array(2))
      
      /**
       * Starting position looks like this:
       * _ _
       * o _
       */

      board[0][0] = { 
        nRow: 1, nCol: 1, 
        bHasBlackChip: false,
        bHasBlackKing: false, 
        bHasWhiteChip: true,
        bHasWhiteKing: false,
        isHighlighted: false,
        isPossibleCapture: false,
        isPossibleMove: false
      }
      
      board[0][1] = { 
        nRow: 1, nCol: 2, 
        bHasBlackChip: false,
        bHasBlackKing: false, 
        bHasWhiteChip: false,
        bHasWhiteKing: false,
        isHighlighted: false,
        isPossibleCapture: false,
        isPossibleMove: false
      }

      board[1][0] = { 
        nRow: 2, nCol: 1, 
        bHasBlackChip: false,
        bHasBlackKing: false, 
        bHasWhiteChip: false,
        bHasWhiteKing: false,
        isHighlighted: false,
        isPossibleCapture: false,
        isPossibleMove: false
      }

      board[1][1] = { 
        nRow: 2, nCol: 2, 
        bHasBlackChip: false,
        bHasBlackKing: false, 
        bHasWhiteChip: false,
        bHasWhiteKing: false,
        isHighlighted: false,
        isPossibleCapture: false,
        isPossibleMove: false
      }

      const state = {
        cells: board,
        firstClick: {row: 1, col: 1}
      }

      const expected = [
        [
          { nRow: 1, nCol: 1, 
            bHasBlackChip: false,
            bHasBlackKing: false, 
            bHasWhiteChip: false,
            bHasWhiteKing: false,
            isHighlighted: false,
            isPossibleCapture: false,
            isPossibleMove: false
          },
          { nRow: 1, nCol: 2,             
            bHasBlackChip: false,
            bHasBlackKing: false, 
            bHasWhiteChip: false,
            bHasWhiteKing: false,
            isHighlighted: false,
            isPossibleCapture: false,
            isPossibleMove: false
          }
        ],
        [
          { nRow: 2, nCol: 1, 
            bHasBlackChip: false,
            bHasBlackKing: false, 
            bHasWhiteChip: false,
            bHasWhiteKing: false,
            isHighlighted: false,
            isPossibleCapture: false,
            isPossibleMove: false
          },
          { nRow: 2, nCol: 2,
            bHasBlackChip: false,
            bHasBlackKing: false, 
            bHasWhiteChip: true,
            bHasWhiteKing: false,
            isHighlighted: false,
            isPossibleCapture: false,
            isPossibleMove: false
          }
        ]
      ]

      /**
       * Ending position:
       * _ o
       * _ _
       */

      let coords = { nRow: 1, nCol: 1, nDestRow: 2, nDestCol: 2 }
      Cells.mutations.mMoveForward(state, coords)
      expect(state.cells).toStrictEqual(expected)
      expect(state.firstClick).toBe(null)
    }),

    it('Replaces the board with a deep copy of the updated board which \
      contains the new position of a black chip and sets the first click to null', () => {
      // Arrange
      const board = new Array(2).fill(null).map(() => Array(2))
      
      /**
       * Starting position looks like this:
       * _ _
       * o _
       */

      board[0][0] = { 
        nRow: 1, nCol: 1, 
        bHasBlackChip: true,
        bHasBlackKing: false, 
        bHasWhiteChip: false,
        bHasWhiteKing: false,
        isHighlighted: false,
        isPossibleCapture: false,
        isPossibleMove: false
      }
      
      board[0][1] = { 
        nRow: 1, nCol: 2, 
        bHasBlackChip: false,
        bHasBlackKing: false, 
        bHasWhiteChip: false,
        bHasWhiteKing: false,
        isHighlighted: false,
        isPossibleCapture: false,
        isPossibleMove: false
      }

      board[1][0] = { 
        nRow: 2, nCol: 1, 
        bHasBlackChip: false,
        bHasBlackKing: false, 
        bHasWhiteChip: false,
        bHasWhiteKing: false,
        isHighlighted: false,
        isPossibleCapture: false,
        isPossibleMove: false
      }

      board[1][1] = { 
        nRow: 2, nCol: 2, 
        bHasBlackChip: false,
        bHasBlackKing: false, 
        bHasWhiteChip: false,
        bHasWhiteKing: false,
        isHighlighted: false,
        isPossibleCapture: false,
        isPossibleMove: false
      }

      const state = {
        cells: board,
        firstClick: {row: 1, col: 1}
      }

      const expected = [
        [
          { nRow: 1, nCol: 1, 
            bHasBlackChip: false,
            bHasBlackKing: false, 
            bHasWhiteChip: false,
            bHasWhiteKing: false,
            isHighlighted: false,
            isPossibleCapture: false,
            isPossibleMove: false
          },
          { nRow: 1, nCol: 2,             
            bHasBlackChip: false,
            bHasBlackKing: false, 
            bHasWhiteChip: false,
            bHasWhiteKing: false,
            isHighlighted: false,
            isPossibleCapture: false,
            isPossibleMove: false
          }
        ],
        [
          { nRow: 2, nCol: 1, 
            bHasBlackChip: false,
            bHasBlackKing: false, 
            bHasWhiteChip: false,
            bHasWhiteKing: false,
            isHighlighted: false,
            isPossibleCapture: false,
            isPossibleMove: false
          },
          { nRow: 2, nCol: 2,
            bHasBlackChip: true,
            bHasBlackKing: false, 
            bHasWhiteChip: false,
            bHasWhiteKing: false,
            isHighlighted: false,
            isPossibleCapture: false,
            isPossibleMove: false
          }
        ]
      ]

      let coords = { nRow: 1, nCol: 1, nDestRow: 2, nDestCol: 2 }
      
      // Act
      Cells.mutations.mMoveForward(state, coords)

      // Assert
      /**
       * Ending position:
       * _ o
       * _ _
       */
      expect(state.cells).toStrictEqual(expected)
      expect(state.firstClick).toBe(null)
    })
  })

  describe('Capturing a piece', () => {
    it('Replaces the board with a deep copy of the updated board which \
      contains the new position of a white chip', () => {
        // Arrange
        /**
         * Starting position looks like this:
         * _ _ _
         * _ x _
         * o _ _
         */
        const board = getBoard(n)
        board[0][0] = { 
          nRow: 1, 
          nCol: 1, 
          bHasBlackChip: false, 
          bHasWhiteChip: true,
          bHasBlackKing: false,
          bHasWhiteKing: false,
          isHighlighted: false,
          isPossibleCapture: false,
          isPossibleMove: false
        }

        board[1][1] = {
          nRow: 2, 
          nCol: 2, 
          bHasBlackChip: true, 
          bHasWhiteChip: false,
          bHasBlackKing: false,
          bHasWhiteKing: false,
          isHighlighted: false,
          isPossibleCapture: false,
          isPossibleMove: false
        }
  
        const state = {
          cells: board,
          firstClick: {row: 0, col: 0}
        }
  
        const expected = [
          [
            { nRow: 1, nCol: 1,  
              bHasBlackChip: false,
              bHasBlackKing: false, 
              bHasWhiteChip: false,
              bHasWhiteKing: false,
              isHighlighted: false,
              isPossibleCapture: false,
              isPossibleMove: false
            },
            { nRow: 1, nCol: 2, 
              bHasBlackChip: false,
              bHasBlackKing: false, 
              bHasWhiteChip: false,
              bHasWhiteKing: false,
              isHighlighted: false,
              isPossibleCapture: false,
              isPossibleMove: false
            },
            { nRow: 1, nCol: 3, 
              bHasBlackChip: false,
              bHasBlackKing: false, 
              bHasWhiteChip: false,
              bHasWhiteKing: false,
              isHighlighted: false,
              isPossibleCapture: false,
              isPossibleMove: false
            }
          ],
          [
            { nRow: 2, nCol: 1,  
              bHasBlackChip: false,
              bHasBlackKing: false, 
              bHasWhiteChip: false,
              bHasWhiteKing: false,
              isHighlighted: false,
              isPossibleCapture: false,
              isPossibleMove: false
            },
            { nRow: 2, nCol: 2,  
              bHasBlackChip: false,
              bHasBlackKing: false, 
              bHasWhiteChip: false,
              bHasWhiteKing: false,
              isHighlighted: false,
              isPossibleCapture: false,
              isPossibleMove: false
            },
            { nRow: 2, nCol: 3,  
              bHasBlackChip: false,
              bHasBlackKing: false, 
              bHasWhiteChip: false,
              bHasWhiteKing: false,
              isHighlighted: false,
              isPossibleCapture: false,
              isPossibleMove: false
            }
          ],
          [
            { nRow: 3, nCol: 1, 
              bHasBlackChip: false,
              bHasBlackKing: false, 
              bHasWhiteChip: false,
              bHasWhiteKing: false,
              isHighlighted: false,
              isPossibleCapture: false,
              isPossibleMove: false
            },
            { nRow: 3, nCol: 2, 
              bHasBlackChip: false,
              bHasBlackKing: false, 
              bHasWhiteChip: false,
              bHasWhiteKing: false,
              isHighlighted: false,
              isPossibleCapture: false,
              isPossibleMove: false
            },
            { nRow: 3, nCol: 3, 
              bHasBlackChip: false,
              bHasBlackKing: false, 
              bHasWhiteChip: true,
              bHasWhiteKing: false,
              isHighlighted: false,
              isPossibleCapture: false,
              isPossibleMove: false
            }
          ]
        ]

        const expectedFirstClick = {
          nRow: 3,
          nCol: 3, 
          bHasBlackChip: false, 
          bHasBlackKing: false, 
          bHasWhiteChip: true, 
          bHasWhiteKing: false, 
        }

        // Act
        let coords = { nRow: 1, nCol: 1, nDestRow: 3, nDestCol: 3 }
        Cells.mutations.mCapturePiece(state, coords)

        // Assert
        /**
         * Ending position looks like this:
         * _ _ o
         * _ _ _
         * _ _ _
         */
        expect(state.cells).toStrictEqual(expected)
        expect(state.firstClick).toStrictEqual(expectedFirstClick)
    }),

    it('Replaces the board with a deep copy of the updated board which \
      contains the new position of a black chip', () => {
        // Arrange
        /**
         * Starting position looks like this:
         * _ _ _
         * _ w _
         * b _ _
         */
        const board = getBoard(n)
        board[0][0] = { 
          nRow: 1, 
          nCol: 1, 
          bHasBlackChip: true, 
          bHasWhiteChip: false,
          bHasBlackKing: false,
          bHasWhiteKing: false,
          isHighlighted: false,
          isPossibleCapture: false,
          isPossibleMove: false
        }

        board[1][1] = {
          nRow: 2, 
          nCol: 2, 
          bHasBlackChip: false, 
          bHasWhiteChip: true,
          bHasBlackKing: false,
          bHasWhiteKing: false,
          isHighlighted: false,
          isPossibleCapture: false,
          isPossibleMove: false
        }

        const state = {
          cells: board,
          firstClick: {row: 0, col: 0}
        }

        const expected = [
          [
            { nRow: 1, nCol: 1,  
              bHasBlackChip: false,
              bHasBlackKing: false, 
              bHasWhiteChip: false,
              bHasWhiteKing: false,
              isHighlighted: false,
              isPossibleCapture: false,
              isPossibleMove: false
            },
            { nRow: 1, nCol: 2, 
              bHasBlackChip: false,
              bHasBlackKing: false, 
              bHasWhiteChip: false,
              bHasWhiteKing: false,
              isHighlighted: false,
              isPossibleCapture: false,
              isPossibleMove: false
            },
            { nRow: 1, nCol: 3, 
              bHasBlackChip: false,
              bHasBlackKing: false, 
              bHasWhiteChip: false,
              bHasWhiteKing: false,
              isHighlighted: false,
              isPossibleCapture: false,
              isPossibleMove: false
            }
          ],
          [
            { nRow: 2, nCol: 1,  
              bHasBlackChip: false,
              bHasBlackKing: false, 
              bHasWhiteChip: false,
              bHasWhiteKing: false,
              isHighlighted: false,
              isPossibleCapture: false,
              isPossibleMove: false
            },
            { nRow: 2, nCol: 2,  
              bHasBlackChip: false,
              bHasBlackKing: false, 
              bHasWhiteChip: false,
              bHasWhiteKing: false,
              isHighlighted: false,
              isPossibleCapture: false,
              isPossibleMove: false
            },
            { nRow: 2, nCol: 3,  
              bHasBlackChip: false,
              bHasBlackKing: false, 
              bHasWhiteChip: false,
              bHasWhiteKing: false,
              isHighlighted: false,
              isPossibleCapture: false,
              isPossibleMove: false
            }
          ],
          [
            { nRow: 3, nCol: 1, 
              bHasBlackChip: false,
              bHasBlackKing: false, 
              bHasWhiteChip: false,
              bHasWhiteKing: false,
              isHighlighted: false,
              isPossibleCapture: false,
              isPossibleMove: false
            },
            { nRow: 3, nCol: 2, 
              bHasBlackChip: false,
              bHasBlackKing: false, 
              bHasWhiteChip: false,
              bHasWhiteKing: false,
              isHighlighted: false,
              isPossibleCapture: false,
              isPossibleMove: false
            },
            { nRow: 3, nCol: 3, 
              bHasBlackChip: true,
              bHasBlackKing: false, 
              bHasWhiteChip: false,
              bHasWhiteKing: false,
              isHighlighted: false,
              isPossibleCapture: false,
              isPossibleMove: false
            }
          ]
        ]
        const expectedFirstClick = {
          nRow: 3,
          nCol: 3, 
          bHasBlackChip: true, 
          bHasBlackKing: false, 
          bHasWhiteChip: false, 
          bHasWhiteKing: false, 
        }

        // Act
        let coords = { nRow: 1, nCol: 1, nDestRow: 3, nDestCol: 3 }
        Cells.mutations.mCapturePiece(state, coords)

        // Assert
        /**
         * Ending position looks like this:
         * _ _ b
         * _ _ _
         * _ _ _
         */
        expect(state.cells).toStrictEqual(expected)
        expect(state.firstClick).toStrictEqual(expectedFirstClick)
    })
  })
})