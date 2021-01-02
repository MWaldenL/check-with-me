import express from 'express'
import cors from 'cors'
import serviceAccount from './permissions.json'
import * as admin from 'firebase-admin'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://check-with-me-default-rtdb.firebaseio.com"
})

const db = admin.firestore()
const timersCollection = db.collection('timers')
const app = express();

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))

// Routes
/**
 * Gets the player's time left from the database
 * @param timerID the timer object's id
 * @param player the player type, which can either be "host" or "other"
 */
app.get('/timeLeft/:timerID/:playerType', async (req, res) => {
  const { playerType, timerID } = req.params
  const timerDoc = await timersCollection.doc(timerID).get()
  const timeLeft = playerType === 'host' ? 
    timerDoc.data().host_timeLeft : 
    timerDoc.data().other_timeLeft

  res.status(200).send({ timeLeft: timeLeft })
})

let countDown
let isTimeRunning = false
/**
 * Starts a given player's time given the timer ID
 * @param timerID the timer object's id
 * @param player the player type, which can either be "host" or "other"
 */
app.get('/startTime/:timerID/:player', async (req, res) => {
  const { timerID, player } = req.params
  const timerDoc = await timersCollection.doc(timerID)
  
  isTimeRunning = true

  // Perform every second
  countDown = setInterval(async () => {
    // Get the current time
    const timer = await timerDoc.get()
    const timeLeft = player === 'host' ? 
      timer.data().host_timeLeft : 
      timer.data().other_timeLeft

    const timeObj = player === 'host' ?
      { host_timeLeft: timeLeft - 1 } :
      { other_timeLeft: timeLeft - 1 }

    // Keep writing the updated time to the database until it becomes 0
    if (timeLeft > 0) {
      await timerDoc.update(timeObj)
    } else {
      isTimeRunning = false
      clearInterval(countDown)
    }
  }, 1000)

  res.status(200).send("Starting time")
})

/**
 * Stops the time of the currently running clock 
 */
app.get('/stopTime', async (req, res) => {
  clearInterval(countDown)
  res.status(200).send("Stopping time")
})

/**
 * Checks if a client is running the current clock
 */
app.get('/isTimeRunning', (req, res) => {
  res.send({ isTimeRunning })
})

app.listen(5000)