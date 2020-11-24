<template>
  <td class="square dark" @click="onSquareClicked()" v-if="isDark">
    <div id="checker-black" class="chip black-chip" :style="blackOpacity" v-show="hasBlackChip">
      <img class="king" src="../../public/assets/king.png" v-show="hasBlackKing"/>
    </div>
    <div id="checker-white" class="chip white-chip" :style="whiteOpacity" v-show="hasWhiteChip">
      <img class="king" src="../../public/assets/king.png" v-show="hasWhiteKing"/>
    </div>
  </td>
  <td class="square light" v-else></td>
</template>

<script>
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
      firstClick: 'getFirstClick'
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
    ...mapActions(['aMoveForward', 'aHighlight', 'aCapturePiece', 'aKingCapturePiece']),
    focus () {
      this.blackOpacity.opacity = this.blackOpacity.opacity === '100%' ? '50%' : '100%'
      this.whiteOpacity.opacity = this.whiteOpacity.opacity === '100%' ? '50%' : '100%'
    },

    onSquareClicked () {
      const source = this.firstClick

      if (source != null) {
        this.isSelected = false
        const coords = {
          nRow: source.nRow,
          nCol: source.nCol,
          nDestRow: this.row,
          nDestCol: this.col
        }

        // Check for move or capture attempts. No legality checking
        if (this.isCaptureAttempt(source)) {
          console.log(source)
          if (source.bHasWhiteKing || source.bHasBlackKing) {
            this.aKingCapturePiece(coords)
          } else {
            this.aCapturePiece(coords)
          }
        } else if (this.isMoveForwardAttempt(source)) {
          this.aMoveForward(coords)
        } else if (this.isKingCaptureAttempt(source)) {
          this.aKingCapturePiece(coords)
        } else {
          if (this.hasBlackChip || this.hasWhiteChip) {
            this.aHighlight({ nRow: this.row, nCol: this.col })
          }
        }
      } else {
        if (this.hasBlackChip || this.hasWhiteChip || this.hasBlackKing || this.hasWhiteKing) {
          this.isSelected = true

          let location
          if (this.hasWhiteKing) {
            location = { 
              nRow: this.row, 
              nCol: this.col, 
              bHasWhiteChip: true,  
              bHasWhiteKing: true,
              bHasBlackChip: false,
              bHasBlackKing: false
            }
          } else if (this.hasBlackKing) {
            location = { 
              nRow: this.row, 
              nCol: this.col, 
              bHasWhiteChip: false,
              bHasWhiteKing: false,
              bHasBlackChip: true,
              bHasBlackKing: true,
            }
          }
          
          this.aHighlight(location)
        }
      }
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
        (this.row === source.nRow - 1 && this.col === source.nCol - 1)
    },

    isKingCaptureAttempt (source) {
      return (this.row < source.nRow && this.col > source.nCol) ||
        (this.row < source.nRow + 1 && this.col < source.nCol) ||
        (this.row > source.nRow - 1 && this.col > source.nCol) ||
        (this.row > source.nRow - 1 && this.col < source.nCol)
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
