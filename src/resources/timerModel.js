import firebase from 'firebase'
import { 
  db,
  timersCollection
} from '@/firebase'

export const addTimerDoc = ((time) => {
  return timersCollection.add({
    host_timeLeft: time,
    other_timeLeft: time
  })
})