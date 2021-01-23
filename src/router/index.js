import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from  'firebase'
import { routes } from './routes'
import { db, auth, gamesCollection, usersCollection } from '@/firebase'

Vue.use(VueRouter)
const router = new VueRouter({ routes })

// Handle routes here
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
  } else if (isGuestAccessingAuthRoute) {
    next({ name: 'Login' })
  } else if (isInsideGameRoom) {
    next({ name: from.name })
  } else if (isEnteringRoom) { // can happen on first load or joining new room
    console.log('entering room')
    const isFull = await isRoomFull(roomID) 
    const inGivenRoom = await isInGivenRoom(roomID) 
    const alreadyInRoom = await isAlreadyInRoom()

    // Join the room if the room isn't already full
    const canJoinRoom = !isFull && !inGivenRoom && !alreadyInRoom
    if (canJoinRoom) {
      await joinRoomFromLink(roomID)
    } 
    
    // Only access a room if already inside
    if (inGivenRoom) {
      next()
    } else {
      next(from)
    }
  } else {
    next()
  }
})

const joinRoomFromLink = async (roomID) => {
  console.log('join room ' + roomID)
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
  
  console.log(hostDoc)
  console.log(otherDoc)

  // Check if there are rooms the player is a part of
  return !hostDoc.empty || !otherDoc.empty
}

export default router
