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
  }
}

export default actions