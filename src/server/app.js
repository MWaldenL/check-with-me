let express = require('express')
let cors = require('cors')
let serviceAccount = require('./permissions.json')
let admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://check-with-me-default-rtdb.firebaseio.com"
})

const db = admin.firestore()
const app = express();

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))

let countDown
let timeLeft
let isTimeRunning = false
let currentTimeRunningPlayer = 'host'
/**
 * Starts a given player's time given the timer ID
 * @param timerID the timer object's id
 * @param player the player type, which can either be "host" or "other"
 */
app.get('/startTime/:player/:currentTime', async (req, res) => {
  let { player, currentTime } = req.params
  let timeLeft = currentTime
  isTimeRunning = true
  currentTimeRunningPlayer = player

  // Perform every second
  countDown = setInterval(async () => {
    // Keep sending the updated time to the client until it becomes 0
    if (timeLeft > 0) {
      timeLeft--
      console.log(timeLeft)
    } else {
      isTimeRunning = false
      clearInterval(countDown)
    }
  }, 1000) 
  res.send('Starting time')
})

app.get('/currentTimeLeft', async (req, res) => {
  res.status(200).send(timeLeft)
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
app.get('/isTimeRunning/:player', (req, res) => {
  const { player } = req.params
  console.log(player + ' isTimeRunning: ' + isTimeRunning)
  if (player === currentTimeRunningPlayer) {
    res.send({ isTimeRunning })
  } else {
    res.send({ isTimeRunning: false })
  }
})

app.listen(5000, () => console.log('Listening on port 5000'))