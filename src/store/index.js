import Vue from 'vue'
import Vuex from 'vuex'
import cells from './modules/cells/index.js'
import auth from './modules/auth/index.js'
import game from './modules/game/index.js'

// load vuex
Vue.use(Vuex)

// create store
export default new Vuex.Store({
  modules: {
    cells,
    auth,
    game
  }
})
