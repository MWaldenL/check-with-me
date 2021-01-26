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
      <h1 id="p1-count" class="pt-3"> Pieces left: {{ otherCount }} </h1>
    </div>

    <b-overlay :show="!activeGame" bg-color="#2d2d2d" blur="0" opacity="0.75">
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
              @makeMove="updateLastPlayerMoved"
              @isLastMoveCapture="setLastMoveCapture"/>
          </tr>
        </table>
      </div>
      <template #overlay>
        <ResultOverlay />
      </template>
    </b-overlay>
    
    <!-- Self -->
    <div id="p2-details" class="details">
      <h1 id="p2-count" class="pb-4"> Pieces left: {{ selfCount }} </h1>
      <h1>
        <keep-alive>
          <span class="time text-white" id="selfTime">
            {{ selfSeconds | minutes | formattedTime }}:{{ selfSeconds | seconds | formattedTime }}
          </span>
        </keep-alive>
        {{ selfName }}
      </h1>
    </div>
    
    <!-- Buttons -->
    <b-button 
      id="draw" 
      class="btn-info" 
      v-if="isBoardEligibleForDraw"
      @click="offerDraw"> 
      Draw</b-button>
      
    <DrawModal 
      @acceptDraw="endGameInDraw" 
      @rejectDraw="handleDrawReject" />

    <b-button 
      id="resign" 
      class="btn-danger" 
      v-b-modal.resign-modal>
      Resign</b-button>
    <ResignModal />
  </div>
</template>

<script>
import axios from 'axios'
import { bSourceHasWhite, bSourceHasWhiteKing } from '@/store/services/moveCaptureService'
import { checkIfSelfStuck, checkIfEnemyStuck } from '@/store/services/winCheckerService'
import { getNewScore } from '@/store/services/eloService'
import { 
  auth, 
  gamesCollection, 
  usersCollection, 
  timersCollection
} from '@/firebase'
import { mapGetters, mapActions } from 'vuex'
import Cell from './cell'
import Sidebar from './sidebar'
import ResultOverlay from './resultOverlay'
import DrawModal from './drawModal'
import ResignModal from './resignModal'

