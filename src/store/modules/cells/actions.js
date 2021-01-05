import { gamesCollection } from '@/firebase'
import { getPDNFromBoard } from '../../services/boardParsingService'


const writeBoardToDB = async (cells, isPlayerBlack) => {
  await gamesCollection
    .doc('Vc0H4f4EvY6drRKnvsk5')
    .update({ 
      board_state: getPDNFromBoard(cells, 'X', isPlayerBlack) 
    })
}

const actions = {
  /**
   * Highlights the current square
   * @param coords the coordinates of the current square clicked 
   */
  aHighlight({ commit }, coords) {
    commit('mHighlight', coords)
  },

  /**
   * Unhighlights the current square
   * @param coords the coordinates of the current square clicked 
   */
  aUnhighlight({ commit }, coords) {
    commit('mUnhighlight', coords)
  },

  /**
   * Updates the board state from a PDN String
   * @param boardState 
   */
  async aUpdateBoard({ commit }, payload) {
    commit('mUpdateBoard', payload)
  },

  /**
   * aMoveForward moves a black or white chip to an empty cell 1 space diagonally
   * @param nRow - 1-based row of active cell with piece to move
   * @param nCol - 1-based column of active cell with piece to move
   * @param nDestRow - 1-based row of empty destination cell
   * @param nDestCol - 1-based column of empty destination cell
   */
  async aMoveForward({ commit, state }, payload) {
    const { coords, isPlayerBlack } = payload
    commit('mMoveForward', coords)
    writeBoardToDB(state.cells, isPlayerBlack)
  },

  /**
   * aMoveForward moves a black or white chip to an empty cell 1 space diagonally
   * @param nRow - 1-based row of active cell with piece to move
   * @param nCol - 1-based column of active cell with piece to move
   * @param nDestRow - 1-based row of empty destination cell
   * @param nDestCol - 1-based column of empty destination cell
   */
  aKingMovement({ commit, state }, payload) {
    const { coords, isPlayerBlack } = payload
    commit('mKingMovement', coords)
    writeBoardToDB(state.cells, isPlayerBlack)
  },

  /**
   * aCapturePiece moves a black or white chip to capture an opposite-colored piece
   * diagonally adjacent from it.
   *
   * @param coords - an object containing the source and destination coordinates
   */
  aCapturePiece({ commit, state }, payload) {
    const { coords, isPlayerBlack } = payload
    commit('mCapturePiece', coords)
    writeBoardToDB(state.cells, isPlayerBlack)
  },

  /**
   * aKingCapturePiece moves a black or white king to capture an opposite-colored piece
   * in its diagonal
   *
   * @param coords - an object containing the source and destination coordinates
   */
  aKingCapturePiece({ commit, state }, payload) {
    const { coords, isPlayerBlack } = payload
    commit('mKingCapturePiece', coords)
    writeBoardToDB(state.cells, isPlayerBlack)
  },

  /**
   * Sets the active state of the game. Turns clickability on/off
   * @param bIsActive whether the game is currently active
   */
  aSetActiveGame({ commit }, bIsActive) {
    commit('mSetActiveGame', bIsActive)
  },

  /**
   * Resets state to initial
   */
  aResetGame({ commit }) {
    commit('mResetGame')
  },

  /**
   * Sets the winner of the game
   * @param winner the username of the winner 
   */
  aSetWinner({ commit }, winner) {
    commit('mSetWinner', winner)
  },

  /**
   * Highlights possible captures in the board
   * @param {*} param0 
   */
  aHighlightBoardCaptures({ commit }) {
    console.log("highlighting")
    commit('mHighlightBoardCaptures')
  }
}

export default actions
