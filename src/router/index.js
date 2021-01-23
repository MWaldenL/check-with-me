import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from  'firebase'
import { routes } from './routes'

Vue.use(VueRouter)
const router = new VueRouter({ routes })

router.beforeEach(async (to, from, next) => {
  const user = await firebase.getCurrentUser()
  const { requiresAuth, requiresNotAuth } = to.meta
  const { isLoggingOutFromButton } = from.meta // TODO: Define properly if state or from meta

  const isDifferentRoute = to.name !== from.name
  const isGuestAccessingAuthRoute = requiresAuth && !user && isDifferentRoute
  const isAuthAccessingGuestRoute = requiresNotAuth && user && isDifferentRoute
  const isInsideGameRoom = from.name === 'PlayBoard'
  const isLoggingOutFromGameRoom = isInsideGameRoom && isLoggingOutFromButton

  if (isAuthAccessingGuestRoute) {
    console.log(to.name)
    console.log(from.name)
    console.log('auth to guest')
    next({ name: 'GameLobby' })
  } else if (isGuestAccessingAuthRoute) {
    console.log(to.name)
    console.log(from.name)
    console.log('guest to auth')
    next({ name: 'Login' })
  } else if (isLoggingOutFromGameRoom) {
    console.log('logout from game room')
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
