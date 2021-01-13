import firebase from 'firebase'
import { db } from '@/firebase'

class Room {
  constructor (room_id, room_name, host_user, isFull) {
      //console.log(host_user)
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
      //console.log(user.id, " => ", user.data())
      userArray.push(user.data().username)
    })
    
    return new Room(snapshot.id, data.room_name, userArray, isFull)
  }
}

export const roomQuery = db.collection("games")
            .where("is_public", "==", true)
            .orderBy("room_name", "asc")
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

  db.collection("games")
  .where("is_public", "==", true)
  .orderBy("room_name", "asc")
  .get()
  .then(querySnapshot => {
    let docs = querySnapshot.docs

    count.push(Math.ceil(docs.length/10))
  })
  .catch(function(error) {
    console.log("Error getting documents: ", error);
  })

  return count
})