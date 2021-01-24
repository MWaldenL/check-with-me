<template>
<b-modal hide-footer hide-header no-close-on-backdrop no-close-on-esc centered size="sm" id="draw-modal">
  <template #default="{ close }">
    <div id="draw-body">
      <h4 class="modal-head" id="modal-header">Draw?</h4> <br>
      <h5 class="modal-head" id="modal-subheader">
        Your opponent has offered you a draw!<br>
        Do you accept the draw?
      </h5>
      <br>
      <br>
      <b-button block variant="success" @click="handleDrawReject">No. I want to win!</b-button>
      <b-button block variant="danger" @click="handleDrawConfirm">Yes. Let's end in a draw.</b-button>
    </div>
  </template>
</b-modal>  
</template>

<script>
import { mapGetters } from 'vuex'
import { 
  auth,
  gamesCollection
} from '@/firebase'

export default {
  name: 'DrawModal',
  computed: {
    ...mapGetters({
      currentGame: 'getCurrentGame',
      hostUserID: 'getHostUser',
      isHostWhite: 'getIsHostWhite'
    }),

    selfColor() {
      return (auth.currentUser.uid === this.hostUserID) ?
        (this.isHostWhite ? 'w' : 'b') : 
        (this.isHostWhite ? 'b' : 'w')
    },

  },
  methods: {
    async handleDrawConfirm() {
      console.log(`draw`)

      this.aSetWinner('D')
      this.aSetActiveGame(false)

      this.$emit('acceptDraw')
      await gamesCollection
        .doc(this.currentGame)
        .update({ resign: this.selfColor })

      this.$bvModal.hide('resign-modal')
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@700&family=Roboto&display=swap');

#resign-body {
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