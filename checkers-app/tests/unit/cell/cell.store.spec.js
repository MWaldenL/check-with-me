import Cells from '@/store/modules/cells.js'

describe('Mutation testing', () => {
  describe('Highlighting the selected cell', () => {
    it(`sets the firstClick cell's to the coordinates of the cell
      clicked`, () => {
        const state = {
          firstClick: null
        }
        
        let coords = { row: 4, col: 4 }
        Cells.mutations.mHighlight(state, coords)
        expect(state.firstClick).toBe(coords)
      })
  }),

  describe('Moving a piece forward', () => {
    it('Replaces the board with a deep copy of the updated board which \
    contains the cell at the new position', () => {
      const board = new Array(2).fill(null).map(() => Array(2))

      // Fake 2x2 board for testing
      board[0][0] = {
        nRow: 1, nCol: 1, bHasBlackChip: false, bHasWhiteChip: true
      }
      board[0][1] = {
        nRow: 1, nCol: 2, bHasBlackChip: false, bHasWhiteChip: false
      }

      board[1][0] = {
        nRow: 2, nCol: 1, bHasBlackChip: false, bHasWhiteChip: false
      }

      board[1][1] = {
        nRow: 2, nCol: 2, bHasBlackChip: false, bHasWhiteChip: false
      }

      /**
       * Starting position looks like this:
       * x x
       * o x
       */

      const state = {
        cells: board,
        firstClick: {row: 2, col: 2}
      }

      const expected = [
        [{ 
          nRow: 1, 
          nCol: 1, 
          bHasBlackChip: false,
          bHasWhiteChip: false
        },
        { 
          nRow: 1, 
          nCol: 2, 
          bHasBlackChip: false,
          bHasWhiteChip: false
        }],
        [{ 
          nRow: 2, 
          nCol: 1, 
          bHasBlackChip: false,
          bHasWhiteChip: false
        },
        { 
          nRow: 2, 
          nCol: 2, 
          bHasBlackChip: false,
          bHasWhiteChip: true
        }]
      ]

      let coords = { nRow: 1, nCol: 1, nDestRow: 2, nDestCol: 2 }
      Cells.mutations.mMoveForward(state, coords)
      expect(state.cells).toStrictEqual(expected)
      expect(state.firstClick).toBe(null)
    })
  })
})