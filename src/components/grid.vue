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
    const data = game.data()

    // Set pertinent data 
    this.bIsFirstRun = data.is_first_run
    this.lastPlayerMoved = data.last_player_moved
    // await this.aSetHostTimeLeft()
    // await this.aSetOtherTimeLeft()

    // Set collections
    this.currentGameDoc = gameDoc
    this.currentTimerDoc = timerDoc

    // Set self username
    const currentUser = await this.currentUser.data 
    this.selfName = currentUser.username

    // Get the enemy username
    await this.aGetEnemyUsername()

    // Decide which clock to run 
    const playerIfFirstRun = this.isSelfHost ? 
      (this.isHostWhite ? 'self' : 'enemy') : 
      (this.isHostWhite ? 'enemy' : 'self')
    
    const playerIfOngoingGame = this.isSelfHost ?
      this.lastPlayerMoved === game.data().host_user ? 'enemy' : 'self' :
      this.lastPlayerMoved === game.data().host_user ? 'self' : 'enemy'
    
    const player = this.bIsFirstRun ? playerIfFirstRun : playerIfOngoingGame

    // Start the clock
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
    // This will happen if the enemy's clock is updated
    timersCollection
      .doc('H48woDfI1lwIGZnJh4qz')
      .onSnapshot(async doc => {
        // Sync the other player's timer with the db
        const data = doc.data()
        const remoteEnemyTime = this.isSelfHost ? data.other_timeLeft : data.host_timeLeft
        this.enemySeconds = remoteEnemyTime // might implement finer conditions but this one for now
      
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
      currentTimerDoc: null,

      lastPlayerMoved: null,
      selfSeconds: 0,      
      enemySeconds: 0,

      isSelfTimeRunning: false,
      isEnemyTimeRunning: false,
      bIsFirstRun: true,
      prevSourceSquare: null
    }
  },

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
      this.selfTime = this.isSelfHost ? hostTime : otherTime
      this.enemyTime = this.isSelfHost ? otherTime : hostTime
    },

    async writeUpdatedTimeToDB() {
      const newTimeObj = this.isSelfHost ? 
        { host_timeLeft: this.selfTime } : 
        { other_timeLeft: this.otherTime } 
      await this.currentTimerDoc.update(newTimeObj)   
    },

    async endPlayerTurn(coords) {
      const isMoveWhite = 
        bSourceHasWhite(this.board, this.prevDestSquare) || 
        bSourceHasWhiteKing(this.board, this.prevDestSquare) 

      this.lastPlayerMoved = (this.isHostWhite ^ isMoveWhite) ? this.otherUserID : this.hostUserID

      // Flush leaky states after turns 
      const updatedState = {
        bIsCaptureRequired: false,
        bStartedCaptureSequence: false,
        prevDestSquare: null,
        firstClick: null
      }
      this.aFlushStateAfterTurn(updatedState)

      // Stop self time and start enemy time
      this.stopSelfTime()
      this.startEnemyTime()

      // Write last player moved to db 
      await this.currentGameDoc.update({ 
        last_player_moved: this.lastPlayerMoved 
      })

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
      }

      // End the player's turn if they are not currently capturing
      if (!this.isCapturing) {
        await this.endPlayerTurn(this.prevSourceSquare)
      }
    },

    stopSelfTime() {
      this.isSelfTimeRunning = false
    },

    startEnemyTime() {
      this.isEnemyTimeRunning = true
    },

    async runClock(playerType) {
      let timer
      const isTimeRunning = playerType === 'self' ? 
        this.isSelfTimeRunning : 
        this.isEnemyTimeRunning

      const shouldTimeTick = isTimeRunning && this.selfSeconds > 0 
      
      // If time is running and still has time left, tick; else stop the clock
      if (shouldTimeTick) {
        timer = playerType === 'self' ? 
          setInterval(() => this.selfSeconds--, 1000) : 
          setInterval(() => this.enemySeconds--, 1000)
      } else {
        clearInterval(timer)
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
