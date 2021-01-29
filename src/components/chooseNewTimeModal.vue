<template>
<b-modal hide-footer hide-header no-close-on-backdrop no-close-on-esc centered no-stacking id="choose-new-time-modal">
  <template #default="{  }">
    <div id="modal-body">
      <h4 class="modal-head" id="modal-header">Rematch Accepted!</h4> <br>
      <h5 class="modal-head" id="modal-subheader">
        A rematch has been initiated with {{ enemyUsername }}. <br>
        Please choose the new time control setting.
      </h5>

      <b-button class="mr-2 mt-5 mb-2 w-25" :pressed.sync="toggle10" variant="warning" @click="handleTimeToggle10">10 minutes</b-button>
      <b-button class="ml-2 mt-5 mb-2 w-25" :pressed.sync="toggle5" variant="warning" @click="handleTimeToggle5">5 minutes</b-button> <br>
      <b-button class="mr-2 mt-2 w-25" :pressed.sync="toggle3" variant="warning" @click="handleTimeToggle3">3 minutes</b-button>
      <b-button class="ml-2 mt-2 w-25" :pressed.sync="toggle1" variant="warning" @click="handleTimeToggle1">1 minute</b-button>

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
      currentTimer: 'getTimer',
      hostUserID: 'getHostUser',
      otherUserID: 'getOtherUser',
      isHostWhite: 'getIsHostWhite',
      enemyUsername: 'getEnemyUsername',
    }),

    isTimeSelected() {
      return !(this.toggle1 || this.toggle3 || this.toggle5 || this.toggle10)
    }
  },

  methods: {
    ...mapActions([
      "aResetGame",
      "aSetHostIsWhite",
      "aSetHostTimeLeft",
      "aSetOtherTimeLeft",
      "aUpdateBoard"
    ]),

    // toggle time control options to allow only one choice
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

    /**
     * updates the cloud firestore and the vuex state for the newly selected options for the rematch
     * 
     * @param lastPlayerMoved - user id of the player whose been set as the black player
     * @param isHostWhite - boolean var indicating if the host will play as white
     */
    async updateDBAndState(lastPlayerMoved, isHostWhite) {
      // get time control selected
      let time

      if (this.toggle1)        { time = 60 } 
      else if (this.toggle3)   { time = 180 }
      else if (this.toggle5)   { time = 300 }
      else if (this.toggle10)  { time = 600 }

      // reset time control selection for next rematch
      this.toggle1 = this.toggle3 = this.toggle5 = this.toggle10 = false

      const boardState = "[FEN \"O:W1,3,5,7,10,12,14,16,17,19,21,23:B42,44,46,48,49,51,53,55,58,60,62,64\"]"
      const playerIsBlack = !isHostWhite

      console.log('last player moved ' + lastPlayerMoved)

      // update current game doc with new params
      await gamesCollection
            .doc(this.currentGame)
            .update({
              board_state: boardState,
              black_count: 12,
              white_count: 12,
              last_player_moved: lastPlayerMoved,
              resign: "none",
              is_host_white: isHostWhite,
              rematch_accepted: false,
              rematch_requested: "none",
              rematch_time_selected: true,
              draw: false,
              draw_offered_by: "",
              is_first_run: true
            })
      
      // update current time doc with new params
      await timersCollection
            .doc(this.currentTimer)
            .update({
              host_timeLeft: time,
              other_timeLeft: time,
              last_player_moved: lastPlayerMoved
            })
      
      this.aResetGame()
      this.aSetHostIsWhite(isHostWhite)
      await this.aSetHostTimeLeft()
      await this.aSetOtherTimeLeft()
      this.$emit('resetTimers')

      if (!isHostWhite) {
        this.aUpdateBoard({ boardState, playerIsBlack })
      }

      this.$bvModal.hide('choose-new-time-modal')
    },

    async handleStartRematchWhite() {
      // handle state, db reset with host as white
      await this.updateDBAndState(this.otherUserID, true)
    },
  
    async handleStartRematchBlack() {
      // handle state, db reset with other player as white
      await this.updateDBAndState(this.hostUserID, false)
    },

    async handleStartRematchRandom() {
      // handle state, db reset with host as random color
      // random num even ? host is white : host is black
      let color = Math.floor((Math.random() * 100) + 1) % 2 === 0
      let last = color ? this.otherUserID : this.hostUserID

      await this.updateDBAndState(last, color)
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