<template>
<b-modal hide-footer hide-header no-close-on-backdrop no-close-on-esc centered size="sm" id="resign-modal">
  <template #default="{ close }">
    <div id="resign-body">
      <h4 class="modal-head" id="modal-header">Resign?</h4> <br>
      <h5 class="modal-head" id="modal-subheader">
        Resigning will make you lose. <br>
        Are you sure you want to leave the game?
      </h5>
      <br>
      <br>

      <b-button block variant="success" @click="close">No. I want to win!</b-button>
      <b-button block variant="danger" @click="handleResignConfirm">Yes. I'm good with losing.</b-button>
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
  name: 'ResultModal',
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
    async handleResignConfirm () {
      const gameDoc = await gamesCollection.doc(this.currentGame).get()
      const bResignActive = gameDoc.data().resign !== "none"

      console.log(`${this.selfColor} resigns`)

      if (bResignActive) {
        this.$bvModal.hide('resign-modal')
      } else {
        await gamesCollection
          .doc(this.currentGame)
          .update({
            resign: this.selfColor
          })
        this.$bvModal.hide('resign-modal')
      }
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