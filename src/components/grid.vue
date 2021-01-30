<template>
  <div id="box">
    <Sidebar 
      :selfColor="selfColor"
      :finishedUpdatingScore="finishedUpdatingScore"
      @logoutFromGame="updateSelfScore" />

    <!-- Opponent -->
    <div id="p1-details" class="details">
      <div class="d-flex">
        <h1> 
          {{ enemyUsername }} 
          <keep-alive>
            <span class="time text-white" id="enemyTime">
              {{ enemySeconds | minutes | formattedTime }}:{{ enemySeconds | seconds | formattedTime }}
            </span>
          </keep-alive>
        </h1>
        <img src="../../public/assets/to-move.png" id="turn-icon-enemy" class="ml-5 turn-icon" v-show="!canMakeMove" />
      </div>

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
        <ResultOverlay :didEnemyLogout="didEnemyLogout" />
      </template>
    </b-overlay>
    
    <!-- Self -->
    <div id="p2-details" class="details">
      <h1 id="p2-count" class="pb-4"> Pieces left: {{ selfCount }} </h1>
      <div class="d-flex justify-content-end">
        <h1>
          <img src="../../public/assets/to-move.png" id="turn-icon-self" class="mr-5 turn-icon" v-show="canMakeMove" />
          <keep-alive>
            <span class="time text-white" id="selfTime">
              {{ selfSeconds | minutes | formattedTime }}:{{ selfSeconds | seconds | formattedTime }}
            </span>
          </keep-alive>
          {{ selfName }}
        </h1>
      </div>
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
    <RematchRequesteeModal />
    <RematchRequestorModal />
    <ChooseNewTimeModal @resetTimers="resetTimers" />
    <WaitForTimeModal />
    <StartGameModal @resetTimers="resetTimers" />
    <ConfirmLeaveModal />
    <LobbyModal />
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
import { getSingleGame } from '@/resources/gameModel.js'
import RematchRequesteeModal from './rematchRequesteeModal'
import RematchRequestorModal from './rematchRequestorModal'
import ChooseNewTimeModal from './chooseNewTimeModal'
import WaitForTimeModal from './waitForTimeModal'
import StartGameModal from './startGameModal'
import ConfirmLeaveModal from './confirmLeaveModal'
import LobbyModal from './lobbyModal'

