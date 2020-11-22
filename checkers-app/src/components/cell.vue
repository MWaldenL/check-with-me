<template>
  <td class="dark" @click="onSquareClicked()" v-if="isDark">
    <div id="checker-black" class="chip black-chip" :style="blackOpacity" v-show="hasBlackChip">
      <img class="king" src="../../public/assets/king.png" v-show="hasBlackKing"/>
    </div>
    <div id="checker-white" class="chip white-chip" :style="whiteOpacity" v-show="hasWhiteChip">
      <img class="king" src="../../public/assets/king.png" v-show="hasWhiteKing"/>
    </div>
  </td>
  <td class="light" v-else></td>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: ['row', 'col'],
  data () {
    return {
      blackOpacity: { opacity: '100%' },
      whiteOpacity: { opacity: '100%' }
    }
  },
  computed: {
    ...mapGetters(['getEntireBoard', 'getFirstClick']),
    isDark () {
      return (this.row % 2 === 1) ? this.col % 2 === 1 : this.col % 2 === 0
    },

    hasBlackChip () {
      return this.getEntireBoard[this.row - 1][this.col - 1].bHasBlackChip
    },

    hasWhiteChip () {
      return this.getEntireBoard[this.row - 1][this.col - 1].bHasWhiteChip
    },

    hasBlackKing () {
      return this.getEntireBoard[this.row - 1][this.col - 1].bHasBlackKing
    },

    hasWhiteKing () {
      return this.getEntireBoard[this.row - 1][this.col - 1].bHasWhiteKing
    }
  },
  methods: {
    ...mapActions(['aMoveForward', 'aHighlight', 'aCapturePiece']),
    focus () {
      this.blackOpacity.opacity = this.blackOpacity.opacity === '100%' ? '50%' : '100%'
      this.whiteOpacity.opacity = this.whiteOpacity.opacity === '100%' ? '50%' : '100%'
    },

    onSquareClicked () {
      const source = this.getFirstClick
      if (source != null) {
        const coords = {
          nRow: source.nRow,
          nCol: source.nCol,
          nDestRow: this.row,
          nDestCol: this.col
        }

        const bIsCaptureAttempt =
          (this.row === source.nRow + 2 && this.col === source.nCol + 2) ||
          (this.row === source.nRow + 2 && this.col === source.nCol - 2) ||
          (this.row === source.nRow - 2 && this.col === source.nCol + 2) ||
          (this.row === source.nRow - 2 && this.col === source.nCol - 2)

        const bIsMoveForwardAttempt =
          (this.row === source.nRow + 1 && this.col === source.nCol + 1) ||
          (this.row === source.nRow + 1 && this.col === source.nCol - 1) ||
          (this.row === source.nRow - 1 && this.col === source.nCol + 1) ||
          (this.row === source.nRow - 1 && this.col === source.nCol - 1)

        if (bIsCaptureAttempt) {
          this.aCapturePiece(coords)
        } else if (bIsMoveForwardAttempt) {
          this.aMoveForward(coords)
        } else {
          if (this.hasBlackChip || this.hasWhiteChip) {
            this.aHighlight({ nRow: this.row, nCol: this.col })
          } else {
            this.aHighlight(null)
          }
        }
      } else {
        this.aHighlight({ nRow: this.row, nCol: this.col })
      }
    }
  }
}
</script>

<style scoped>
.dark {
  background-color: #779556;
  height: 100px;
  width: 100px;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.light {
  background-color: #ebecd0;
  height: 100px;
  width: 100px;
  margin: 0;
  padding: 0;
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
