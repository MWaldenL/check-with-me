const actions = {
  async aHighlight ({ commit }, coords) {
    commit('mHighlight', coords)
  },

  /**
   * aMoveForward moves a black or white chip to an empty cell 1 space diagonally
   * @param nRow - 1-based row of active cell with piece to move
   * @param nCol - 1-based column of active cell with piece to move
   * @param nDestRow - 1-based row of empty destination cell
   * @param nDestCol - 1-based column of empty destination cell
   */
  async aMoveForward ({ commit }, coords) {
    commit('mMoveForward', coords)
  },

  /**
   * aMoveForward moves a black or white chip to an empty cell 1 space diagonally
   * @param nRow - 1-based row of active cell with piece to move
   * @param nCol - 1-based column of active cell with piece to move
   * @param nDestRow - 1-based row of empty destination cell
   * @param nDestCol - 1-based column of empty destination cell
   */
  async aKingMovement ({ commit }, coords) {
    commit('mKingMovement', coords)
  },

  /**
   * aCapturePiece moves a black or white chip to capture an opposite-colored piece
   * diagonally adjacent from it.
   *
   * @param coords - an object containing the source and destination coordinates
   */
  async aCapturePiece ({ commit }, coords) {
    commit('mCapturePiece', coords)
  }
}

export default actions
