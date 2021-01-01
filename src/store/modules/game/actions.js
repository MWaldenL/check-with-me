import { gamesCollection } from '@/firebase'

const actions = {
  /**
   * Sets the current game 
   * @param gameID the Firebase game ID
   */
  aSetCurrentGame({ commit }, gameID) {
    commit('setCurrentGame', gameID)
  },

  /**
   * Sets the current game's board state 
   * @param boardState the board state in PDN format 
   */
  aSetCurrentBoardState({ commit }, boardState) {
    commit('setCurrentBoardState', boardState)
  },

  /**
   * Sets the host user 
   * @param uid the Firebase UID of the game's host 
   */
  aSetHostUser({ commit }, uid) {
    commit('setHostUser', uid)
  },

  /**
   * Sets the other user 
   * @param uid the Firebase UID of the game's other user 
   */
  aSetOtherUser({ commit }, uid) {
    commit('setOtherUser', uid)
  },

  /**
   * Sets the host color 
   * @param isWhite whether the host's is playing white
   */
  aSetHostIsWhite({ commit }, isWhite) {
    commit('setHostIsWhite', isWhite)
  },

  /**
   * Sets the last player moved
   * @param player the Firebase UID of the player who last moved
   */
  async aSetLastPlayerMoved({ commit }, player) {
    commit('setLastPlayerMoved', player)
  },

  /**
   * Sets the host's time left from the database
   */
  async aSetHostTimeLeft({ commit }) {
    const gameDoc = await gamesCollection.doc('Vc0H4f4EvY6drRKnvsk5').get()
    const timeLeft = gameDoc.data().host_timeLeft
    commit('setHostTimeLeft', timeLeft)
  },

  /**
   * Sets the other player's time left from the database
   */
  async aSetOtherTimeLeft({ commit }) {
    const gameDoc = await gamesCollection.doc('Vc0H4f4EvY6drRKnvsk5').get()
    const timeLeft = gameDoc.data().other_timeLeft
    commit('setOtherTimeLeft', timeLeft)
  }
}

export default actions