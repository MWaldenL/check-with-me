<template>
<b-modal hide-footer hide-header no-close-on-backdrop no-close-on-esc centered no-stacking size="sm" id="start-game-modal">
  <template #default="{  }">
    <div id="modal-body">
      <h4 class="modal-head" id="modal-header">Rematch Ready!</h4> <br>
      <h5 class="modal-head" id="modal-subheader">
        {{ enemyUsername }} is ready for your rematch!
      </h5>
      <br>
      <br>

      <b-button block variant="success" @click="handleStart">Begin</b-button>
    </div>
  </template>
</b-modal>  
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
import { gamesCollection } from '@/firebase'
export default {
  name: 'StartGameModal',
  data() {
    return {
      SERVER_URL: 'https://us-central1-check-with-me.cloudfunctions.net/clock'
    }
  },

  computed: {
    ...mapGetters({
      enemyUsername: 'getEnemyUsername',
      currentGame: 'getCurrentGame',
      hostTimeLeft: 'getHostTimeLeft'
    })
  },

  methods: {
    ...mapActions([
      "aResetGame",
      "aSetHostIsWhite",
      "aSetHostTimeLeft",
      "aSetOtherTimeLeft",
      "aUpdateBoard"
    ]),

    async handleStart() {
      // handle state reset for non-host player
      let gameDoc = await gamesCollection.doc(this.currentGame).get()
      let isHostWhite = gameDoc.data().is_host_white

      let boardState = "[FEN \"O:W1,3,5,7,10,12,14,16,17,19,21,23:B42,44,46,48,49,51,53,55,58,60,62,64\"]"
      let playerIsBlack = isHostWhite

      this.aResetGame() // Resets the board
      this.aSetHostIsWhite(isHostWhite)
      this.aUpdateBoard({ boardState, playerIsBlack })
      await this.aSetHostTimeLeft()
      await this.aSetOtherTimeLeft()
      await this.resetClocks()
      this.$emit('resetTimers')
      this.$bvModal.hide('start-game-modal')
    },

    async resetClocks() {
      await axios.get(`${this.SERVER_URL}/resetClocks/${this.hostTimeLeft}`)
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