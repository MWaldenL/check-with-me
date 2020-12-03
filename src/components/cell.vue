<template>
  <td class="square dark" @click="onSquareClicked()" v-if="isDark">
    <div id="checker-black" class="chip black-chip" :style="blackOpacity" v-show="hasBlackChip">
      <img class="king" src="../../public/assets/king.png" v-show="hasBlackKing"/>
    </div>
    <div id="checker-white" class="chip white-chip" :style="whiteOpacity" v-show="hasWhiteChip">
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
      blackOpacity: { opacity: '100%' },
      whiteOpacity: { opacity: '100%' },
      isSelected: false
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
    ...mapActions(['aKingMovement', 'aMoveForward', 'aHighlight', 'aCapturePiece', 'aKingCapturePiece', 'aReducePiece', 'aSetActiveGame']),
    focus () {
      this.blackOpacity.opacity = this.blackOpacity.opacity === '100%' ? '50%' : '100%'
      this.whiteOpacity.opacity = this.whiteOpacity.opacity === '100%' ? '50%' : '100%'
    },

    cancelCurrentMove () {
      const bContainsPiece = this.hasBlackChip || this.hasWhiteChip || this.hasWhiteKing || this.hasBlackKing
      if (bContainsPiece) {
        console.log('contains piece')
        this.aHighlight({
          nRow: this.row, 
          nCol: this.col, 
          bHasBlackKing: this.hasBlackKing,
          bHasWhiteKing: this.hasWhiteKing 
        })
      } else { // Illegal move
        this.aHighlight(null)
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
          if (bIsKingMovement) {
            if (this.isKingMoveAttempt(source, coords)) {
              console.log('king move attempt')
              this.aKingMovement(coords)
            } else if (this.isKingCaptureAttempt(source, coords)) {
              this.aKingCapturePiece(coords)
              //reduce board piece
              this.aReducePiece(this.hasWhiteKing || this.hasWhiteChip)
            } else {
              this.cancelCurrentMove()
            }
          } else { 
            if (this.isCaptureAttempt(source)) {  
              this.aCapturePiece(coords)
              //reduce board piece
              this.aReducePiece(this.hasWhiteKing || this.hasWhiteChip)
            } else if (this.isMoveForwardAttempt(source)) {
              this.aMoveForward(coords)
            } else {
              this.cancelCurrentMove()
            }
          }
        } else {
          if (bContainsPiece) {
            this.isSelected = true
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
          console.log("DRAW!")
          this.aSetActiveGame(false)
        } else if (bWhiteStuck || this.whiteCount === 0) {
          console.log("BLACK WINS!")
          this.aSetActiveGame(false)
        } else if (bBlackStuck || this.blackCount === 0) {
          console.log("WHITE WINS!")
          this.aSetActiveGame(false)
        } else {
          //console.log("No winner yet")
        }
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
  height: 100px;
  width: 100px;
  margin: 0;
  padding: 0;
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
  width: 75px;
  height: 75px;
  box-sizing: border-box;
  opacity: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.black-chip {
  background: radial-gradient(50% 50% at 50% 50%, rgba(48, 48, 48, 0.74) 0%, #424242 100%);
  border: 12px solid #3A3A3A;
}

.white-chip {
  background: radial-gradient(50% 50% at 50% 50%, #FFFFFF 28.12%, #dacece 100%, #FFFFFF 100%);
  border: 12px solid #EDEDED;
}

.king {
  height: 40px;
  width: 40px;
}
</style>
