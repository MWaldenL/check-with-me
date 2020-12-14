import { db } from '@/firebase'

const actions = {
  async setUser({ commit }, user) {
    commit('setUserLoggedIn', user !== null)
    if (user) {
      const doc = await db.collection('users').doc(user.uid).get()
      const data = doc.data()
      commit('setUserData', data)
    } else {
      commit('setUserData', null)
    }
  },

  async logoutUser({ commit }) {
    commit('setUserLoggedIn', false)
    commit('setUserData', null)
  }
}

export default actions
