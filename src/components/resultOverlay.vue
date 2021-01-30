<template>
<div>
  <h1 class="overlay-text" id="win-resign-message"> {{ winnerResignMessage }} </h1>
  <h1 class="overlay-text" id="win-logout-message"> {{ winnerLogoutMessage }} </h1>
  <h1 class="overlay-text" id="win-message"> {{ winnerMessage }} </h1>
  <b-button @click="requestRematch" class="overlay-text overlay-button" id="request-rematch" v-if="!didEnemyLogout">
    New Game
  </b-button>
  <b-button @click="returnToLobby" class="overlay-text overlay-button" id="return-to-lobby">
    Return to Lobby
  </b-button>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { 
  auth, 
  gamesCollection
} from '@/firebase'

export default {
  name: 'ResultOverlay',
  props: ['didEnemyLogout'],
  computed: {
    ...mapGetters({
      winner: 'getWinner',
      hostUserID: 'getHostUser',
      currentGame: 'getCurrentGame'
    }), 

    winnerMessage () {
      if (this.winner === 'D')
        return 'Draw!'
      else if (this.winner === 'W' || this.winner === "WR")
        return 'White Wins!'
      else if (this.winner === 'B' || this.winner === "BR")
        return 'Black Wins!'
      else
        return 'ERROR'
    },

    winnerResignMessage () {
      if (this.winner === "WR")
        return 'Black Resigned!'
      else if (this.winner === "BR")
        return 'White Resigned!'
      else
        return ''
    },

    winnerLogoutMessage() {
      if (this.didEnemyLogout) {
        return this.winner === 'B' ? 
          'White has logged out from the game!' : 
          'Black has logged out from the game!'
      }
    },

    isSelfHost() {
      return auth.currentUser.uid === this.hostUserID
    }
  },
  methods: {
    ...mapActions([
      'aSetActiveGame', 
      'aResetGame',
      'aSetWinner',
      'aDeleteGame',
      'aDeleteTimer'
    ]),

    async requestRematch() {
      const gameDoc = await gamesCollection.doc(this.currentGame).get()
      const bRematchIsRequested = gameDoc.data().rematch_requested !== "none"
      const rematchRequestedBy = this.isSelfHost ? "host" : "other"

      if (bRematchIsRequested) {
        return
      } else {
        await gamesCollection
          .doc(this.currentGame)
          .update({
            rematch_requested: rematchRequestedBy
          })
      }

      await gamesCollection
        .doc(this.currentGame)
        .update({
          board_state: "[FEN \"O:W1,3,5,7,10,12,14,16,17,19,21,23:B42,44,46,48,49,51,53,55,58,60,62,64\"]",
          black_count: 12,
          white_count: 12,
          last_player_moved: lastPlayerMoved
        })
    },

    async returnToLobby() {
      if (this.didEnemyLogout) { // Coming from enemy premature logout
        await this.aDeleteGame()
        await this.aDeleteTimer()
        this.$router.push('/')
      } else { // Coming from the end of the game
        const gameDoc = await gamesCollection.doc(this.currentGame).get()
        const enemyLeft = gameDoc.data().enemy_left !== "none" || gameDoc.data().enemy_left_confirmed

        if (enemyLeft) {
          return
        } else {
          await gamesCollection
            .doc(this.currentGame)
            .update({
              enemy_left: auth.currentUser.uid
            })
        }
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@700&family=Roboto&display=swap');
.overlay-text {
  font-family: 'Raleway', Arial, Helvetica, sans-serif;
  font-weight: 700;
  color: #ffffff;
}
.overlay-button {
  font-size: 18px;
  padding: 10px 15px;
}
#win-message {
  font-size: 64px;
  margin-bottom: 25px;
}
#win-resign-message {
  font-size: 32px;
  text-decoration: underline;
}
#win-logout-message {
  font-size: 32px;
  text-decoration: underline;
}
#request-rematch {
  background-color: #e8912c;
  margin-right: 21px;
}
#return-to-lobby {
  background-color: #ababab;
  margin-left: 21px;
}

</style>