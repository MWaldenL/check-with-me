import axios from 'axios'
import { auth, usersCollection } from '@/firebase'

const actions = {
  /**
   * Sets the current game 
   * @param gameID the Firebase game ID
   */
  aSetCurrentGame({ commit }, gameID) {
    commit('setCurrentGame', gameID)
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
   * Sets the host's time left from the database
   */
  async aSetHostTimeLeft({ commit }) {
    await axios
      .get('http://localhost:5000/timeLeft/H48woDfI1lwIGZnJh4qz/host')
      .then(res => {
        commit('setHostTimeLeft', res.data.timeLeft)
      }).catch(err => {
        console.log(err)
      })
  },

  /**
   * Sets the other player's time left from the database
   */
  async aSetOtherTimeLeft({ commit }) {
    await axios
      .get('http://localhost:5000/timeLeft/H48woDfI1lwIGZnJh4qz/other')
      .then(res => {
        commit('setOtherTimeLeft', res.data.timeLeft)
      }).catch(err => {
        console.log(err)
      })
  },

  async aGetEnemyUsername({ commit, state }) {
    const uid = auth.currentUser.uid === state.hostUser ? 
      state.otherUser : 
      state.hostUser
    const userDoc = await usersCollection.doc(uid).get()
    const username = userDoc.data().username  

    commit('setEnemyUsername', username)
  }  
}

export default actions