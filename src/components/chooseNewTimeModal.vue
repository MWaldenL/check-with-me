<template>
<b-modal hide-footer hide-header no-close-on-backdrop no-close-on-esc centered no-stacking id="choose-new-time-modal">
  <template #default="{  }">
    <div id="modal-body">
      <h4 class="modal-head" id="modal-header">Rematch Accepted!</h4> <br>
      <h5 class="modal-head" id="modal-subheader">
        A rematch has been initiated with {{ enemyUsername }}. <br>
        Please choose the new time control setting.
      </h5>

      <b-button class="mr-2 mt-5 mb-2 w-25" :pressed.sync="toggle10" variant="success" @click="handleTimeToggle10">10 minutes</b-button>
      <b-button class="ml-2 mt-5 mb-2 w-25" :pressed.sync="toggle5" variant="success" @click="handleTimeToggle5">5 minutes</b-button> <br>
      <b-button class="mr-2 mt-2 w-25" :pressed.sync="toggle3" variant="success" @click="handleTimeToggle3">3 minutes</b-button>
      <b-button class="ml-2 mt-2 w-25" :pressed.sync="toggle1" variant="success" @click="handleTimeToggle1">1 minute</b-button>

      <b-button block class="mt-5" :disabled="isTimeSelected" variant="success" @click="handleStartRematchWhite">Start Rematch as White</b-button>
      <b-button block class="mt-2" :disabled="isTimeSelected" variant="success" @click="handleStartRematchBlack">Start Rematch as Black</b-button>
      <b-button block class="mt-2" :disabled="isTimeSelected" variant="success" @click="handleStartRematchRandom">Start Rematch with Random Color</b-button>
    </div>
  </template>
</b-modal>  
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { 
  auth,
  gamesCollection,
  timersCollection
} from '@/firebase'
export default {
  name: 'ChooseNewTimeModal',

  data() {
    return {
      toggle1: false,
      toggle3: false,
      toggle5: false,
      toggle10: false,
    }
  },

  computed: {
    ...mapGetters({
      currentGame: 'getCurrentGame',
      currentTimer: 'getCurrentTimer',
      hostUserID: 'getHostUser',
      otherUserID: 'getOtherUser',
      isHostWhite: 'getIsHostWhite',
      enemyUsername: 'getEnemyUsername',
    }),

    isTimeSelected() {
      return !(this.toggle1 || this.toggle3 || this.toggle5 || this.toggle10)
    },

    selfColor() {
      return (auth.currentUser.uid === this.hostUserID) ?
        (this.isHostWhite ? 'w' : 'b') : 
        (this.isHostWhite ? 'b' : 'w')
    },

    isSelfHost() {
      return auth.currentUser.uid === this.hostUserID
    },
  },

  methods: {
    ...mapActions([
      "aResetGame",
      "aSetHostIsWhite",
      "aSetHostTimeLeft",
      "aSetOtherTimeLeft"
    ]),
    handleTimeToggle10() {
      this.toggle1 = this.toggle3 = this.toggle5 = false
    },
    handleTimeToggle5() {
      this.toggle1 = this.toggle3 = this.toggle10 = false
    },
    handleTimeToggle3() {
      this.toggle1 = this.toggle5 = this.toggle10 = false
    },
    handleTimeToggle1() {
      this.toggle3 = this.toggle5 = this.toggle10 = false
    },

    async handleStartRematchWhite() {
      // handle state reset for host player, handle db reset
      this.aResetGame()
      this.aSetHostIsWhite(true)
      this.aSetHostTimeLeft()
      this.aSetOtherTimeLeft()
      this.$bvModal.hide('choose-new-time-modal')
      
      let time

      if (this.toggle1)        { time = 60 } 
      else if (this.toggle3)   { time = 180 }
      else if (this.toggle5)   { time = 300 }
      else if (this.toggle10)  { time = 600 }

      this.toggle1 = this.toggle3 = this.toggle5 = this.toggle10 = false

      await gamesCollection
            .doc(this.currentGame)
            .update({
              board_state: "[FEN \"O:W1,3,5,7,10,12,14,16,17,19,21,23:B42,44,46,48,49,51,53,55,58,60,62,64\"]",
              black_count: 12,
              white_count: 12,
              last_player_moved: this.otherUserID,
              resign: "none",
              is_host_white: true,
              rematch_accepted: false,
              rematch_requested: "none",
              rematch_time_selected: true
            })
      
      await timersCollection
            .doc(this.currentTimer)
            .update({
              host_timeLeft: time,
              other_timeLeft: time,
              last_player_moved: this.otherUserID
            })
    },

    async handleStartRematchBlack() {
      // handle state reset for host player, handle db reset
      this.aResetGame()
      this.aSetHostIsWhite(false)
      this.aSetHostTimeLeft()
      this.aSetOtherTimeLeft()
      this.$bvModal.hide('choose-new-time-modal')
      
      let time

      if (this.toggle1)        { time = 60 } 
      else if (this.toggle3)   { time = 180 }
      else if (this.toggle5)   { time = 300 }
      else if (this.toggle10)  { time = 600 }

      this.toggle1 = this.toggle3 = this.toggle5 = this.toggle10 = false

      await gamesCollection
            .doc(this.currentGame)
            .update({
              board_state: "[FEN \"O:W1,3,5,7,10,12,14,16,17,19,21,23:B42,44,46,48,49,51,53,55,58,60,62,64\"]",
              black_count: 12,
              white_count: 12,
              last_player_moved: this.hostUserID,
              resign: "none",
              is_host_white: false,
              rematch_accepted: false,
              rematch_requested: "none",
              rematch_time_selected: true
            })
      
      await timersCollection
            .doc(this.currentTimer)
            .update({
              host_timeLeft: time,
              other_timeLeft: time,
              last_player_moved: this.hostUserID
            })
    },

    async handleStartRematchRandom() {
      // handle state reset for host player, handle db reset
      let color = Math.floor((Math.random() * 100) + 1) % 2 === 0
      let last = color ? this.otherUserID : this.hostUserID

      this.aResetGame()
      this.aSetHostIsWhite(color)
      this.aSetHostTimeLeft()
      this.aSetOtherTimeLeft()
      this.$bvModal.hide('choose-new-time-modal')
      
      let time

      if (this.toggle1)        { time = 60 } 
      else if (this.toggle3)   { time = 180 }
      else if (this.toggle5)   { time = 300 }
      else if (this.toggle10)  { time = 600 }

      this.toggle1 = this.toggle3 = this.toggle5 = this.toggle10 = false

      await gamesCollection
            .doc(this.currentGame)
            .update({
              board_state: "[FEN \"O:W1,3,5,7,10,12,14,16,17,19,21,23:B42,44,46,48,49,51,53,55,58,60,62,64\"]",
              black_count: 12,
              white_count: 12,
              last_player_moved: last,
              resign: "none",
              is_host_white: color,
              rematch_accepted: false,
              rematch_requested: "none",
              rematch_time_selected: true
            })
      
      await timersCollection
            .doc(this.currentTimer)
            .update({
              host_timeLeft: time,
              other_timeLeft: time,
              last_player_moved: last
            })
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@700&family=Roboto&display=swap');

#modal-body {
  text-align: center;
  padding: 20px
}

.modal-head {
  font-family: 'Raleway', Arial, Helvetica, sans-serif;
  color: #000000;
}

#modal-header {
  font-weight: 700;
  font-size: 25px;
}

#modal-subheader {
  font-size: 17px;
}
</style>