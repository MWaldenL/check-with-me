import firebase from 'firebase'
import { db } from '@/firebase'

export const getNextGames = (lastVisible) => {
  let games = []
  let newLastVisible

  db.collection("games")
    .where("is_public", "==", true)
    .orderBy("room_name", "asc")
    .startAfter(lastVisible)
    .limit(10)
    .get()
    .then(querySnapshot => {
      let docs = querySnapshot.docs
      newLastVisible = docs[docs.length - 1].data()

      docs.forEach((doc, index) => {
        //console.log(doc.id, " => ", doc.data());
        let game = {
          room_name: doc.data().room_name
        }

        doc.data().host_user
        .get()
        .then(user => {
          game.host_user = user.data().username

          doc.data().other_user
          .get()
          .then(other => {
            if(other.exists)
              game.button = "Full"
            else
              game.button = "Join Room"

            games.push(game)
          })
        })
      })
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    })
  return {
    lastVisible: newLastVisible,
    games: games
  }
}

export const getPrevGames = (lastVisible) => {
  let games = []
  let newLastVisible

  db.collection("games")
    .where("is_public", "==", true)
    .orderBy("room_name", "asc")
    .endBefore(lastVisible)
    .limit(10)
    .get()
    .then(querySnapshot => {
      let docs = querySnapshot.docs
      newLastVisible = docs[docs.length - 1].data().room_name

      docs.forEach((doc, index) => {
        //console.log(doc.id, " => ", doc.data());
        let game = {
          room_name: doc.data().room_name
        }

        doc.data().host_user
        .get()
        .then(user => {
          game.host_user = user.data().username

          doc.data().other_user
          .get()
          .then(other => {
            if(other.exists)
              game.button = "Full"
            else
              game.button = "Join Room"

            games.push(game)
          })
        })
      })
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    })

  return {
    lastVisible: newLastVisible,
    games: games
  }
}