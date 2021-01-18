import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Leaderboard from '../views/Leaderboard.vue'
import ChangePassword from '../views/ChangePassword.vue'
import ChangePasswordConfirm from '../views/ChangePasswordConfirm.vue'
import GameLobby from '../views/GameLobby.vue'
import Room from '../views/Room.vue'
import Help from '../views/Help.vue'
import firebase from  'firebase'
import { gamesCollection, usersCollection } from '@/firebase'

Vue.use(VueRouter)

const routes = [
  {
    path: '/play',
    name: 'PlayBoard',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: ChangePassword,
    meta: { requiresAuth: true },
  },
  {
    path: '/change-password/confirm',
    name: 'ChangePasswordConfirm',
    component: ChangePasswordConfirm,
    meta: { requiresAuth: true },
  },
  {
    path: '/help',
    name: 'Help',
    component: Help,
    meta: { requiresAuth: true },
  },
  {
    path: '/register',
    name: 'Register', 
    component: Register,
    meta: { requiresNotAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresNotAuth: true }
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: Leaderboard,
    meta: { requiresNotAuth: false }
  },
  {
    path: '/',
    name: 'GameLobby',
    component: GameLobby,
    meta: { requiresNotAuth: false }
  },
  {
    path: '/room/:id',
    name: 'Room',
    component: Room,
    meta: { 
      requiresAuth: true,
      isEnteringRoom: true
    }
  }
]

const router = new VueRouter({ routes })
const handleRoomEntering = async (from, currentUser, gameID, next) => {
  // Fetch host and other users
  const gameDoc = await gamesCollection.doc(gameID).get()
  const userDoc = await usersCollection.doc(currentUser.uid).get()
  
  const hostUser = gameDoc.data().host_user
  const otherUser = gameDoc.data().other_user 
  const userActiveGameID = userDoc.data().active_game

  const isRoomFull = hostUser.id !== 'nil' && otherUser.id !== 'nil'
  const isEnteringMultipleRooms = userActiveGameID !== gameID
  if (isRoomFull) {
    next({ name: 'GameLobby' })
  } else if (isEnteringMultipleRooms) {
    next(from)
  } else {
    next()
  } 
}

router.beforeEach(async (to, from, next) => {
  const currentUser = await firebase.getCurrentUser()
  const { requiresAuth, requiresNotAuth, isEnteringRoom } = to.meta
  const isGuestEnteringRestrictedPages = requiresAuth && !currentUser
  const isAuthEnteringGuestPages = requiresNotAuth && currentUser
  const gameID = to.params.id

  if (isGuestEnteringRestrictedPages) {
    next({ name: 'Login' })
  } else if (isAuthEnteringGuestPages) {
    next({ name: 'GameLobby' })
  } else if (isEnteringRoom) {
    handleRoomEntering(from, currentUser, gameID, next)
  } else {
    next()
  }
})

export default router
