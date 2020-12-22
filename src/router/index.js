import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Leaderboard from '../views/Leaderboard.vue'
import ChangePassword from '../views/ChangePassword.vue'
import ChangePasswordConfirm from '../views/ChangePasswordConfirm.vue'
import Help from '../views/Help.vue'
import firebase from  'firebase'
import authStore from '@/store/modules/auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
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
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach(async (to, from, next) => {
  const user = await firebase.getCurrentUser()
  if (to.meta.requiresAuth && !user) {
    next({ name: 'Login' })
  } 
  else if (to.meta.requiresNotAuth && user) {
    console.log('called ')
    next({ name: 'Home' })
  } 
  else {
    next()
  }
})

export default router
