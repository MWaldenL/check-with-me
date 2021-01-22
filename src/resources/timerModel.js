import firebase from 'firebase'
import { 
  db,
  timersCollection
} from '@/firebase'

export const addTimerDoc = ((time) => {
  return timersCollection.add({
    host_timeLeft: time,
    other_timeLeft: time,
    game_id: "",
    last_player_moved: ""
  })
})

export const addGameToTimer = ((gameID, timerID) => {
  timersCollection
  .doc(timerID)
  .update({
    game_id: gameID
  })
})

export const changeTime = ((time, timerID) => {
  timersCollection
  .doc(timerID)
  .update({
    host_timeLeft: time,
    other_timeLeft: time
  })
})

export const getSingleTimer = (async timerID => {
  const query = timersCollection.doc(timerID)
  const doc = await query.get()
  return doc.data()
})