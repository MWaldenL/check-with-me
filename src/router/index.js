import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from  'firebase'
import { routes } from './routes'
import { db, auth, gamesCollection, usersCollection } from '@/firebase'
import store from '@/store'

Vue.use(VueRouter)
const router = new VueRouter({ routes })

router.beforeEach(async (to, from, next) => {
  const user = await firebase.getCurrentUser()
  const { requiresAuth, requiresNotAuth } = to.meta
  const roomID = to.params.id

  const isDifferentRoute = to.name !== from.name
  const isGuestAccessingAuthRoute = requiresAuth && !user && isDifferentRoute
  const isAuthAccessingGuestRoute = requiresNotAuth && user && isDifferentRoute
  const isInsideGameRoom = from.name === 'PlayBoard'
  const isEnteringRoom = to.name === 'WaitingRoom'

  // Handle routing
  if (isAuthAccessingGuestRoute) { // Prioritize
    next({ name: 'GameLobby' })
  } else if (isEnteringRoom) { // can happen on first load or joining new room
    // Set the current game id in the state
    store.commit('mSetCurrentGame', roomID)

    // Check if user is authenticated
    const thisUser = auth.currentUser
    if (!thisUser) {
      next({ name: 'Login' })
      return
    }

    // Redirect to Game Lobby if room does not exist
    const roomExists = await doesRoomExist(roomID)
    if (!roomExists) {
      store.commit('mSetCurrentGame', '')
      next({ name: 'GameLobby' })
      return 
    }

    // Check if a room can be joined 
    const isFull = await isRoomFull(roomID) 
    let inGivenRoom = await isInGivenRoom(roomID) 
    const alreadyInRoom = await isAlreadyInRoom()
    const canJoinRoom = !isFull && !inGivenRoom && !alreadyInRoom

    if (canJoinRoom) {
      await joinRoomFromLink(roomID)
    } 

    // Only access a room if the given player is already inside
    inGivenRoom = await isInGivenRoom(roomID) 
    if (inGivenRoom) {
      next()
    } else {
      store.commit('mSetCurrentGame', '')
      alert('This room is already full! Please select a vacant room.')
      next({ name: 'GameLobby' })
    }
  } else if (isGuestAccessingAuthRoute) {
    console.log('guest to auth')
    next({ name: 'Login' })
  } else if (isInsideGameRoom) {
    next({ name: from.name })
  } else {
    next()
  }
})

const joinRoomFromLink = async (roomID) => {
  const userID = auth.currentUser.uid
  const gameDoc = gamesCollection.doc(roomID)
  const game = await gameDoc.get()

  if (userID !== game.data().host_user.id) {  
    await gameDoc.update({ other_user: db.doc(`/users/${userID}`) })
  }
}

const isRoomFull = async (roomID) => {
  // Get room by id in db
  const game = await gamesCollection.doc(roomID).get()
  const otherUser = game.data().other_user

  // Check if both host user and other user exist
  return otherUser.id !== 'nil'
}

const isInGivenRoom = async (roomID) => {
  // Get host and other users
  const game = await gamesCollection.doc(roomID).get()
  const hostUser = game.data().host_user
  const otherUser = game.data().other_user
  const thisUser = auth.currentUser.uid  

  // The current user must be either of the users
  return thisUser === hostUser.id || thisUser === otherUser.id 
}

const isAlreadyInRoom = async () => {
  const thisUser = auth.currentUser.uid
  const userDoc = usersCollection.doc(thisUser)
  const hostQuery = gamesCollection.where('host_user', '==', userDoc)
  const otherQuery = await gamesCollection.where('other_user', '==', userDoc)
  const hostDoc = await hostQuery.get()
  const otherDoc = await otherQuery.get()

  // Check if there are rooms the player is a part of
  return !hostDoc.empty || !otherDoc.empty
}

const doesRoomExist = async (roomID) => {
  const gameDoc = await gamesCollection.doc(roomID).get()
  return gameDoc.exists
}

export default router
