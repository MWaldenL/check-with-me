<template>
  <div id="box">
    <Sidebar />

    <!-- Opponent -->
    <div id="p1-details" class="details">
      <h1> 
        {{ enemyUsername }} 
        <keep-alive>
          <span class="time text-white" id="enemyTime">
            {{ enemySeconds | minutes | formattedTime }}:{{ enemySeconds | seconds | formattedTime }}
          </span>
        </keep-alive>
      </h1> 
      <h1 id="p1-count" class="pt-3"> Pieces left: {{ blackCount }} </h1>
    </div>

    <!-- Board -->
    <div id="table">
      <table>
        <tr v-for="row in 8" :key="row">
          <Cell 
            v-for="col in 8" 
            :row="9 - row" 
            :col="col" 
            :canMakeMove="canMakeMove"
            :selfColor="selfColor"
            :key="col" 
            @makeMove="updateLastPlayerMoved"/>
        </tr>
      </table>
    </div>
    
    <!-- Self -->
    <div id="p2-details" class="details">
      <h1 id="p2-count" class="pb-4"> Pieces left: {{ whiteCount }} </h1>
      <h1>
        <keep-alive>
          <span class="time text-white" id="selfTime">
            {{ selfSeconds | minutes | formattedTime }}:{{ selfSeconds | seconds | formattedTime }}
          </span>
        </keep-alive>
        {{ selfName }}
      </h1>
    </div>
    <!-- <b-button id="resign" class="btn-danger">Resign</b-button> -->
  </div>
</template>

<script>
import { bSourceHasWhite, bSourceHasWhiteKing } from '@/store/services/moveCaptureService'
import { 
  auth, 
  gamesCollection, 
  usersCollection, 
  timersCollection
} from '@/firebase'
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import Cell from './cell'
import Sidebar from './sidebar'

