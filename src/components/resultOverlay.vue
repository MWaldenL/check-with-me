<template>
<div>
  <h1 class="overlay-text" id="win-resign-message"> {{ winnerResignMessage }} </h1>
  <h1 class="overlay-text" id="win-message"> {{ winnerMessage }} </h1>
  <b-button @click="requestRematch" class="overlay-text overlay-button" id="request-rematch">New Game</b-button>
  <b-button @click="returnToLobby" class="overlay-text overlay-button" id="return-to-lobby">Return to Lobby</b-button>

  <!-- <h5 class="overlay-text mt-5">these are for testing only, remove upon deployment</h5>
  <b-button @click="startNewReg" class="overlay-text overlay-button" variant="success">Start new regular game</b-button>
  <b-button @click="startNewWin" class="overlay-text overlay-button" variant="info">Start new winning game</b-button>
  <b-button @click="startNewWinWhiteStuck" class="overlay-text overlay-button" variant="info">Start new winning game with white stuck</b-button>
  <b-button @click="resetUserPoints" class="overlay-text overlay-button" variant="danger">Reset user points</b-button> -->
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

    isSelfHost() {
      return auth.currentUser.uid === this.hostUserID
    }
  },
  methods: {
    ...mapActions([
      'aSetActiveGame', 
      'aResetGame',
      'aSetWinner'
    ]),

    async requestRematch () {
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

    },

    async returnToLobby () {
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
#request-rematch {
  background-color: #e8912c;
  margin-right: 21px;
}
#return-to-lobby {
  background-color: #ababab;
  margin-left: 21px;
}

</style>