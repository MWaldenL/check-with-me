import getters from './getters'
import actions from './actions'
import mutations from './mutations'

import { getBoard } from '../board'

const state = {
  cells: getBoard(),
  nWhiteCount: 3,
  nBlackCount: 3,
  firstClick: null,
  bActiveGame: true,
  bLastMoveLegal: true,
  bIsCaptureRequired: false,
  bStartedCaptureSequence: false,
  prevDestSquare: null,
  cWinner: 'N' //'B' black 'W' white 'N' none 'D' draw
}

export default {
  state,
  getters,
  actions,
  mutations
}
