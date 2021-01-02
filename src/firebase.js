import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import store from './store'


const firebaseConfig = {
  apiKey: "AIzaSyA9SZagTMn8tSFeZkOQkrDmptaQLP-3c7k",
  authDomain: "check-with-me.firebaseapp.com",
  projectId: "check-with-me",
  storageBucket: "check-with-me.appspot.com",
  messagingSenderId: "910644162284",
  appId: "1:910644162284:web:ac3990fc338d8863593fc9"
}

firebase.initializeApp(firebaseConfig)

// Utilities
const db = firebase.firestore()
const auth = firebase.auth()

firebase.getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject)
  })
}

// Listen for logins and logouts
firebase.auth().onAuthStateChanged(user => {
  store.dispatch("setUser", user);
})

// Collections
const usersCollection = db.collection('users')
const gamesCollection = db.collection('games')
const timersCollection = db.collection('timers')

// Listeners
gamesCollection
  .doc('Vc0H4f4EvY6drRKnvsk5') // .doc(getters.getCurrentGameID)
  .onSnapshot(doc => {
    const data = doc.data()
    
    store.dispatch('aSetLastPlayerMoved', data.last_player_moved)
    store.dispatch('aUpdateBoard', data.board_state);
  })

timersCollection
  .doc('H48woDfI1lwIGZnJh4qz')
  .onSnapshot(doc => {
    store.dispatch('aSetHostTimeLeft')
    store.dispatch('aSetOtherTimeLeft')
  })

export {
  db,
  auth,
  usersCollection,
  gamesCollection,
  timersCollection
}