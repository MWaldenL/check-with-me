<template>
  <td :class="highlight" class="square" @click="onSquareClicked()" v-if="isDark">
    <!-- {{row-1}}{{col-1}} -->
    <div id="checker-black" class="chip black-chip" v-show="hasBlackChip">
      <img class="king" src="../../public/assets/king.png" v-show="hasBlackKing"/>
    </div>
    <div id="checker-white" class="chip white-chip" v-show="hasWhiteChip">
      <img class="king" src="../../public/assets/king.png" v-show="hasWhiteKing"/>
    </div>
  </td>
  <td class="square light" @click="onSquareClicked()" v-else></td>
</template>

<script>
import { 
  bIsValidCapture
} from '@/store/services/kingCaptureService'
import { 
  checkIfWhiteStuck,
  checkIfBlackStuck
} from '@/store/services/winCheckerService'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: ['row', 'col'],
  data () {
    return {
      dIsSelected: false,
      dIsPossibleMove: false,
      dIsPossibleCapture: false
    }
  },
  computed: {
    ...mapGetters({
      board: 'getEntireBoard',
      firstClick: 'getFirstClick',
      whiteCount: 'getWhiteCount',
      blackCount: 'getBlackCount',
      bActiveGame: 'getActiveGame'
    }),

    isSelected: {
      get () {
        return this.board[this.row-1][this.col-1].isHighlighted
      },
      set (val) {
        this.dIsSelected = val
      }
    },  

    isPossibleMove: {
      get () {
        return this.board[this.row-1][this.col-1].isPossibleMove
      },
      set (val) {
        this.dIsPossibleMove = val
      }
    },

    isPossibleCapture: {
      get () {
        return this.board[this.row-1][this.col-1].isPossibleCapture
      },
      set (val) {
        this.dIsPossibleCapture = val
      }
    },

    highlight () {
      return {
        'highlight-selected': this.isSelected,
        'highlight-possible-move': this.isPossibleMove,
        'highlight-possible-capture': this.isPossibleCapture,
        'dark': !this.isSelected && !this.isPossibleMove && !this.isPossibleCapture
      }
    },

    isDark () {
      return (this.row % 2 === 1) ? this.col % 2 === 1 : this.col % 2 === 0
    },

    hasBlackChip () {
      return this.board[this.row - 1][this.col - 1].bHasBlackChip
    },

    hasWhiteChip () {
      return this.board[this.row - 1][this.col - 1].bHasWhiteChip
    },

    hasBlackKing () {
      return this.board[this.row - 1][this.col - 1].bHasBlackKing
    },

    hasWhiteKing () {
      return this.board[this.row - 1][this.col - 1].bHasWhiteKing
    }
  },
  methods: {
    ...mapActions([
      'aKingMovement', 
      'aMoveForward', 
      'aHighlight', 
      'aUnhighlight', 
      'aCapturePiece', 
      'aKingCapturePiece', 
      'aSetActiveGame', 
      'aSetWinner'
    ]),

    cancelCurrentMove () {
      const bContainsPiece = this.hasBlackChip || this.hasWhiteChip || this.hasWhiteKing || this.hasBlackKing
      if (bContainsPiece) {
        this.aHighlight({
          nRow: this.row, 
          nCol: this.col, 
          bHasBlackKing: this.hasBlackKing,
          bHasWhiteKing: this.hasWhiteKing 
        })
      } else { // Illegal move
        this.aUnhighlight(null)
      }
    },

    onSquareClicked () {
      if(this.bActiveGame) {
        const source = this.firstClick
        const bContainsPiece = this.hasBlackChip || this.hasWhiteChip || this.hasWhiteKing || this.hasBlackKing

        if (source != null) {
          this.isSelected = false
          const coords = {
            nRow: source.nRow,
            nCol: source.nCol,
            nDestRow: this.row,
            nDestCol: this.col
          }
          
          const bIsKingMovement = source.bHasBlackKing || source.bHasWhiteKing
    
          // Check for move or capture attempts. No legality checking
          if (coords.nRow === coords.nDestRow && coords.nCol === coords.nDestCol) {
            this.aUnhighlight(null)
          } else if (bIsKingMovement) {
            if (this.isKingMoveAttempt(source, coords)) {
              this.aKingMovement(coords)
            } else if (this.isKingCaptureAttempt(source, coords)) {
              this.aKingCapturePiece(coords)
            } else {
              this.cancelCurrentMove()
            }
          } else { 
            if (this.isCaptureAttempt(source)) {  
              this.aCapturePiece(coords)
            } else if (this.isMoveForwardAttempt(source)) {
              this.aMoveForward(coords)
            } else {
              this.cancelCurrentMove()
            }
          }
        } else {
          if (bContainsPiece) {
            this.aHighlight({ 
              nRow: this.row, 
              nCol: this.col, 
              bHasWhiteChip: this.hasWhiteChip,  
              bHasWhiteKing: this.hasWhiteKing,
              bHasBlackChip: this.hasBlackChip,
              bHasBlackKing: this.hasBlackKing
            })
          }
        }

        let bWhiteStuck = checkIfWhiteStuck(this.board)
        let bBlackStuck = checkIfBlackStuck(this.board)
        if(bWhiteStuck && bBlackStuck) {
          this.aSetActiveGame(false)
          this.aSetWinner('D')
        } else if (bWhiteStuck || this.whiteCount === 0) {
          this.aSetActiveGame(false)
          this.aSetWinner('B')
        } else if (bBlackStuck || this.blackCount === 0) {
          this.aSetActiveGame(false)
          this.aSetWinner('W')
        } else {}
      }
    },

    isDiagonal (coords) {
      return Math.abs(coords.nRow - coords.nDestRow) === Math.abs(coords.nCol - coords.nDestCol)
    },

    isCaptureAttempt (source) {
      return (this.row === source.nRow + 2 && this.col === source.nCol + 2) ||
        (this.row === source.nRow + 2 && this.col === source.nCol - 2) ||
        (this.row === source.nRow - 2 && this.col === source.nCol + 2) ||
        (this.row === source.nRow - 2 && this.col === source.nCol - 2)
    },

    isMoveForwardAttempt (source) {
      return (this.row === source.nRow + 1 && this.col === source.nCol + 1) ||
        (this.row === source.nRow + 1 && this.col === source.nCol - 1) ||
        (this.row === source.nRow - 1 && this.col === source.nCol + 1) ||
        (this.row === source.nRow - 1 && this.col === source.nCol - 1) &&
        !(this.hasBlackChip || this.hasWhiteChip || this.hasBlackKing || this.hasWhiteKing)
    },

    isKingCaptureAttempt (source, coords) {
      let ans
      if (source.bHasWhiteKing) {
        ans = bIsValidCapture(this.board, coords, 'white').validCapture
      } else if (source.bHasBlackKing){
        ans = bIsValidCapture(this.board, coords, 'black').validCapture
      }

      return this.isDiagonal(coords) && ans
    },

    isKingMoveAttempt(source, coords) {
      return !this.isKingCaptureAttempt(source, coords) &&
        this.isDiagonal(coords) && (
          (this.row < source.nRow && this.col > source.nCol) ||
          (this.row < source.nRow && this.col < source.nCol) ||
          (this.row > source.nRow && this.col > source.nCol) ||
          (this.row > source.nRow && this.col < source.nCol)) &&
        !(this.hasBlackChip || this.hasWhiteChip || this.hasBlackKing || this.hasWhiteKing)
    }
  }
}
</script>

<style scoped>
.square {
  height: 80px;
  width: 80px;
  margin: 0;
  padding: 0;
}

.highlight-selected {
  background-color: #b3c79e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.highlight-possible-move {
  background-color: #569585;
  display: flex;
  align-items: center;
  justify-content: center;
}

.highlight-possible-capture {
  background-color: #955656;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark {
  background-color: #779556;
  display: flex;
  align-items: center;
  justify-content: center;
}

.light {
  background-color: #ebecd0;
}

.chip {
  position: absolute;
  z-index: 2;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  box-sizing: border-box;
  opacity: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.black-chip {
  background: radial-gradient(50% 50% at 50% 50%, rgba(48, 48, 48, 0.74) 0%, #424242 100%);
  border: 10px solid #3A3A3A;
}

.white-chip {
  background: radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.74) 0%, #D0D0D0 100%);
  border: 12px solid #EDEDED;
}

.king {
  height: 40px;
  width: 40px;
}
</style>
