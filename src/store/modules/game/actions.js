import axios from 'axios'
import { auth, usersCollection, gamesCollection, timersCollection } from '@/firebase'

const actions = {
  /**
   * Sets the current game 
   * @param gameID the Firebase game ID
   */
  aSetCurrentGame({ commit }, gameID) {
    commit('mSetCurrentGame', gameID)
  },

  /**
   * Sets the host user 
   * @param uid the Firebase UID of the game's host 
   */
  aSetHostUser({ commit }, uid) {
    commit('mSetHostUser', uid)
  },

  /** 
   * Sets the other user 
   * @param uid the Firebase UID of the game's other user 
   */
  aSetOtherUser({ commit }, uid) {
    commit('mSetOtherUser', uid)
  },

  /**
   * Sets the host color 
   * @param isWhite whether the host's is playing white
   */
  aSetHostIsWhite({ commit }, isWhite) {
    commit('mSetHostIsWhite', isWhite)
  },

  /**
   * Sets whether the game is being run for the first time
   * @param val if the game is being run for the first time
   */
  async aSetFirstRun({ commit }, value) {
    const gameDoc = await gamesCollection.doc('Vc0H4f4EvY6drRKnvsk5')
    gameDoc.update({ is_first_run: value })
  },

  /**
   * Sets the host's time left from the database
   */
  async aSetHostTimeLeft({ commit }) {      
    const timerDoc = await timersCollection.doc('H48woDfI1lwIGZnJh4qz').get()
    const data = timerDoc.data()
    commit('mSetHostTimeLeft', data.host_timeLeft)
  },

  /**
   * Sets the other player's time left from the database
   */
  async aSetOtherTimeLeft({ commit }) {
    const timerDoc = await timersCollection.doc('H48woDfI1lwIGZnJh4qz').get()
    const data = timerDoc.data()
    commit('mSetOtherTimeLeft', data.other_timeLeft)
  },

  async aGetEnemyUsername({ commit, state }) {
    const uid = auth.currentUser.uid === state.hostUser ? 
      state.otherUser : 
      state.hostUser
    const userDoc = await usersCollection.doc(uid).get()
    const username = userDoc.data().username  

    commit('mSetEnemyUsername', username)
  }
}

export default actions