export default {
  name: 'Grid',
  components: {
    Cell,
    Sidebar,
    ResultOverlay,
    DrawModal,
    ResignModal,
    RematchRequesteeModal,
    RematchRequestorModal,
    ChooseNewTimeModal,
    WaitForTimeModal,
    StartGameModal,
    ConfirmLeaveModal,
    LobbyModal
  },
  
  // Called on refreshes or new loads 
  async created() {
    const gameID = await this.$route.params.id
    const gameDoc = gamesCollection.doc(gameID)
    const game = await gameDoc.get()
    const gameData = game.data()
    const timerID = gameData.timer_id.id
    const timerDoc = timersCollection.doc(timerID)
    const timer = await timerDoc.get()

    // Set the game data
    this.currentGameData = gameData

    // Set active game
    this.aSetActiveGame(true)

    // Check if someone has won from a logout
    // The player present in the room will receive a modal, and
    // the player who logged out will know from their score that they lost
    this.setWinnerFromLogout(gameData)

    // Set collections
    this.currentGameDoc = gameDoc
    this.currentTimerDoc = timerDoc 

    // Set first run and last player moved 
    this.bIsFirstRun = this.currentGameData.is_first_run
    this.lastPlayerMoved = this.currentGameData.last_player_moved

    // Set the last player moved from the timer document, since this is updated as well
    this.lastPlayerMoved = timer.data().last_player_moved

    // Reset clocks
    await this.resetClocks()

    // Set timer data
    // If player time is not running, fetch from db else fetch from server
    // Handles cases where a player opens their side of the game when their time is already running
    // await this.setSelfTimeFromServerOrDB()
    // await this.setEnemyTimeFromServerOrDB()
    await this.setSelfTimeFromDB()
    await this.setEnemyTimeFromDB()

    // Set usernames
    await this.setSelfUsername()
    await this.aGetEnemyUsername()

    // Set the initial player to move
    const playerToMove = this.bIsFirstRun ? this.playerIfFirstRun : this.playerIfOngoingGame // if async playerIfOngoingGame bug make local again 
    this.setPlayerToMove(playerToMove)
    
    // Check if time is already running
    this.determineClockToRun()
  },

  async mounted() {
    const gameID = await this.$route.params.id
    const game = await getSingleGame(gameID)
    const timerID = game.timer_id.id

    // Listen for board state changes
    const gameUnsubscribe = gamesCollection
      .doc(this.currentGame)
      .onSnapshot(async doc => {
        // The listener will still be called even after the room has been deleted
        if (!doc.exists) {
          return 
        }
        
        const data = await doc.data()
        const boardState = data.board_state
        const draw = data.draw
        const winnerFromLogout = data.winner_from_logout
        const playerIsWhite = this.selfColor === 'w'
        const playerIsBlack = this.selfColor === 'b'

        this.bIsFirstRun = data.is_first_run
        this.lastPlayerMoved = data.last_player_moved
        this.drawOfferedBy = data.draw_offered_by
        this.aUpdateBoard({ boardState, playerIsBlack })
        this.aUpdateCount({ white: data.white_count, black: data.black_count })

        if (this.activeGame) {
          console.log('entering active game clause')

          // Check if someone has logged out while in game
          if (winnerFromLogout) {
            this.setWinnerFromLogout(data)

            if (!this.isSelfHost) { // For the other player to show the modified overlay
              this.didEnemyLogout = true
            }
            return
          }

          // Check if the game has ended in a draw
          if (draw) {
            this.endGameInDraw()
            return 
          }
          
          // Listen for and handle draw offers
          this.handleDrawOffer(this.drawOfferedBy)

          // Highlight all possible captures when player is not in a capture sequence
          if (this.lastPlayerMoved === auth.currentUser.uid) {
            this.aFlushStateAfterTurn()
          } else {
            if (!this.isCapturing) {
              this.aHighlightBoardCaptures(playerIsWhite)
            } else {  
              // Highlight the available captures from the current sequence
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
          }

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

          // The player who has either their pieces stuck or no more pieces loses 
          const bothStuck = whiteStuck && blackStuck
          const whiteLost = whiteStuck || data.white_count === 0
          const blackLost = blackStuck || data.black_count === 0
          if (bothStuck) {
            this.endGameWithWinner('D')
            return
          } else if (whiteLost) { 
            this.endGameWithWinner('B')
            return
          } else if (blackLost) { 
            this.endGameWithWinner('W')
            return
          }

          // Check for player resignation
          if (data.resign === "b") {
            this.stopClocks()
            this.prepareForRematchRequest()
            this.updateSelfScore({ winner: 'W', isLoggingOut: false })
            this.aSetWinner('WR')
            this.aSetActiveGame(false)
            return
          } else if (data.resign === "w") {
            this.stopClocks()
            this.prepareForRematchRequest()
            this.updateSelfScore({ winner: 'B', isLoggingOut: false })
            this.aSetWinner('BR')
            this.aSetActiveGame(false)
            return
          }
        } else {
          const { 
            rematch_accepted, 
            rematch_requested,
            rematch_time_selected, 
            enemy_left, 
            enemy_left_confirmed
          } = data

          // Check if the enemy has logged out
          const winnerFromLogout = data.winner_from_logout
          if (winnerFromLogout) {
            this.didEnemyLogout = true
          }

          // Check for requests
          this.checkRematchRequests(rematch_requested)

          // Check is the rematch request was accepted
          if (rematch_accepted) {
            this.handleAcceptRematch()
          }

          // Prepare to start game if new time has been selected already
          if (rematch_time_selected && !this.isSelfHost) {
            this.prepareToStartGame()
          }

          // Handle current user wanting to leave
          if (enemy_left === auth.currentUser.uid) {
            this.$bvModal.show('confirm-leave-modal')
          }

          // Send the currently present player to the lobby once the enemy has actually left
          if (enemy_left_confirmed) {
            this.$bvModal.hide('confirm-leave-modal')
            this.$bvModal.show('lobby-modal')
          }
        }        
      })

    // Listen for timer state changes
    timersCollection
      .doc(timerID)
      .onSnapshot(async doc => {
        const data = doc.data()
        const remoteSelfTime = this.isSelfHost ? data.host_timeLeft : data.other_timeLeft
        const remoteEnemyTime = this.isSelfHost ? data.other_timeLeft : data.host_timeLeft

        // If first run from rematch, set the timers
        if (this.bIsFirstRun) {
          this.selfSeconds = remoteSelfTime
          this.enemySeconds = remoteEnemyTime
        }

        // Prevent undefined setting of timers in the middle of the game
        if (this.lastPlayerMoved === auth.currentUser.uid) {
          this.enemySeconds = remoteEnemyTime
        }

        // Determine whose clock to run
        const runningClockOnTurn = !this.bIsFirstRun && this.lastPlayerMoved !== auth.currentUser.uid
        if (runningClockOnTurn) {
          this.determineClockToRun()
        }

        // Check if someone has won on time
        this.checkIfWonOnTime()
      })
  },

  updated() {
    // Make sure to check on update whether a player's time has run out
    this.checkIfWonOnTime()
  },

  data () {
    return {
      selfName: '',
      SERVER_URL: 'https://us-central1-check-with-me.cloudfunctions.net/clock',
      currentGameDoc: null,
      currentGameData: null,
      currentTimerDoc: null,
      currentRunningTimer: null,

      playerToMove: null,
      lastPlayerMoved: null,
      selfSeconds: 600,      
      enemySeconds: 600,

      isSelfTimeRunning: false,
      isEnemyTimeRunning: false,
      bIsFirstRun: true,
      prevSourceSquare: null,

      showingDrawModal: false,
      isLastMoveCapture: false,
      isCountingMovesForDraw: false,
      drawCounter: 0,
      drawOfferedBy: '',
      burdenedColor: '',

      didEnemyLogout: false,
      finishedUpdatingScore: false
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
    },

    didWhiteWinOnTime() {
      return this.enemySeconds === 0 && this.selfColor === 'w' ||
        this.selfSeconds === 0 && this.selfColor === 'b'
    },

    didBlackWinOnTime() {
      return this.enemySeconds === 0 && this.selfColor === 'b' ||
        this.selfSeconds === 0 && this.selfColor === 'w'
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
      'aSetActiveGame',
      'aResetGame',
      'aDeleteGame',
      'aDeleteTimer'
    ]),

    async setSelfUsername() {
      const currentUser = await this.currentUser.data 
      this.selfName = currentUser.username
    },

    /**
     * Rematch 
     */
    checkRematchRequests(rematchRequested) {
      const selfRequested = 
        rematchRequested === "host" && this.isSelfHost ||
        rematchRequested === "other" && !this.isSelfHost

      const enemyRequested = 
        rematchRequested === "host" && !this.isSelfHost ||
        rematchRequested === "other" && this.isSelfHost

      if (selfRequested) {
        this.$bvModal.show('rematch-requestor-modal')
      } else if (enemyRequested) {
        this.$bvModal.show('rematch-requestee-modal')
      }
    },

    handleAcceptRematch() { 
      // Hide the previous modals
      this.$bvModal.hide('rematch-requestor-modal')
      this.$bvModal.hide('rematch-requestee-modal')

      // Show the time chooser modal
      const modal = this.isSelfHost ? 'choose-new-time-modal' : 'wait-for-time-modal'
      this.$bvModal.show(modal)
    },

    prepareToStartGame() {
      this.$bvModal.hide('wait-for-time-modal')
      this.$bvModal.show('start-game-modal')
    },

    resetTimers() { // When coming from a rematch 
      console.log('resetting timers')
      this.selfSeconds = this.hostTimeLeft
      this.enemySeconds = this.otherTimeLeft
    },

    /**
     * Post-game methods
     */  
    async endGameWithWinner(winner) {
      this.stopClocks()
      this.prepareForRematchRequest()
      this.updateSelfScore({ winner, isLoggingOut: false })
      this.aSetWinner(winner)
      this.aSetActiveGame(false)
    },

    async updateSelfScore({ winner, isLoggingOut }) {
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
      console.log('befoer update')
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

      // Update the score when user attempts to log out 
      if (isLoggingOut) {
        this.finishedUpdatingScore = true
      }
      console.log('after update')
      
    },

    async checkIfWonOnTime() {
      if (this.didBlackWinOnTime) {
        this.endGameWithWinner('B')
      } else if (this.didWhiteWinOnTime) {
        this.endGameWithWinner('W')
      }
    },

    prepareForRematchRequest() {
      gamesCollection
        .doc(this.currentGame)
        .update({
          rematch_time_selected: false
        })
    },

    setWinnerFromLogout(gameData) {
      // Once the enemy has confirmed to leave the game, 
      // the game will end and the winner will be determined
      const winnerFromLogout = gameData.winner_from_logout
      if (winnerFromLogout === auth.currentUser.uid) {
        const winnerColor = this.selfColor.toUpperCase()
        this.endGameWithWinner(winnerColor)
      } 
    },  
    
    /**
     * Draw methods
     */
    async offerDraw() {
      this.resetDrawCounter()
      this.burdenedColor = this.selfColor === 'w' ? 'b' : 'w'
      await this.currentGameDoc.update({ 
        draw_offered_by: this.selfColor
      })
    },

    async endGameInDraw() {
      // Handle game result states
      this.endGameWithWinner('D')
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
      } 

      // End the game after 20 moves/39 ply if a player has failed to make a capture
      const isDrawCounterFull = this.drawCounter === 39  
      if (isDrawCounterFull) {
        this.endGameInDraw()
      }
    },

    async handleDrawReject() {
      // Handles situations when the other player offers a draw on their move.
      // Idea is to offset the counter by 2:
      // -1 for the initial listener call
      // -1 to absorb the move the other player will play
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
      // TODO: These might be causing weird stuff to happen
      this.stopSelfClientTime() // switch them back if weird
      this.startEnemyClientTime()

      // Write the updated self time to db
      this.writeUpdatedTimeToDB() 

      await this.startEnemyServerTime()
      await this.stopSelfServerTime()
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
     * Self timer methods
     */
    async startSelfClientTime() {
      this.isSelfTimeRunning = true
      this.setPlayerToMove('self')

      // Flush then start client time
      clearInterval(this.currentRunningTimer)
      this.currentRunningTimer = setInterval(() => {
        this.selfSeconds--
        if (this.selfSeconds <= 0) {
          clearInterval(this.currentRunningTimer)
        }
      }, 1000)
    },

    async startSelfServerTime() {
      const selfTimeQuery = await axios.get(`${this.SERVER_URL}/isTimeRunning/${this.selfPlayerType}`)
      const isSelfServerTimeRunning = selfTimeQuery.data.isTimeRunning

      if (!isSelfServerTimeRunning) {
        if (this.selfPlayerType === 'host') {
          await axios.get(`${this.SERVER_URL}/startHostTime/${this.selfSeconds}`)
        } else if (this.selfPlayerType === 'other') {
          await axios.get(`${this.SERVER_URL}/startOtherTime/${this.selfSeconds}`)
        }
      }
    },

    async stopSelfClientTime() {
      // Stop client time
      this.isSelfTimeRunning = false
      clearInterval(this.currentRunningTimer)
    },

    async stopSelfServerTime() {
      // Stop server time
      if (this.selfPlayerType === 'host') {
        await axios.get(`${this.SERVER_URL}/stopHostTime`)
      } else {
        await axios.get(`${this.SERVER_URL}/stopOtherTime`)
      }
    },

    /**
     * Enemy timer methods
     */
    async stopClocks() {
      this.stopSelfClientTime()
      this.stopSelfServerTime()
      await this.stopEnemyClientTime()
      await this.stopEnemyServerTime()
    },

    async startEnemyClientTime() {
      // this.isEnemyTimeRunning = true
      this.setPlayerToMove('enemy')

      // Start client time
      console.log('starting enemy client time')
      clearInterval(this.currentRunningTimer)
      this.currentRunningTimer = setInterval(() => {
        this.enemySeconds--
        if (this.enemySeconds <= 0) {
          clearInterval(this.currentRunningTimer)
        }
      }, 1000)
    },

    async startEnemyServerTime() {
      console.log('start enemy server')
      const enemyTimeQuery = await axios.get(`${this.SERVER_URL}/isTimeRunning/${this.enemyPlayerType}`)
      const isEnemyServerTimeRunning = enemyTimeQuery.data.isTimeRunning

      // Start time in server
      if (!isEnemyServerTimeRunning) {
        if (this.enemyPlayerType === 'host') {
          await axios.get(`${this.SERVER_URL}/startHostTime/${this.enemySeconds}`)
        } else {
          await axios.get(`${this.SERVER_URL}/startOtherTime/${this.enemySeconds}`)
        }
      }
    },

    async stopEnemyClientTime() {
      // Stop the enemy client's timer
      this.isEnemyTimeRunning = false
      clearInterval(this.currentRunningTimer)
    },

    async stopEnemyServerTime() {
      // Stop time in server
      if (this.enemyPlayerType === 'host') {
        await axios.get(`${this.SERVER_URL}/stopHostTime`)
      } else {
        await axios.get(`${this.SERVER_URL}/stopOtherTime`)
      }
    },

    /**
     * General Timer Methods
     */
    async determineClockToRun() {
      // Stop clients and start server clocks
      if (this.lastPlayerMoved !== auth.currentUser.uid) { // opponent last move
        this.stopEnemyClientTime()
        this.startSelfClientTime()
        await this.startSelfServerTime() // switch back if bad
        await this.stopEnemyServerTime()
      } else { // self made last move
        this.stopSelfClientTime()
        this.startEnemyClientTime()
        await this.startEnemyServerTime() // switch back if bad
        await this.stopSelfServerTime()
      }
    },

    async writeUpdatedTimeToDB() {
      const newTimeObj = this.isSelfHost ? 
        { host_timeLeft: this.selfSeconds } : 
        { other_timeLeft: this.selfSeconds } 
      await this.currentTimerDoc.update(newTimeObj)   
    },

    async setSelfTimeFromDB() {
      const timerDB = await this.currentTimerDoc.get()
      this.selfSeconds = this.isSelfHost ? 
          timerDB.data().host_timeLeft : 
          timerDB.data().other_timeLeft
    },  

    async setEnemyTimeFromDB() {
      const timerDB = await this.currentTimerDoc.get()
      this.enemySeconds = this.isSelfHost ? 
        timerDB.data().other_timeLeft :        
        timerDB.data().host_timeLeft 
    },

    async setSelfTimeFromServerOrDB() {
      const timeRunningQuery = await axios.get(`${this.SERVER_URL}/isTimeRunning/${this.selfPlayerType}`)
      this.isSelfTimeRunning = timeRunningQuery.data.isTimeRunning

      // If player's time is not running, sync with db
      if (!this.isSelfTimeRunning) {
        const timerDB = await this.currentTimerDoc.get()
        this.selfSeconds = this.isSelfHost ? 
          timerDB.data().host_timeLeft : 
          timerDB.data().other_timeLeft
      } else { // Otherwise, sync with server
        const selfTimeQuery = await axios.get(`${this.SERVER_URL}/currentTimeLeft/${this.selfPlayerType}`)
        this.selfSeconds = selfTimeQuery.data.timeLeft
      }
    },

    async setEnemyTimeFromServerOrDB() {
      const timeQuery = await axios.get(`${this.SERVER_URL}/isTimeRunning/${this.enemyPlayerType}`)
      this.isEnemyTimeRunning = timeQuery.data.isTimeRunning

      // If player's time is not running, sync with db
      if (!this.isEnemyTimeRunning) {
        const timerDB = await this.currentTimerDoc.get()
        this.enemySeconds = this.isSelfHost ? 
          timerDB.data().other_timeLeft :        
          timerDB.data().host_timeLeft 
      } else { // Otherwise, sync with server
        const enemyTimeQuery = await axios.get(`${this.SERVER_URL}/currentTimeLeft/${this.enemyPlayerType}`)
        this.enemySeconds = enemyTimeQuery.data.timeLeft
      }
    },

    async resetClocks() {
      console.log('resetting clocks')
      await axios.get(`${this.SERVER_URL}/resetClocks/${this.selfSeconds}`)
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
.turn-icon {
  height: 45px
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
  bottom: 60vh;
}

#resign {
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
