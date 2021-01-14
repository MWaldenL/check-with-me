import axios from 'axios'
import { auth, usersCollection, timersCollection } from '@/firebase'

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
  aSetFirstRun({ commit }, val) {
    commit('mSetFirstRun', val)
  },

  /**
   * Sets the host's time left from the database
   */
  async aSetHostTimeLeft({ commit }) {
    setTimeout(async () => {
      await axios
        .get('http://localhost:5000/timeLeft/H48woDfI1lwIGZnJh4qz/host')
        .then(res => {
          commit('mSetHostTimeLeft', res.data.timeLeft)
        }).catch(err => {
          console.log(err)
        })
    }, 1000)
    
    // Delay 100ms for error padding
    // setTimeout(async () => {
      // const timerDoc = await timersCollection.doc('H48woDfI1lwIGZnJh4qz').get()
      // const data = timerDoc.data()
      // commit('mSetHostTimeLeft', data.host_timeLeft)
    // }, 50)
  },

  /**
   * Sets the other player's time left from the database
   */
  async aSetOtherTimeLeft({ commit }) {
    setTimeout(async () => {
      await axios
        .get('http://localhost:5000/timeLeft/H48woDfI1lwIGZnJh4qz/other')
        .then(res => {
          commit('mSetOtherTimeLeft', res.data.timeLeft)
        }).catch(err => {
          console.log(err)
        })
    }, 1000)

    // Delay 100ms for error padding
    // setTimeout(async () => {
      // const timerDoc = await timersCollection.doc('H48woDfI1lwIGZnJh4qz').get()
      // const data = timerDoc.data()
      // commit('mSetOtherTimeLeft', data.other_timeLeft)
    // }, 50)
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