export default {
  name: 'Grid',
  components: {
    Cell,
    Sidebar,
    ResultOverlay,
    DrawModal,
    ResignModal
  },
  
  // Called on refreshes or new loads 
  async created() {
    const gameDoc = gamesCollection.doc('VUqGnWBLmgulz3X5O13h')   // hardcoded
    const timerDoc = timersCollection.doc('t3HwE1ES1HAJy9c0lnoc') // hardcoded
    const game = await gameDoc.get()
    const timer = await timerDoc.get()

    // Set the game data
    this.currentGameData = game.data()

    // Check if someone has won from a logout
    // The player present in the room will receive a modal, and
    // the player who logged out will know from their score that they lost
    this.setWinnerFromLogout(game.data())

    // Set collections
    this.currentGameDoc = gameDoc
    this.currentTimerDoc = timerDoc 

    // Set first run and last player moved 
    this.bIsFirstRun = this.currentGameData.is_first_run
    this.lastPlayerMoved = this.currentGameData.last_player_moved
    
    // Set the last player moved from the timer document, since this is updated as well
    this.lastPlayerMoved = timer.data().last_player_moved

    // Set usernames
    await this.setSelfUsername()
    await this.aGetEnemyUsername()

    // Set timer data
    // If player time is not running, fetch from db else fetch from server
    // Handles cases where a player opens their side of the game when their time is already running
    await this.setSelfTimeFromServerOrDB()
    await this.setEnemyTimeFromServerOrDB()

    // Set the initial player to move
    const playerToMove = this.bIsFirstRun ? this.playerIfFirstRun : this.playerIfOngoingGame // if async playerIfOngoingGame bug make local again 
    this.setPlayerToMove(playerToMove)
    
    // Check if time is already running
    this.determineClockToRun()
  },

  async mounted() {
    // Listen for board state changes
    gamesCollection
      .doc('VUqGnWBLmgulz3X5O13h') // Obtain from state in the future when rooms are implemented
      .onSnapshot(async doc => {
        const data = await doc.data()
        const boardState = data.board_state
        const draw = data.draw
        const winnerFromLogout = data.winner_from_logout
        const playerIsWhite = this.selfColor === 'w'
        const playerIsBlack = this.selfColor === 'b'

        // Early returns 
        // Check if someone has logged out while in game
        // if (winnerFromLogout !== '') {
        //   this.setWinnerFromLogout(data)
        //   return
        // }

        // Check if the game has ended in a draw
        if (draw) {
          this.endGameInDraw()
          return 
        }

        // Update the last player moved and the position
        this.bIsFirstRun = data.is_first_run
        this.lastPlayerMoved = data.last_player_moved
        this.drawOfferedBy = data.draw_offered_by
        this.aUpdateBoard({ boardState, playerIsBlack })
        this.aUpdateCount({ 
          white: data.white_count, 
          black: data.black_count
        })

        // Listen for and handle draw offers
        this.handleDrawOffer(this.drawOfferedBy)

        // Check for win
        // Check for stuck states
        let whiteStuck
        let blackStuck

        if (this.isSelfWhite) { 
          whiteStuck = checkIfSelfStuck(this.board, true)
          blackStuck = checkIfEnemyStuck(this.board, true)
        } else {
          whiteStuck = checkIfEnemyStuck(this.board, false)
          blackStuck = checkIfSelfStuck(this.board, false)
        }

        if (whiteStuck && blackStuck) { // if both players are stuck, call a draw
          this.updateSelfScore('D')
          this.aSetWinner('D')
          this.aSetActiveGame(false)
          return
        } else if (whiteStuck || data.white_count === 0) { // if only white is stuck or white has no more pieces, black wins
          this.updateSelfScore('B')
          this.aSetWinner('B')
          this.aSetActiveGame(false)
          return
        } else if (blackStuck || data.black_count === 0) { // if only black is stuck or black has no more pieces, white wins
          this.updateSelfScore('W')
          this.aSetWinner('W')
          this.aSetActiveGame(false)
          return
        }

        // Check for player resignation
        if (data.resign === "b") {
          this.updateSelfScore('W')
          this.aSetWinner('WR')
          this.aSetActiveGame(false)
          return
        } else if (data.resign === "w") {
          this.updateSelfScore('B')
          this.aSetWinner('BR')
          this.aSetActiveGame(false)
          return
        }

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

    // Listen for timer state changes
    timersCollection
      .doc('t3HwE1ES1HAJy9c0lnoc')
      .onSnapshot(async doc => {
        // Sync the other player's timer with the db
        const data = doc.data()
        const remoteEnemyTime = this.isSelfHost ? data.other_timeLeft : data.host_timeLeft
        this.enemySeconds = remoteEnemyTime // might implement finer implementations but this one for now

        // Determine whose clock to run
        if (!this.bIsFirstRun) {
          //console.log('snapshot() determine running clock')
          this.determineClockToRun()
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
      prevSourceSquare: null,

      showingDrawModal: false,
      isLastMoveCapture: false,
      isCountingMovesForDraw: false,
      drawCounter: 0,
      drawOfferedBy: '',
      burdenedColor: ''
    }
  },

  computed: {
    ...mapGetters({
      board: 'getEntireBoard',
      whiteCount: 'getWhiteCount',
      blackCount: 'getBlackCount',
      currentUser: 'getCurrentUser',
      currentGame: 'getCurrentGame',
      hostUserID: 'getHostUser',
      otherUserID: 'getOtherUser',
      enemyUsername: 'getEnemyUsername',
      isHostWhite: 'getIsHostWhite',
      hostTimeLeft: 'getHostTimeLeft',
      otherTimeLeft: 'getOtherTimeLeft',
      isCapturing: 'getCaptureSequenceState',
      isCaptureRequired: 'getIsCaptureRequired',
      prevDestSquare: 'getPrevDestSquare',
      activeGame: 'getActiveGame',
      currentGame: 'getCurrentGame'
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
    },

    isSelfWhite() {
      return this.selfColor === 'w'
    },

    selfCount() {
      return (this.selfColor === 'w') ? this.whiteCount : this.blackCount
    },

    otherCount() {
      return (this.selfColor === 'w') ? this.blackCount : this.whiteCount
    },
    
    selfPlayerType() {
      return this.isSelfHost ? 'host' : 'other'
    },

    enemyPlayerType() {
      return this.isSelfHost ? 'other' : 'host'
    },

    playerIfFirstRun() {
      return this.isSelfWhite ? 'self' : 'enemy'
    },

    playerIfOngoingGame() {
      return this.lastPlayerMoved === auth.currentUser.uid ? 'enemy' : 'self'
    },

    isBoardEligibleForDraw() {
      return this.selfCount <= 3 && this.otherCount <= 3
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
      'aSetWinner',
      'aUpdateBoard',
      'aUpdateCount',
      'aGetEnemyUsername',
      'aHighlightBoardCaptures',
      'aHighlightCaptureFromSequence',
      'aSetPrevDestSquare',
      'aSetCaptureRequired',
      'aFlushStateAfterTurn',
      'aSetActiveGame'
    ]),

    async setSelfUsername() {
      const currentUser = await this.currentUser.data 
      this.selfName = currentUser.username
    },

    /**
     * Post-game methods
     */
    async updateSelfScore(winner) {
      // gets user documents for current player and opponent
      const selfDoc = usersCollection.doc(auth.currentUser.uid)
      const otherDoc = this.isSelfHost ? usersCollection.doc(this.otherUserID) : usersCollection.doc(this.hostUserID)

      const self = await selfDoc.get()
      const other = await otherDoc.get()

      // store current points for elo computation
      const selfScore = self.data().points
      const otherScore = other.data().points

      // store current data for later update
      let selfWinsWhite = self.data().wins_white
      let selfWinsBlack = self.data().wins_black
      let selfLossWhite = self.data().loss_white
      let selfLossBlack = self.data().loss_black
      let selfDrawWhite = self.data().draw_white
      let selfDrawBlack = self.data().draw_black

      // initialize new score for elo computation
      let newScore

      if (winner === 'D') { // if result is a draw, compute new elo ranking with score = 0.5 and add to draw count
        newScore = getNewScore(selfScore, otherScore, 0.5)
        if (this.selfColor === 'b')
          selfDrawBlack++
        else
          selfDrawWhite++
      } else if (winner === 'B') {
        if (this.selfColor === 'b') { // if black wins and self is black, compute new elo ranking with score = 1 and add to black win count
          newScore = getNewScore(selfScore, otherScore, 1)
          selfWinsBlack++
        } else { // if black wins and self is white, compute new elo ranking with score = 0 and add to white lose count
          newScore = getNewScore(selfScore, otherScore, 0)
          selfLossWhite++
        }
      } else {
        if (this.selfColor === 'w') { // if white wins and self is white, compute new elo ranking with score = 1 and add to white win count
          newScore = getNewScore(selfScore, otherScore, 1)
          selfWinsWhite++
        } else { // if white wins and self is black, compute new elo ranking with score = 0 and add to black lose count
          newScore = getNewScore(selfScore, otherScore, 0)
          selfLossBlack++
        }
      }

      // Update self user document with new values
      await usersCollection
        .doc(auth.currentUser.uid)
        .update({
          points: newScore,
          wins_black: selfWinsBlack,
          wins_white: selfWinsWhite,
          loss_black: selfLossBlack,
          loss_white: selfLossWhite,
          draw_black: selfDrawBlack,
          draw_white: selfDrawWhite,
        })
    },
    
    async offerDraw() {
      this.resetDrawCounter()
      this.burdenedColor = this.selfColor === 'w' ? 'b' : 'w'
      await this.currentGameDoc.update({ 
        draw_offered_by: this.selfColor
      })
    },

    async endGameInDraw() {
      // Handle game result states
      this.updateSelfScore('D')
      this.aSetWinner('D')
      this.aSetActiveGame(false)
      this.$bvModal.hide("draw-modal")

      // Update database
      await gamesCollection
        .doc(this.currentGame)
        .update({ draw: true })
    },

    setLastMoveCapture(value) {
      this.isLastMoveCapture = value
    },

    handleDrawOffer() {
      const didEnemyOfferDraw = this.drawOfferedBy !== this.selfColor 
      const willResetDrawCounter = !didEnemyOfferDraw || this.isLastMoveCapture
      const willIncrementDrawCounter = 
        this.isCountingMovesForDraw && 
        this.burdenedColor === this.selfColor &&
        this.lastPlayerMoved === auth.currentUser.uid

      // Show the draw modal prompt
      if (this.drawOfferedBy !== '' && didEnemyOfferDraw) {
        this.$bvModal.show("draw-modal")
      }

      // If self offers a draw or a capture is made, reset to 0
      if (willResetDrawCounter) {
        this.resetDrawCounter()
        return
      }

      // Only increment when someone has declined a draw offer, 
      // when the current player has moved,
      if (willIncrementDrawCounter) {
        this.incrementDrawCounter()
        console.log(this.drawCounter)
      } 

      // End the game after 20 moves/39 ply if a player has failed to make a capture
      const isDrawCounterFull = this.drawCounter === 39  
      if (isDrawCounterFull) {
        this.endGameInDraw()
      }
    },

    async handleDrawReject() {
      // Magic
      if (this.lastPlayerMoved === auth.currentUser.uid) {
        this.drawCounter -= 2
      }
    
      // Set the player who rejected the draw and needs to win in <= 20 moves
      this.burdenedColor = this.selfColor

      // Start the draw counter
      this.isCountingMovesForDraw = true

      // If a player has rejected a draw, clear the draw offer
      await this.currentGameDoc.update({ draw_offered_by: '' })
    },

    incrementDrawCounter() {
      this.drawCounter++
    },

    resetDrawCounter() {
      this.drawCounter = 0
    },

    setWinnerFromLogout(gameData) {
      const winnerFromLogout = gameData.winner_from_logout
      if (winnerFromLogout === auth.currentUser.uid) {
        const winnerColor = this.selfColor.toUpperCase()
        this.updateSelfScore(winnerColor)
        this.aSetWinner(winnerColor)
        this.aSetActiveGame(false)
      } 
    },

    /**
     * Turn methods
     */
    setPlayerToMove(player) {
      this.playerToMove = player
    },

    async endPlayerTurn() {
      const isMoveWhite = 
        bSourceHasWhite(this.board, this.prevDestSquare) || 
        bSourceHasWhiteKing(this.board, this.prevDestSquare) 

      this.lastPlayerMoved = (this.isHostWhite ^ isMoveWhite) ? this.otherUserID : this.hostUserID
      // Write last player moved to game doc 
      await this.currentGameDoc.update({ 
        last_player_moved: this.lastPlayerMoved 
      })

      // Write last player moved to timer doc
      await this.currentTimerDoc.update({
        last_player_moved: this.lastPlayerMoved
      }) 
      
      // Prevent state leaks
      this.aFlushStateAfterTurn()

      // Stop self time and start enemy time
      await this.stopSelfTime()
      await this.startEnemyTime()

      // Write the updated self time to db
      this.writeUpdatedTimeToDB() 
    },

    async updateLastPlayerMoved(coords) {
      const { nRow, nCol, nDestRow, nDestCol } = coords
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


    /**
     * Timer methods
     */
    async startSelfTime() {
      this.isSelfTimeRunning = true
      this.setPlayerToMove('self')

      const selfTimeQuery = await axios.get(`http://localhost:5000/isTimeRunning/${this.selfPlayerType}`)
      const selfTimeLeftQuery = await axios.get(`http://localhost:5000/currentTimeLeft/${this.selfPlayerType}`)
      const isSelfServerTimeRunning = selfTimeQuery.data.isTimeRunning
      const shouldTimeTick = this.selfSeconds > 0

      if (!shouldTimeTick) {
        clearInterval(this.currentRunningTimer)
      } else {
        // Start server time
        if (!isSelfServerTimeRunning) {
          if (this.selfPlayerType === 'host') {
            await axios.get(`http://localhost:5000/startHostTime/${this.selfSeconds}`)
          } else if (this.selfPlayerType === 'other') {
            await axios.get(`http://localhost:5000/startOtherTime/${this.selfSeconds}`)
          }
        }

        // Flush then start client time
        clearInterval(this.currentRunningTimer)
        this.currentRunningTimer = setInterval(() => {
          this.selfSeconds--
          if (this.selfSeconds <= 0) {
            clearInterval(this.currentRunningTimer)
          }
        }, 1000)
      }
    },

    async stopSelfTime() {
      // Stop client time
      this.isSelfTimeRunning = false
      clearInterval(this.currentRunningTimer)
      
      // Stop server time
      if (this.selfPlayerType === 'host') {
        await axios.get('http://localhost:5000/stopHostTime')
      } else {
        await axios.get('http://localhost:5000/stopOtherTime')
      }
    },

    async startEnemyTime() {
      // Set flags in client
      // this.isEnemyTimeRunning = true
      this.setPlayerToMove('enemy')

      // Start time in server
      const enemyTimeQuery = await axios.get(`http://localhost:5000/isTimeRunning/${this.enemyPlayerType}`)
      const isEnemyServerTimeRunning = enemyTimeQuery.data.isTimeRunning
      const shouldTimeTick = this.enemySeconds > 0

      if (!shouldTimeTick) {
        clearInterval(this.currentRunningTimer)
      } else {
        if (!isEnemyServerTimeRunning) {
          if (this.enemyPlayerType === 'host') {
            await axios.get(`http://localhost:5000/startHostTime/${this.enemySeconds}`)
          } else {
            await axios.get(`http://localhost:5000/startOtherTime/${this.enemySeconds}`)
          }
        }
      
        // Start client time
        clearInterval(this.currentRunningTimer)
        this.currentRunningTimer = setInterval(() => {
          this.enemySeconds--
          if (this.enemySeconds <= 0) {
            clearInterval(this.currentRunningTimer)
          }
        }, 1000)
      } 
    },

    async stopEnemyTime() {
      // Stop the enemy client's timer
      this.isEnemyTimeRunning = false
      clearInterval(this.currentRunningTimer)

      // Start time in server
      if (this.enemyPlayerType === 'host') {
        await axios.get(`http://localhost:5000/stopHostTime`)
      } else {
        await axios.get(`http://localhost:5000/stopOtherTime`)
      }
    },

    async setSelfTimeFromServerOrDB() {
      const timerDB = await this.currentTimerDoc.get()
      const timeRunningQuery = await axios.get(`http://localhost:5000/isTimeRunning/${this.selfPlayerType}`)
      this.isSelfTimeRunning = timeRunningQuery.data.isTimeRunning

      // If player's time is not running, sync with db
      if (!this.isSelfTimeRunning) {
        this.selfSeconds = this.isSelfHost ? 
          timerDB.data().host_timeLeft : 
          timerDB.data().other_timeLeft
      } else { // Otherwise, sync with server
        const selfTimeQuery = await axios.get(`http://localhost:5000/currentTimeLeft/${this.selfPlayerType}`)
        this.selfSeconds = selfTimeQuery.data.timeLeft
      }
    },

    async setEnemyTimeFromServerOrDB() {
      const timerDB = await this.currentTimerDoc.get()
      const timeQuery = await axios.get(`http://localhost:5000/isTimeRunning/${this.enemyPlayerType}`)
      this.isEnemyTimeRunning = timeQuery.data.isTimeRunning

      // If player's time is not running, sync with db
      if (!this.isEnemyTimeRunning) {
        this.enemySeconds = this.isSelfHost ? 
          timerDB.data().other_timeLeft :        
          timerDB.data().host_timeLeft 
      } else { // Otherwise, sync with server
        const enemyTimeQuery = await axios.get(`http://localhost:5000/currentTimeLeft/${this.enemyPlayerType}`)
        this.enemySeconds = enemyTimeQuery.data.timeLeft
      }
    },

    async determineClockToRun() {
      if (this.lastPlayerMoved !== auth.currentUser.uid) { // opponent last move
        await this.stopEnemyTime()
        await this.startSelfTime()
      } else { // self made last move
        await this.stopSelfTime()
        await this.startEnemyTime()
      }
    },

    async writeUpdatedTimeToDB() {
      const newTimeObj = this.isSelfHost ? 
        { host_timeLeft: this.selfSeconds } : 
        { other_timeLeft: this.selfSeconds } 
      await this.currentTimerDoc.update(newTimeObj)   
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
#draw {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  font-weight: 100;
  font-size: 20px;
  padding: 10px 40px;

  position: absolute;
  right: 3vw;
  bottom: 40vh;
}
#box {
  position: relative;
  margin-top: 10px;
}
</style>
