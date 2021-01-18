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