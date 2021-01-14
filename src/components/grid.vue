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
    const gameDoc = gamesCollection.doc('Vc0H4f4EvY6drRKnvsk5')
    const game = await gameDoc.get()
    const data = game.data()

    // Set data 
    this.bIsFirstRun = data.is_first_run
    this.lastPlayerMoved = data.last_player_moved
    await this.aSetHostTimeLeft()
    await this.aSetOtherTimeLeft()
    this.currentGame = gameDoc

    const currentUser = await this.currentUser.data 
    this.selfName = currentUser.username

    // Get the enemy username
    await this.aGetEnemyUsername()

    // Decide which clock to run 
    let player
    if (this.bIsFirstRun) {
      player = this.isHostWhite ? 'host' : 'other'
    } else {
      player = this.lastPlayerMoved === game.data().host_user ? 'other' : 'host'
    }

    // Only start the clock if isn't already running
    const timerState = await axios.get(`http://localhost:5000/isTimeRunning`)
    if (!timerState.data.isTimeRunning) {
      await axios.get(`http://localhost:5000/startTime/H48woDfI1lwIGZnJh4qz/${player}`)
    }
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

    // Listen for timer ticks
    timersCollection
      .doc('H48woDfI1lwIGZnJh4qz')
      .onSnapshot(async doc => {
        // Set the timer of the next player to move
        if (this.bIsFirstRun) {
          console.log('firstRun')
          await (this.isHostWhite) ?
            this.aSetHostTimeLeft() :
            this.aSetOtherTimeLeft()
        } else {
          console.log('not first run')
          await (this.lastPlayerMoved === this.hostUserID) ?
            this.aSetOtherTimeLeft() : 
            this.aSetHostTimeLeft()
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
      enemyName: '',
      currentGame: null,
      lastPlayerMoved: null,
      bHostRunning: true,
      bOtherRunning: false,
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

    canMakeMove() {
      return this.lastPlayerMoved !== auth.currentUser.uid
    },

    selfSeconds() {
      return (auth.currentUser.uid === this.hostUserID) ?
        this.hostTimeLeft :
        this.otherTimeLeft
    },

    enemySeconds() {
      return (auth.currentUser.uid === this.hostUserID) ?
        this.otherTimeLeft :
        this.hostTimeLeft
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

      // Write last player moved to db 
      await this.currentGame.update({ last_player_moved: this.lastPlayerMoved })

      // Stop the last player's clock
      await axios.get('http://localhost:5000/stopTime')

      // Start the other player's clock
      const player = this.lastPlayerMoved === this.hostUserID ? 'other' : 'host'
      await axios.get(`http://localhost:5000/startTime/H48woDfI1lwIGZnJh4qz/${player}`)
    },

    async updateLastPlayerMoved(coords) {
      const { nRow, nCol, nDestRow, nDestCol } = coords
      this.prevSourceSquare = { nRow, nCol }
      this.aSetPrevDestSquare({ nRow: nDestRow, nCol: nDestCol })

      // The first move has been made
      if (this.bIsFirstRun) {
        this.aSetFirstRun(false)
      }

      if (!this.isCapturing) {
        await this.endPlayerTurn(this.prevSourceSquare)
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
