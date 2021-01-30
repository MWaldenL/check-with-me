import { auth, usersCollection, gamesCollection, timersCollection } from '@/firebase'
import { getSingleGame } from '@/resources/gameModel.js'
import { getSingleTimer } from '@/resources/timerModel.js'

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
  async aSetFirstRun({ state }, value) {
    await gamesCollection
      .doc(state.currentGameID)
      .update({ is_first_run: value })
  },

  /**
   * Sets the host's time left from the database
   */
  async aSetHostTimeLeft({ commit, state }) {      
    const timerDoc = await timersCollection.doc(state.timerID).get()
    const data = timerDoc.data()
    commit('mSetHostTimeLeft', data.host_timeLeft)
  },

  /**
   * Sets the other player's time left from the database
   */
  async aSetOtherTimeLeft({ commit, state }) {
    const timerDoc = await timersCollection.doc(state.timerID).get()
    const data = timerDoc.data()
    commit('mSetOtherTimeLeft', data.other_timeLeft)
  },

  /**
   * Gets the enemy username from the database
   */
  async aGetEnemyUsername({ commit, state }) {
    const uid = auth.currentUser.uid === state.hostUser ? 
      state.otherUser : 
      state.hostUser

    const userDoc = await usersCollection.doc(uid).get()
    const username = userDoc.data().username  

    commit('mSetEnemyUsername', username)
  },

  /**
   * Resets the game state. Happens during logout to prevent undefined behavior
   */
  aClearGameState({ commit }) {
    commit('mClearGameState') 
  },

  async aInitGame({ commit }, roomID) {
    const gameRef = gamesCollection.doc(roomID)
    const game = await gameRef.get()
    const gameDoc = game.data()

    const timerID = gameDoc.timer_id.id
    const timerRef = timersCollection.doc(timerID)
    const timer = await timerRef.get()
    const timerDoc = timer.data()

    //game payload
    const boardState = gameDoc.board_state
    const hostUser = gameDoc.host_user.id
    const otherUser = gameDoc.other_user.id
    const isHostWhite = gameDoc.is_host_white
    let lastPlayerMoved
    if(isHostWhite)
      lastPlayerMoved = otherUser
    else
      lastPlayerMoved = hostUser

    //timer payload
    const timeLeft = timerDoc.host_timeLeft

    commit('mSetWinner', 'N')
    commit('mInitGame', { roomID, boardState, hostUser, otherUser, isHostWhite, lastPlayerMoved, timerID, timeLeft })
  },

  /**
   * Deletes the game from the database
   */
  async aDeleteGame({ state }) {
    await gamesCollection.doc(state.currentGameID).delete()
      .then(() => {
        console.log("Game " + state.currentGameID + " successfully deleted")
      }).catch(error => {
        console.log(error)
      })
  },

  /**
   * Deletes the current timer from the database
   */
  async aDeleteTimer({ state }) {
    await timersCollection.doc(state.timerID).delete()
      .then(() => {
        console.log("Timer " + state.timerID + " successfully deleted")
      }).catch(error => {
        console.log(error)
      })
  }
}

export default actions