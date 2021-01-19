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
let currentTimeRunningPlayer = 'nil'

/**
 * Starts a given player's time given the timer ID
 * @param timerID the timer object's id
 * @param player the player type, which can either be "host" or "other"
 */
app.get('/startHostTime/:currentTime', async (req, res) => {
  let { currentTime } = req.params
  
  // Early exit if another clock is already running
  if (isTimeRunning) {
    res.send({ timeStarted: false, msg: 'There is already a timer running!' })
    return
  }

  isTimeRunning = true
  hostTimeLeft = currentTime
  currentTimeRunningPlayer = 'host'

  //console.log('-- Starting host time from server --')

  // Perform every second
  hostCountDown = setInterval(async () => {
    if (hostTimeLeft > 0) {
      hostTimeLeft--
      //console.log('Host time left: ' + hostTimeLeft)
    } else {
      currentTimeRunningPlayer = 'nil'
      clearInterval(hostCountDown)
    }
  }, 1000)

  res.send({ 
    timeStarted: true, 
    msg: 'Starting host player time' 
  })
})

app.get('/startOtherTime/:currentTime', async (req, res) => {
  let { currentTime } = req.params

  // Early exit if another clock is already running
  if (isTimeRunning) {
    res.send({ timeStarted: false, msg: 'There is already a timer running!' })
    return
  }

  otherTimeLeft = currentTime
  isTimeRunning = true
  currentTimeRunningPlayer = 'other'

  //console.log('-- Starting other time from server --')

  // Perform every second
  otherCountDown = setInterval(async () => {
    if (otherTimeLeft > 0) {
      otherTimeLeft--
      //console.log('Other time left: ' + otherTimeLeft)
    } else {
      currentTimeRunningPlayer = 'nil'
      clearInterval(otherCountDown)
    }
  }, 1000) 
  
  res.send({ 
    timeStarted: true, 
    msg: 'Starting other player time' 
  })
})

app.get('/currentTimeLeft/:playerType', async (req, res) => {
  const { playerType } = req.params
  const timeLeft = playerType === 'host' ? hostTimeLeft : otherTimeLeft
  res.status(200).send({ timeLeft })
})
 
/**
 * Stops the host player's timer
 */
app.get('/stopHostTime', async (req, res) => {
  //console.log('stopping host time')
  clearInterval(hostCountDown)

  isTimeRunning = false
  // currentTimeRunningPlayer = 'nil'
  res.status(200).send("Stopping host time")
})

/**
 * Stops the other player's timer
 */
app.get('/stopOtherTime', async (req, res) => {
  //console.log('stopping other time')
  clearInterval(otherCountDown)

  isTimeRunning = false
  // currentTimeRunningPlayer = 'nil'
  res.status(200).send("Stopping other time")
})


/**
 * Checks if a client is running the current clock
 */
app.get('/isTimeRunning/:player', (req, res) => {
  const { player } = req.params
  //console.log('Current time running player: ' + currentTimeRunningPlayer)
  res.send({ isTimeRunning: player === currentTimeRunningPlayer })
})

app.listen(5000, () => console.log('Listening on port 5000'))