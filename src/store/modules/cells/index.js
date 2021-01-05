import getters from './getters'
import actions from './actions'
import mutations from './mutations'

import { getBoard } from '../board'

const state = {
  cells: getBoard(),
  nWhiteCount: 12,
  nBlackCount: 12,
  firstClick: null,
  bActiveGame: true,
  bLastMoveLegal: true,
  bStartedCaptureSequence: false,
  cWinner: 'N' //'B' black 'W' white 'N' none 'D' draw
}

export default {
  state,
  getters,
  actions,
  mutations
}
