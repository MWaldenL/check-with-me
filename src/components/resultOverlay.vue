<template>
<div>
  <h1 class="overlay-text" id="win-message"> {{ winnerMessage }} </h1>
  <b-button @click="requestRematch" class="overlay-text overlay-button" id="request-rematch">New Game</b-button>
  <b-button @click="returnToLobby" class="overlay-text overlay-button" id="return-to-lobby">Return to Lobby</b-button>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { 
  auth, 
  gamesCollection, 
  usersCollection, 
  timersCollection
} from '@/firebase'

export default {
  name: 'ResultOverlay',
  computed: {
    ...mapGetters({
      winner: 'getWinner'
    }), 

    winnerMessage () {
      if (this.winner === 'D')
        return 'Draw!'
      else if (this.winner === 'W')
        return 'White Wins!'
      else if (this.winner === 'B')
        return 'Black Wins!'
      else
        return 'ERROR'
    },
  },
  methods: {
    ...mapActions([
      'aSetActiveGame', 
      'aResetGame'
    ]),
    requestRematch () {
      // this.aResetGame()
      this.aSetActiveGame(true)
      this.$refs['modal'].hide()
    },
    returnToLobby () {
      this.$refs['modal'].hide()
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
#request-rematch {
  background-color: #e8912c;
  margin-right: 21px;
}
#return-to-lobby {
  background-color: #ababab;
  margin-left: 21px;
}

</style>