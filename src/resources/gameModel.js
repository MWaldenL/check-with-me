import firebase from 'firebase'
import { db } from '@/firebase'

export const roomQuery = db.collection("games")
            .where("is_public", "==", true)
            .orderBy("room_name", "asc")
            .limit(10)

export const getGames = (lobbyQuery) => {
  let games = []
  let newLastVisible = []
  let newFirstVisible = []
  console.log(lobbyQuery)

  lobbyQuery
    .get()
    .then(querySnapshot => {
      let docs = querySnapshot.docs
      newLastVisible.push(docs[docs.length - 1])
      newFirstVisible.push(docs[0])

      docs.forEach((doc, index) => {
        console.log(doc.id, " => ", doc.data());
        let game = {
          index: index,
          room_id: doc.id,
          room_name: doc.data().room_name
        }

        doc.data().host_user
        .get()
        .then(user => {
          game.host_user = user.data().username

          doc.data().other_user
          .get()
          .then(other => {
            if(other.exists){
              game.button = "Full"
              this.isActive.push(0)
            }
            else{
              game.button = "Join Room"
              this.isActive.push(1)
            }

            games.push(game)
          })
        })
      })
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    })

  return {
    firstVisible: newFirstVisible,
    lastVisible: newLastVisible,
    games: games
  }
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