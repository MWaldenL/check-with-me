<template>
  <td :class="highlight" class="square" @click="onSquareClicked()" v-if="isDark">
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
import { bCanCapture } from '@/store/services/moveCaptureService'
import { bIsValidCapture } from '@/store/services/kingCaptureService'
import { getPossibleKingCaptures } from '@/store/services/highlightService'
import { checkIfSelfStuck } from '@/store/services/winCheckerService'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  props: ['row', 'col', 'canMakeMove', 'selfColor'],
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
      prevDestSquare: 'getPrevDestSquare',
      blackCount: 'getBlackCount',
      bActiveGame: 'getActiveGame',
      isLastMoveLegal: 'getIsLastMoveLegal',
      isCaptureRequired: 'getIsCaptureRequired',
      isCapturing: 'getCaptureSequenceState'
    }),

    isSelected: {
      get() {
        return this.board[this.row-1][this.col-1].isHighlighted
      },
      set(val) {
        this.dIsSelected = val
      }
    },  

    isPossibleMove: {
      get() {
        return this.board[this.row-1][this.col-1].isPossibleMove
      },
      set(val) {
        this.dIsPossibleMove = val
      }
    },

    isPossibleCapture: {
      get() {
        return this.board[this.row-1][this.col-1].isPossibleCapture
      },
      set(val) {
        this.dIsPossibleCapture = val
      }
    },

    bContainsPiece() {
      return this.hasBlackChip || this.hasWhiteChip || this.hasWhiteKing || this.hasBlackKing
    },  

    highlight() {
      return {
        'highlight-selected': this.isSelected,
        'highlight-possible-move': this.isPossibleMove,
        'highlight-possible-capture': this.isPossibleCapture,
        'dark': !this.isSelected && !this.isPossibleMove && !this.isPossibleCapture
      }
    },

    isDark() {
      return (this.row % 2 === 1) ? this.col % 2 === 1 : this.col % 2 === 0
    },

    hasBlackChip() {
      return this.board[this.row - 1][this.col - 1].bHasBlackChip
    },

    hasWhiteChip() {
      return this.board[this.row - 1][this.col - 1].bHasWhiteChip
    },

    hasBlackKing() {
      return this.board[this.row - 1][this.col - 1].bHasBlackKing
    },

    hasWhiteKing() {
      return this.board[this.row - 1][this.col - 1].bHasWhiteKing
    },

    isSelectingEnemyPiece() {
      const bCurWhitePiece = this.hasWhiteChip || this.hasWhiteKing
      const bCurBlackPiece = this.hasBlackChip || this.hasBlackKing
      const isSelectingOwnPiece = 
        (this.selfColor === 'w' && bCurWhitePiece) || 
        (this.selfColor === 'b' && bCurBlackPiece) 

      return this.firstClick === null && !isSelectingOwnPiece
    },

    canSelectedPieceCapture() { 
      const coordsTopLeft = {
        nRow: this.row, 
        nCol: this.col,
        nDestRow: this.row + 2,
        nDestCol: this.col - 2
      }

      const coordsTopRight = {
        ...coordsTopLeft,
        nDestCol: this.col + 2
      }

      return bCanCapture(this.board, coordsTopLeft, this.selfColor === 'w') ||
            bCanCapture(this.board, coordsTopRight, this.selfColor === 'w')
    },

    canSelectedKingCapture() {
      const isKing = this.hasBlackKing || this.hasWhiteKing 
      if (!isKing) {
        return false
      }

      const playerIsWhite = this.selfColor === 'w'
      const possibleCaptures = getPossibleKingCaptures(this.board, this.row, this.col, playerIsWhite)
      if (possibleCaptures.length > 0) {
        const canKingCapture = possibleCaptures.reduce((a, c) => a || c[2], possibleCaptures[0][2])
        return canKingCapture === 1
      } else {
        return false
      }
    },

    isAttemptingToCaptureOutsideSequence() {
      const { nRow, nCol } = this.prevDestSquare
      return nRow !== this.row || nCol !== this.col
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

    cancelCurrentMove(isCaptureRequired) {
      if (this.bContainsPiece) {
        if (isCaptureRequired) {
          // Check if a capture can be made
          if (!this.isCapturing) {
            if (this.canSelectedPieceCapture) { // short circuit
              this.aHighlight({
                nRow: this.row, 
                nCol: this.col, 
                bHasBlackChip: this.bHasBlackChip,
                bHasWhiteChip: this.bHasWhiteChip,
                bHasBlackKing: this.hasBlackKing,
                bHasWhiteKing: this.hasWhiteKing 
              })
            } else if (this.canSelectedKingCapture) {
              this.aHighlight({
                nRow: this.row, 
                nCol: this.col, 
                bHasBlackChip: this.bHasBlackChip,
                bHasWhiteChip: this.bHasWhiteChip,
                bHasBlackKing: this.hasBlackKing,
                bHasWhiteKing: this.hasWhiteKing 
              })
            } else {
              this.aUnhighlight()
            }
          }
        } else {
          this.aHighlight({
            nRow: this.row, 
            nCol: this.col, 
            bHasBlackKing: this.hasBlackKing,
            bHasWhiteKing: this.hasWhiteKing 
          })
        }
      } else { // Illegal move
        if (!this.isCapturing) {
          this.aUnhighlight()
        }
      }
    },

    onSquareClicked() {
      if (this.bActiveGame) {
        if (this.canMakeMove) {
          const source = this.firstClick

          // Highlight or attempt to move a piece
          if (source !== null) {
            this.isSelected = false
            const coords = {
              nRow: source.nRow,
              nCol: source.nCol,
              nDestRow: this.row,
              nDestCol: this.col
            }

            // Check for move or capture attempts. No legality checking
            const bIsKingMovement = source.bHasBlackKing || source.bHasWhiteKing
            const bIsSameSquare = coords.nRow === coords.nDestRow && coords.nCol === coords.nDestCol
            const payload = { 
              coords, 
              isPlayerBlack: this.selfColor === 'b'
            }
            
            let willEmit = true
            let willEmitLastMoveCapture = false
            if (bIsSameSquare) {
              if (!this.isCapturing) {
                this.aUnhighlight()
              }
              willEmit = false
            } else if (bIsKingMovement) {
              if (this.isKingMoveAttempt(source, coords)) {
                if (!this.isCaptureRequired) {
                  this.aKingMovement(payload)
                } else {
                  if (!this.isCapturing) {
                    this.aUnhighlight()
                  }
                }
                willEmit = this.isLastMoveLegal && !this.isCaptureRequired
              } else if (this.isKingCaptureAttempt(source, coords)) {
                if (this.board[coords.nDestRow-1][coords.nDestCol-1].isPossibleMove) {
                  this.aKingCapturePiece(payload)
                  willEmit = this.isLastMoveLegal
                  willEmitLastMoveCapture = true
                } else {
                  if (!this.isCapturing) {
                    this.aUnhighlight()
                  }
                  willEmit = false
                }
              } else {
                this.cancelCurrentMove(this.isCaptureRequired)
                willEmit = false
              }
            } else { 
              if (this.isCaptureAttempt(source)) {
                if (this.board[coords.nDestRow-1][coords.nDestCol-1].isPossibleMove) {
                  this.aCapturePiece(payload)
                  willEmit = this.isLastMoveLegal
                  willEmitLastMoveCapture = true
                } else {
                  if (!this.isCapturing) {
                    this.aUnhighlight()
                  }
                  willEmit = false
                }
              } else if (this.isMoveForwardAttempt(source)) {
                //console.log(this.isCapturing)
                if (!this.isCaptureRequired) {
                  this.aMoveForward(payload)
                } else {
                  if (!this.isCapturing) {
                    //console.log('not capturing')
                    this.aUnhighlight()
                  }
                }
                willEmit = this.isLastMoveLegal && !this.isCaptureRequired
              } else {
                //console.log('else block')
                this.cancelCurrentMove(this.isCaptureRequired)
                willEmit = false
              }
            }

            // Signal the game instance that a move has been made
            if (willEmit) {
              this.$emit('makeMove', coords)
              this.$emit('isLastMoveCapture', willEmitLastMoveCapture)
            }
          } else {
            if (this.bContainsPiece) {
              // Prevent a player from clicking on another player's piece
              if (this.isSelectingEnemyPiece) {
                //console.log('select enemy')
                return
              }

              // Prevent a player from making a non-capturing move when a capture is required  s
              if (this.isCaptureRequired && !(this.canSelectedPieceCapture || this.canSelectedKingCapture)) {
                //console.log('piece cannot capture')
                return
              }

              // Prevent a player from making a capture outside the current sequence
              if (this.isCapturing && this.prevDestSquare !== null) {
                if (this.isAttemptingToCaptureOutsideSequence) {
                  //console.log('capture outside seq')
                  return
                }
              }
              // Otherwise, simply highlight the square
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
        }
      }
    },

    isDiagonal (coords) {
      return Math.abs(coords.nRow - coords.nDestRow) === Math.abs(coords.nCol - coords.nDestCol)
    },

    isCaptureAttempt (source) {
      return (this.row === source.nRow + 2 && this.col === source.nCol + 2) ||
              (this.row === source.nRow + 2 && this.col === source.nCol - 2)
    },

    isMoveForwardAttempt (source) {
      return (this.row === source.nRow + 1 && this.col === source.nCol + 1) ||
        (this.row === source.nRow + 1 && this.col === source.nCol - 1) &&
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
