import firebase from 'firebase'
import { 
  db,
  gamesCollection,
  usersCollection,
  timersCollection
} from '@/firebase'
import { BIconNutFill } from 'bootstrap-vue'

class Room {
  constructor (room_id, room_name, host_user, isFull) {
      ////console.log(host_user)
      this.room_id = room_id
      this.room_name = room_name
      this.host_user = host_user
      this.isFull = isFull
  }
}

var RoomConverter = {
  fromFirestore: function(snapshot, options) {
    const data = snapshot.data(options)
    
    let isFull = true
    if(data.other_user.id === "nil")
      isFull = false
    else
      isFull = true

    let userArray = []
    data.host_user
    .get()
    .then(user => {
      ////console.log(user.id, " => ", user.data())
      userArray.push(user.data().username)
    })
    
    return new Room(snapshot.id, data.room_name, userArray, isFull)
  }
}

export const roomQuery = gamesCollection
            .where("is_public", "==", true)
            .orderBy("room_name_lc", "asc")
            .limit(10)

export const getGames = (lobbyQuery) => {
  return lobbyQuery
    .withConverter(RoomConverter)
    .get()
    .then(querySnapshot => {
      let docs = querySnapshot.docs

      let games = []
      let newLastVisible = [docs[docs.length - 1]]
      let newFirstVisible = [docs[0]]

      docs.forEach((doc, index) => {
        games.push(doc.data())
      })
      let result = {
        games: games,
        lastVisible: newLastVisible,
        firstVisible: newFirstVisible
      }
      return(result)
    })
}

export const getCount = (() => {
  let count = []

  gamesCollection
  .where("is_public", "==", true)
  .orderBy("room_name_lc", "asc")
  .get()
  .then(querySnapshot => {
    let docs = querySnapshot.docs

    count.push(docs.length === 0 ? 1 : Math.ceil(docs.length/10))
  })
  .catch(function(error) {
    //console.log("Error getting documents: ", error);
  })

  return count
})

export const addGameDoc = ((roomName, roomType, timerID) => {
  return gamesCollection.add({
    board_state: "[FEN \"O:W1,3,5,7,10,12,14,16,17,19,21,23:B42,44,46,48,49,51,53,55,58,60,62,64\"]",
    host_user: db.doc('users/' + firebase.auth().currentUser.uid),
    other_user:  db.doc('users/' + 'nil'),
    is_host_white: true,
    is_public: roomType === "true",
    is_first_run: true,
    last_player_moved: "white",
    room_link: "link",
    room_name: roomName,
    room_name_lc: roomName.toLowerCase(),
    timer_id: db.doc('timers/' + timerID),
    white_count: 12,
    black_count: 12
  })
})

export const checkNameUnique = (async roomName => {
  const query = gamesCollection.where("room_name_lc", "==", roomName.toLowerCase())
  const doc = await query.get()
  //console.log(doc)
  return doc.empty
})

export const checkUserGame = (async (userID) => {
  //build reference to user
  const userDocRef = usersCollection.doc(userID)
  console.log(userDocRef)
  const queryHost = gamesCollection.where("host_user", "==", userDocRef)
  const docHost = await queryHost.get()
  console.log(docHost)
  if (docHost.empty) {
    const queryGuest = gamesCollection.where("other_user", "==", userDocRef)
    const docGuest = await queryGuest.get()

    if(docGuest.empty) {
      return false
    } else {
      return docGuest.docs[0].id
    }
  } else {
    return docHost.docs[0].id
  }
})

export const deleteGame = (async roomID => {
  //console.log(roomID)
  const query = timersCollection.where("game_id", "==", roomID)
  const doc = await query.get()
  const timerID = doc.docs[0].id
  //console.log(timerID)
  await timersCollection.doc(timerID).delete()
  await gamesCollection.doc(roomID).delete()
})

export const getSingleGame = (async roomID => {
  const query = gamesCollection.doc(roomID)
  const doc = await query.get()
  return doc.data()
})

export const removeGuest = (gameID => {
  gamesCollection
  .doc(gameID)
  .update({
    other_user:  db.doc('users/' + 'nil')
  })
})

export const checkValidRoom = (async roomID => {
  const query = gamesCollection.doc(roomID)
  const doc = await query.get()

  if(doc.exists && doc.data().other_user.id === "nil")
    return true
  else
    return false
})