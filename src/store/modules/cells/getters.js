const getters = {
  getEntireBoard: state => state.cells,
  getWhiteCount: state => state.nWhiteCount,
  getBlackCount: state => state.nBlackCount,
  getFirstClick: state => state.firstClick,
  getIsLastMoveLegal: state => state.bLastMoveLegal,
  getIsCaptureRequired: state => state.bIsCaptureRequired,
  getCaptureSequenceState: state => state.bStartedCaptureSequence,
  getActiveGame: state => state.bActiveGame,
  getInactiveGame: state => !state.bActiveGame,
  getPrevDestSquare: state => state.prevDestSquare,
  getWinner: state => state.cWinner
}

export default getters
