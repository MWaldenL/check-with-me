<template>
<div>
  <h1 class="overlay-text" id="win-resign-message"> {{ winnerResignMessage }} </h1>
  <h1 class="overlay-text" id="win-message"> {{ winnerMessage }} </h1>
  <b-button @click="requestRematch" class="overlay-text overlay-button" id="request-rematch">New Game</b-button>
  <b-button @click="returnToLobby" class="overlay-text overlay-button" id="return-to-lobby">Return to Lobby</b-button>

  <h5 class="overlay-text mt-5">these are for testing only, remove upon deployment</h5>
  <b-button @click="startNewReg" class="overlay-text overlay-button" variant="success">Start new regular game</b-button>
  <b-button @click="startNewWin" class="overlay-text overlay-button" variant="info">Start new winning game</b-button>
  <b-button @click="startNewWinWhiteStuck" class="overlay-text overlay-button" variant="info">Start new winning game with white stuck</b-button>
  <b-button @click="resetUserPoints" class="overlay-text overlay-button" variant="danger">Reset user points</b-button>
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
  },
  methods: {
    ...mapActions([
      'aSetActiveGame', 
      'aResetGame',
      'aSetWinner'
    ]),
    requestRematch () {
      // this.aResetGame()
      this.aSetActiveGame(true)
      // this.$emit("closeOverlay")
    },
    returnToLobby () {
      // this.$emit("closeOverlay")
    },

    // TODO: remove this upon deployment
    async startNewReg () {
      this.aSetActiveGame(true)
      this.aSetWinner('N')
      
      await gamesCollection
            .doc("VUqGnWBLmgulz3X5O13h")
            .update({
              board_state: "[FEN \"O:W1,3,5,7,10,12,14,16,17,19,21,23:B42,44,46,48,49,51,53,55,58,60,62,64\"]",
              black_count: 12,
              white_count: 12,
              last_player_moved: "LLyi0mw1IuaFX1AZeCYP0NcWdL83",
              resign: "none"
            })
    },

    async startNewWin () {
      this.aSetActiveGame(true)
      this.aSetWinner('N')
      
      await gamesCollection
            .doc("VUqGnWBLmgulz3X5O13h")
            .update({
              board_state: "[FEN \"X:W46:B55,58\"]",
              black_count: 2,
              white_count: 1,
              last_player_moved: "LLyi0mw1IuaFX1AZeCYP0NcWdL83",
              resign: "none"
            })
    },

    async startNewWinWhiteStuck () {
      this.aSetActiveGame(true)
      this.aSetWinner('N')
      
      await gamesCollection
            .doc("VUqGnWBLmgulz3X5O13h")
            .update({
              board_state: "[FEN \"X:W32,26:B64,62,60,55,46,42,39,37,K30\"]",
              black_count: 9,
              white_count: 2,
              last_player_moved: "LLyi0mw1IuaFX1AZeCYP0NcWdL83",
              resign: "none"
            })
    },

    async resetUserPoints () {
      await usersCollection
            .doc("LLyi0mw1IuaFX1AZeCYP0NcWdL83")
            .update({
              draw_black: 0,
              draw_white: 0,
              wins_black: 0,
              wins_white: 0,
              loss_black: 0,
              loss_white: 0,
              points: 120
            })

      await usersCollection
            .doc("nkR8RnJ4GqSJHCaTY89HLrywpt13")
            .update({
              draw_black: 0,
              draw_white: 0,
              wins_black: 0,
              wins_white: 0,
              loss_black: 0,
              loss_white: 0,
              points: 100
            })
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