import { gamesCollection } from '@/firebase'

const actions = {
  aSetCurrentGame({ commit }, gameID) {
    commit('setCurrentGame', gameID)
  },

  aSetCurrentBoardState({ commit }, boardState) {
    commit('setCurrentBoardState', boardState)
  },

  aSetHostUser({ commit }, uid) {
    commit('setHostUser', uid)
  },

  aSetOtherUser({ commit }, uid) {
    commit('setOtherUser', uid)
  },

  aSetHostIsWhite({ commit }, isWhite) {
    commit('setHostIsWhite', isWhite)
  },

  async aSetLastPlayerMoved({ commit }, player) {
    commit('setLastPlayerMoved', player)
  },

  async aSetHostTimeLeft({ commit, state }) {
    const currentGame = await gamesCollection.doc(state.currentGameID).get()
    const timeLeft = currentGame.data().host_timeLeft
    commit('setHostTimeLeft', timeLeft)
  },

  async aSetOtherTimeLeft({ commit, state }) {
    const currentGame = await gamesCollection.doc(state.currentGameID).get()
    const timeLeft = currentGame.data().other_timeLeft
    commit('setOtherTimeLeft', timeLeft)
  }
}

export default actions