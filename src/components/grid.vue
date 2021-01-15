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
  
  async created() {
    const gameDoc = await gamesCollection.doc('Vc0H4f4EvY6drRKnvsk5')
    const game = await gameDoc.get()
    this.lastPlayerMoved = game.data().last_player_moved // change to local var if fail
    const player = this.lastPlayerMoved === game.data().host_user ? 'other' : 'host'

    // Set the current game
    this.currentGame = gameDoc

    // Get the enemy username
    await this.aGetEnemyUsername()

    // Set the player's username
    const currentUser = await this.currentUser.data 
    this.selfName = currentUser.username

    // Check first if the time is running
    const timerState = await axios.get(`http://localhost:5000/isTimeRunning`)

    // Only start the clock if no one else is running the clock
    if (!timerState.data.isTimeRunning) {
      await axios.get(`http://localhost:5000/startTime/H48woDfI1lwIGZnJh4qz/${player}`)
    }

    // Put back in mounted hook if it fails
    await this.aSetHostTimeLeft() 
    await this.aSetOtherTimeLeft()
  },

  async mounted() {
    // Set up db listeners
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
              if (!this.isCapturing) {
                await this.endPlayerTurn()
              }
            }
          }
        } else {
          this.aFlushStateAfterTurn()
        }
      })

    // Listen for timer ticks
    timersCollection
      .doc('H48woDfI1lwIGZnJh4qz')
      .onSnapshot(doc => {
        // Set the timer of the next player to move
        if (this.lastPlayerMoved === this.hostUserID) {
          this.aSetOtherTimeLeft()
        } else {
          this.aSetHostTimeLeft()
        }
        
        // Check if someone has won on time
        const didBlackWin = (this.hostTimeLeft === 0 && this.isHostWhite) || (this.otherTimeLeft === 0 && !this.isHostWhite)
        const didWhiteWin = (this.otherTimeLeft === 0 && this.isHostWhite) || (this.hostTimeLeft === 0 && !this.isHostWhite)
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
      bOtherRunning: false
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
      'aFlushStateAfterTurn'
    ]),

    async endPlayerTurn() {
      const isMoveWhite = 
        bSourceHasWhite(this.board, this.prevDestSquare) || 
        bSourceHasWhiteKing(this.board, this.prevDestSquare) 

      this.lastPlayerMoved = (this.isHostWhite ^ isMoveWhite) ? this.otherUserID : this.hostUserID

      console.log('ending player turn')
      
      // Prevent state leaks
      this.aFlushStateAfterTurn()

      // Write last player moved to db 
      await this.currentGame.update({ last_player_moved: this.lastPlayerMoved })

      // Stop the last player's clock
      await axios.get('http://localhost:5000/stopTime')

      // Start the other player's clock
      const player = this.lastPlayerMoved === this.hostUserID ? 'other' : 'host'
      await axios.get(`http://localhost:5000/startTime/${player}`)
    },

    updateLastPlayerMoved(coords) {
      const { nRow, nCol, nDestRow, nDestCol } = coords
      this.aSetPrevDestSquare({ nRow: nDestRow, nCol: nDestCol })

      if (!this.isCapturing) {
        this.endPlayerTurn()
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
