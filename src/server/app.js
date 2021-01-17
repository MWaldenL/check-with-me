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

let hostCountDown, otherCountDown
let hostTimeLeft = 420, otherTimeLeft = 420
let isTimeRunning = false
let currentTimeRunningPlayer = 'host'

/**
 * Starts a given player's time given the timer ID
 * @param timerID the timer object's id
 * @param player the player type, which can either be "host" or "other"
 */
app.get('/startHostTime/:currentTime', async (req, res) => {
  let { currentTime } = req.params

  hostTimeLeft = currentTime
  currentTimeRunningPlayer = 'host'

  console.log('starting host time from server')

  // Perform every second
  hostCountDown = setInterval(async () => {
    // Keep sending the updated time to the client until it becomes 0
    if (hostTimeLeft > 0) {
      hostTimeLeft--
      console.log('Host time left: ' + hostTimeLeft)
    } else {
      currentTimeRunningPlayer = 'nil'
      clearInterval(hostCountDown)
    }
  }, 1000) 
  res.send('Starting host time')
})

app.get('/startOtherTime/:currentTime', async (req, res) => {
  let { currentTime } = req.params
  
  otherTimeLeft = currentTime
  isTimeRunning = true
  currentTimeRunningPlayer = 'other'

  console.log('starting other player time from server')

  // Perform every second
  otherCountDown = setInterval(async () => {
    // Keep sending the updated time to the client until it becomes 0
    if (otherTimeLeft > 0) {
      otherTimeLeft--
      console.log('Other time left: ' + otherTimeLeft)
    } else {
      currentTimeRunningPlayer = 'nil'
      clearInterval(otherCountDown)
    }
  }, 1000) 
  res.send('Starting other player time')
})

app.get('/currentTimeLeft/:playerType', async (req, res) => {
  const { playerType } = req.params
  const timeLeft = playerType === 'host' ? 
    hostTimeLeft : 
    otherTimeLeft
  res.status(200).send({ timeLeft })
})

/**
 * Stops the time of the currently running clock 
 */
app.get('/stopHostTime', async (req, res) => {
  console.log('stopping host time')
  clearInterval(hostCountDown)
  currentTimeRunningPlayer = 'nil'
  res.status(200).send("Stopping host time")
})

/**
 * Stops the time of the currently running clock 
 */
app.get('/stopOtherTime', async (req, res) => {
  console.log('stopping other time')
  clearInterval(otherCountDown)
  currentTimeRunningPlayer = 'nil'
  res.status(200).send("Stopping other time")
})


/**
 * Checks if a client is running the current clock
 */
app.get('/isTimeRunning/:player', (req, res) => {
  const { player } = req.params
  console.log(player + ' isTimeRunning: ' + isTimeRunning)
  console.log(currentTimeRunningPlayer)
  if (player === currentTimeRunningPlayer) {
    res.send({ isTimeRunning })
  } else {
    res.send({ isTimeRunning: false })
  }
})

app.listen(5000, () => console.log('Listening on port 5000'))