export default {
  name: 'Grid',
  components: {
    Cell,
    Sidebar
  },
  
  // Called on refreshes or new loads 
  async created() {
    const gameDoc = gamesCollection.doc('Vc0H4f4EvY6drRKnvsk5')   // hardcoded
    const timerDoc = timersCollection.doc('H48woDfI1lwIGZnJh4qz') // hardcoded
    const game = await gameDoc.get()
    const timer = await timerDoc.get()
    this.currentGameData = game.data()

    // Set pertinent data 
    this.bIsFirstRun = this.currentGameData.is_first_run
    this.lastPlayerMoved = this.currentGameData.last_player_moved

    // Set timer data
    if (!this.isSelfTimeRunning) {
      this.selfSeconds = this.isSelfHost ? 
        timer.data().host_timeLeft : 
        timer.data().other_timeLeft
    }   

    if (!this.isEnemyTimeRunning) {
      this.enemySeconds = this.isSelfHost ? 
        timer.data().other_timeLeft :        
        timer.data().host_timeLeft 
    }

    // Set collections
    this.currentGameDoc = gameDoc
    this.currentTimerDoc = timerDoc

    // Set own username
    const currentUser = await this.currentUser.data 
    this.selfName = currentUser.username

    // Get the enemy username
    await this.aGetEnemyUsername()

    // Run self clock if self is white
    const isSelfWhite = this.isSelfHost && this.isHostWhite 
    const playerIfFirstRun = isSelfWhite ? 'self' : 'enemy'
    const playerIfOngoingGame = this.lastPlayerMoved === auth.currentUser.uid ? 'enemy' : 'self'
    const player = this.bIsFirstRun ? playerIfFirstRun : playerIfOngoingGame
    this.playerToMove = player
    if (this.bIsFirstRun) {
      this.isSelfTimeRunning = isSelfWhite
      this.isEnemyTimeRunning = !isSelfWhite
    }

    // Start the clock
    console.log('before running clock')
    this.runClock(player)
  },

  async mounted() {
    // Listen for board state changes
    gamesCollection
      .doc('Vc0H4f4EvY6drRKnvsk5') // Obtain from state in the future when rooms are implemented
      .onSnapshot(async doc => {
        const data = doc.data()
        const boardState = data.board_state
        const playerIsWhite = this.selfColor === 'w'
        const playerIsBlack = this.selfColor === 'b'

        // Update the last player moved and the position
        this.lastPlayerMoved = data.last_player_moved
        this.aUpdateBoard({ boardState, playerIsBlack })

        // Highlight all possible captures when player is not in a capture sequence
        if (this.lastPlayerMoved !== auth.currentUser.uid) {
          if (!this.isCapturing) {
            this.aHighlightBoardCaptures(playerIsWhite)
          } else {  
            // Highlight the capture from the current sequence
            if (this.prevDestSquare) {
              this.aHighlightCaptureFromSequence({ 
                coords: this.prevDestSquare, 
                playerIsWhite 
              })

              // Once a capture sequence has finished, end the player's turn
              if (!this.isCapturing && this.prevSourceSquare) {
                await this.endPlayerTurn(this.prevSourceSquare)
              }
            }
          }
        } else {  // Ensure that leaky states don't have unnecessary values 
          const updatedState = {
            bIsCaptureRequired: false,
            bStartedCaptureSequence: false,
            prevDestSquare: null,
            firstClick: null
          }
          this.aFlushStateAfterTurn(updatedState)
        }
      })

    // Listen for timer state changes
    timersCollection
      .doc('H48woDfI1lwIGZnJh4qz')
      .onSnapshot(async doc => {
        // Sync the other player's timer with the db
        const data = doc.data()
        const remoteEnemyTime = this.isSelfHost ? data.other_timeLeft : data.host_timeLeft
        this.enemySeconds = remoteEnemyTime // might implement finer implementations but this one for now

        // Determine whose clock to run
        if (!this.bIsFirstRun) {
          console.log('determine running clock')
          this.determineRunningClock()
        }

        // Check if someone has won on time
        const didBlackWinOnTime = 
          (this.hostTimeLeft === 0 && this.isHostWhite) || 
          (this.otherTimeLeft === 0 && !this.isHostWhite)
        const didWhiteWinOnTime = 
          (this.otherTimeLeft === 0 && this.isHostWhite) || 
          (this.hostTimeLeft === 0 && !this.isHostWhite)
  
        // if (didBlackWin) {
        //   this.aSetWinner('B')
        // } else if (didWhiteWin) {
        //   this.aSetWinner('W')
        // }
      })
  },

  data () {
    return {
      selfName: '',
      currentGameDoc: null,
      currentGameData: null,
      currentTimerDoc: null,
      currentRunningTimer: null,

      playerToMove: null,
      lastPlayerMoved: null,
      selfSeconds: 0,      
      enemySeconds: 0,

      isSelfTimeRunning: false,
      isEnemyTimeRunning: false,
      bIsFirstRun: true,
      prevSourceSquare: null
    }
  },

  // persist: [
  //   'selfSeconds', 
  //   'enemySeconds'
  // ],

  computed: {
    ...mapGetters({
      board: 'getEntireBoard',
      whiteCount: 'getWhiteCount',
      blackCount: 'getBlackCount',
      currentUser: 'getCurrentUser',
      hostUserID: 'getHostUser',
      otherUserID: 'getOtherUser',
      enemyUsername: 'getEnemyUsername',
      isHostWhite: 'getIsHostWhite',
      hostTimeLeft: 'getHostTimeLeft',
      otherTimeLeft: 'getOtherTimeLeft',
      isCapturing: 'getCaptureSequenceState',
      isCaptureRequired: 'getIsCaptureRequired',
      prevDestSquare: 'getPrevDestSquare'
    }),

    isSelfHost() {
      return auth.currentUser.uid === this.hostUserID
    },

    canMakeMove() {
      return this.lastPlayerMoved !== auth.currentUser.uid
    },

    selfColor() {
      return (auth.currentUser.uid === this.hostUserID) ?
        (this.isHostWhite ? 'w' : 'b') : 
        (this.isHostWhite ? 'b' : 'w')
    }
  },

  filters: {
    minutes(timeInSecs) {
      return Math.floor(timeInSecs / 60)
    },

    seconds(timeInSecs) {
      return timeInSecs % 60
    },

    formattedTime(time) {
      return (time >= 10) ? time.toString(10) : `0${time}`
    }
  },  
  
  methods: {
    ...mapActions([
      'aSetHostTimeLeft',
      'aSetOtherTimeLeft',
      'aSetWinner',
      'aUpdateBoard',
      'aGetEnemyUsername',
      'aHighlightBoardCaptures',
      'aHighlightCaptureFromSequence',
      'aSetPrevDestSquare',
      'aSetCaptureRequired',
      'aFlushStateAfterTurn',
      'aSetFirstRun'
    ]),

    async fetchTimeFromDB() {
      const timer = await this.currentTimerDoc.get()
      const timerData = timer.data()
      const hostTime = timerData.host_timeLeft
      const otherTime = timerData.other_timeLeft

      // Set the timer states depending on the players
      this.selfSeconds = this.isSelfHost ? hostTime : otherTime
      this.enemySeconds = this.isSelfHost ? otherTime : hostTime
      console.log('fetch time from db')
      console.log(this.enemySeconds)
    },

    determineRunningClock() {
      if (this.lastPlayerMoved !== auth.currentUser.uid) { // opponent last move
        console.log('DRC self clock ')
        this.playerToMove = 'self'
        this.runClock('self')
      } else { // self made last move
        console.log('DRC enemy clock ')
        this.runClock('enemy')
      }
    },

    async writeUpdatedTimeToDB() {
      console.log('writing time to db')
      const newTimeObj = this.isSelfHost ? 
        { host_timeLeft: this.selfSeconds } : 
        { other_timeLeft: this.selfSeconds } 
      await this.currentTimerDoc.update(newTimeObj)   
    },

    async endPlayerTurn(coords) {
      const isMoveWhite = 
        bSourceHasWhite(this.board, this.prevDestSquare) || 
        bSourceHasWhiteKing(this.board, this.prevDestSquare) 

      this.lastPlayerMoved = (this.isHostWhite ^ isMoveWhite) ? this.otherUserID : this.hostUserID
      // Write last player moved to db 
      await this.currentGameDoc.update({ 
        last_player_moved: this.lastPlayerMoved 
      })

      // Flush leaky states after turns 
      const updatedState = {
        bIsCaptureRequired: false,
        bStartedCaptureSequence: false,
        prevDestSquare: null,
        firstClick: null
      }
      this.aFlushStateAfterTurn(updatedState)

      // Stop self time and start enemy time
      await this.stopSelfTime()
      await this.startEnemyTime()

      // Write the updated self time to db
      this.writeUpdatedTimeToDB() 
    },

    async updateLastPlayerMoved(coords) {
      const { nRow, nCol, nDestRow, nDestCol } = coords
      this.prevSourceSquare = { nRow, nCol }
      this.aSetPrevDestSquare({ nRow: nDestRow, nCol: nDestCol })

      // The first move has been made
      if (this.bIsFirstRun) {
        this.bIsFirstRun = false
        this.currentGameDoc.update({ is_first_run: false })
      }

      // End the player's turn if they are not currently capturing
      if (!this.isCapturing) {
        await this.endPlayerTurn(this.prevSourceSquare)
      }
    },

    async stopSelfTime() {
      // Stop client time
      this.isSelfTimeRunning = false
      clearInterval(this.currentRunningTimer)
      
      // Stop server time
      await axios.get('http://localhost:5000/stopTime')

      console.log('stopping self time')
    },

    async startEnemyTime() {
      // Start time in client
      this.isEnemyTimeRunning = true
      this.playerToMove = 'enemy'

      // Start time in server
      await axios.get(`http://localhost:5000/startTime/${this.enemySeconds}`)

      console.log('starting enemy time')
    },

    async runClock(playerType) {
      const isTimeRunning = playerType === 'self' ? this.isSelfTimeRunning : this.isEnemyTimeRunning
      const playerTime = playerType === 'self' ? this.selfSeconds : this.enemySeconds  
      const shouldTimeTick = isTimeRunning && this.selfSeconds > 0 

      // If time is running and still has time left, tick; else stop the clock
      if (shouldTimeTick) {
        // Start server time
        await axios.get(`http://localhost:5000/startTime/${playerTime}`)

        // Start client time
        this.currentRunningTimer = playerType === 'self' ?  
          setInterval(() => this.selfSeconds--, 1000) : 
          setInterval(() => this.enemySeconds--, 1000)
        console.log(this.currentRunningTimer)
      } else {
        clearInterval(this.currentRunningTimer)
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway&family=Roboto&display=swap');

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
div#table {
  display: flex;
  align-items: center;
  justify-content: center;
}
table {
  margin: 0;
  padding: 0;
}
#p1-details {
  text-align: left;
  margin-right: 20px;
  margin-left: 200px;
}
#p2-details {
  text-align: right;
  margin-left: 20px;
  margin-right: 200px;
}
.details {
  color: whitesmoke;
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
}
.details h1 {
  margin: 0;
}
#p1-count,
#p2-count {
  font-family: 'Raleway', Helvetica, Arial, sans-serif;
  font-size: 20px;
}
#enemyTime {
  margin-left: 100px;
  padding: 10px 30px;
  background-color: #424242;
}
#selfTime {
  margin-right: 100px;
  padding: 10px 30px;
  background-color: #424242;
}
#resign {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  font-weight: 100;
  font-size: 20px;
  padding: 10px 40px;

  position: absolute;
  right: 300px;
  bottom: 40vh;
}
#box {
  position: relative;
  margin-top: 10px;
}
</style>
