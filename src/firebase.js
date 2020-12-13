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

firebase.auth().onAuthStateChanged(user => {
  store.dispatch("setUser", user);
})

// Collections
const usersCollection = db.collection('users')
const chatsCollection = db.collection('chats')
const gamesCollection = db.collection('games')
const movesCollection = db.collection('moves')

gamesCollection.doc("2gSaU2SjJeUpHEEbXPyX")
  .onSnapshot(doc => {
      // const boardState = doc.data().boardState
      // console.log(boardState)
      // store.dispatch('aUpdateBoard', boardState);
  });

export {
  db,
  auth,
  usersCollection,
  chatsCollection
}