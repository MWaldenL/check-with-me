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
import { auth } from '@/firebase'
export default {
  name: 'StartGameModal',
  computed: {
    ...mapGetters({
      enemyUsername: "getEnemyUsername",
      hostUserID: 'getHostUser',
      isHostWhite: 'getIsHostWhite',
    }),

    selfColor() {
      return (auth.currentUser.uid === this.hostUserID) ?
        (this.isHostWhite ? 'w' : 'b') : 
        (this.isHostWhite ? 'b' : 'w')
    },
  },
  methods: {
    ...mapActions([
      "aResetGame",
      "aUpdateBoard"
    ]),

    handleStart() {
      // handle state reset for non-host player
      this.aResetGame()
      this.$bvModal.hide('start-game-modal')

      let PDN = "[FEN \"O:W1,3,5,7,10,12,14,16,17,19,21,23:B42,44,46,48,49,51,53,55,58,60,62,64\"]"
      let isSelfBlack = this.selfColor === 'b'

      this.aUpdateBoard({ PDN, isSelfBlack })
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