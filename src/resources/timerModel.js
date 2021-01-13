import firebase from 'firebase'
import { db } from '@/firebase'

export const addTimerDoc = ((time) => {
  return db.collection("timers").add({
    host_timeLeft: time,
    other_timeLeft: time
  })
})