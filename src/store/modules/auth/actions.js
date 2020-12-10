import { db } from '@/firebase'

const actions = {
  async setUser({ commit }, user) {
    commit('setUserLoggedIn', user !== null)
    if (user) {
      console.log('user exists')
      console.log(user)
      const doc = await db.collection('users').doc(user.uid).get()
      const data = doc.data()
      console.log(data)
      commit('setUserData', { 
        displayName: data.displayName,
        email: data.email
      })
    } else {
      commit('setUserData', null)
    }
  },

  async logoutUser({ commit }, user) {
    commit('setUserLoggedIn', false)
    commit('setUserData', null)
  }
}

export default actions
