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
});

/**
 * Pass the updated time from Vue.js to Firebase
 */
app.post('/updateTime/:player/:newTime', async (req, res) => {
  const player = req.params.player
  const newTime = req.params.newTime
  const timerDoc = await timersCollection.doc('H48woDfI1lwIGZnJh4qz')
  
  const timeObj = player === 'host' ? 
    { host_timeLeft: Number(newTime) } : 
    { other_timeLeft: Number(newTime) } 

  timerDoc.update(timeObj)
  res.status(200).send("OK")
})

app.get('/tick', async (req, res) => {
  const timerDoc = await timersCollection.doc('H48woDfI1lwIGZnJh4qz')
  
  // Perform every second
  setInterval(async () => {
    // Get the current time
    const timer = await timerDoc.get()
    const timeLeft = timer.data().host_timeLeft
    
    console.log(timeLeft)

    // Keep writing the updated time to the database until it becomes 0
    if (timeLeft > 0) {
      await timerDoc.update({ host_timeLeft: timeLeft - 1 })
    } else {
      return
    }
  }, 1000)

})

app.listen(5000)