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
import { gamesCollection } from '@/firebase'

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
      isRoom: true
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach(async (to, from, next) => {
  const user = await firebase.getCurrentUser()
  if (to.meta.requiresAuth && !user) {
    next({ name: 'Login' })
  } else if (to.meta.requiresNotAuth && user) {
    next({ name: 'GameLobby' })
  } else if (to.meta.isRoom) {
    const gameDoc = await gamesCollection.doc(to.params.id).get()
    const data = gameDoc.data()
    const hostUser = data.host_user
    const otherUser = data.other_user 
    
    console.log(hostUser.id)
    console.log(otherUser.id === 'nil')
  
    // Check if host and other player are present
    const isRoomFull = hostUser.id !== 'nil' && otherUser.id !== 'nil'
    if (isRoomFull) {
      next({ name: 'GameLobby' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
