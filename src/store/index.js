import Vue from 'vue'
import Vuex from 'vuex'
import cells from './modules/cells/index.js'
import auth from './modules/auth/index.js'
import game from './modules/game/index.js'
// import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  // plugins: [createPersistedState()],
  modules: {
    cells,
    auth,
    game
  }
})
