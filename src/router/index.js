import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from  'firebase'
import { routes } from './routes'

Vue.use(VueRouter)
const router = new VueRouter({ routes })

// Handle routes here
router.beforeEach(async (to, from, next) => {
  const user = await firebase.getCurrentUser()
  const { requiresAuth, requiresNotAuth } = to.meta
  const isDifferentRoute = to.name !== from.name

  const isGuestAccessingAuthRoute = requiresAuth && !user && isDifferentRoute
  const isAuthAccessingGuestRoute = requiresNotAuth && user && isDifferentRoute
  const isInsideGameRoom = from.name === 'PlayBoard'

  // Handle routing
  if (isAuthAccessingGuestRoute) { // Prioritize
    next({ name: 'GameLobby' })
  } else if (isGuestAccessingAuthRoute) {
    next({ name: 'Login' })
  } else if (isInsideGameRoom) {
    next({ name: from.name })
  } else {
    next()
  }
})

export default router
