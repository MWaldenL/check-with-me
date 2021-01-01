import { usersCollection } from '@/firebase'

const actions = {
  /**
   * Sets the user state 
   * @param user the logged in user or a null object  
   */
  async setUser({ commit }, user) {
    commit('setUserLoggedIn', user !== null)
    if (user) {
      const doc = await usersCollection.doc(user.uid).get()
      const data = doc.data()
      commit('setUserData', data)
    } else {
      commit('setUserData', null)
    }
  },

  /**
   * Logs the user out and destroys local user state 
   */
  async logoutUser({ commit }) {
    commit('setUserLoggedIn', false)
    commit('setUserData', null)
  }
}

export default actions
