import express from 'express'
import cors from 'cors'
import serviceAccount from './permissions.json'
import * as admin from 'firebase-admin'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-api-9a206.firebaseio.com"
});
const db = admin.firestore()
const app = express();
const timersCollection = db.collection('timers')

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))

// TODO: In the future, use req.params.timerID
/**
 * Gets the current host time from the database
 */
app.get('/hostTime', async (req, res) => {
  const timerDoc = await timersCollection.doc('H48woDfI1lwIGZnJh4qz').get()
  const timeLeft = timerDoc.data().host_timeLeft

  res.status(200).send({ timeLeft: timeLeft })
})

app.get('/timeLeft/:player', async (req, res) => {
  const player = req.params.player
  const timerDoc = await timersCollection.doc('H48woDfI1lwIGZnJh4qz').get()
  const timeLeft = player === 'host' ? 
    timerDoc.data().host_timeLeft : 
    timerDoc.data().other_timeLeft

  res.status(200).send({ timeLeft: timeLeft })
});


let countDown
let isTimeRunning = false
app.get('/startTime/:player', async (req, res) => {
  isTimeRunning = true

  const player = req.params.player
  const timerDoc = await timersCollection.doc('H48woDfI1lwIGZnJh4qz')
  
  // Perform every second
  let i = 0
  countDown = setInterval(async () => {
    // Get the current time
    const timer = await timerDoc.get()
    const timeLeft = player === 'host' ? 
      timer.data().host_timeLeft : 
      timer.data().other_timeLeft
    
    console.log(i++)

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

app.get('/stopTime', async (req, res) => {
  clearInterval(countDown)
  res.status(200).send("Stopping time")
})

app.get('/isTimeRunning', (req, res) => {
  res.send({ isTimeRunning })
})

app.listen(5000)