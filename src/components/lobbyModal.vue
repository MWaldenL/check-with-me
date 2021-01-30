<template>
<b-modal hide-footer hide-header no-close-on-backdrop no-close-on-esc centered size="sm" id="lobby-modal">
  <template #default="{  }">
    <div id="modal-body">
      <h4 class="modal-head" id="modal-header">Room Closed</h4> <br>
      <h5 class="modal-head" id="modal-subheader">
        Someone left the room. Click the button below to return to the lobby.
      </h5>
      <br>
      <br>

      <b-button block variant="success" @click="backToLobby">Back to Lobby</b-button>
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
  name: 'LobbyModal',
  computed: {
    ...mapGetters({
      currentGame: "getCurrentGame",
      currentTimer: "getTimer"
    }),
  },
  methods: {
    ...mapActions([
      'aClearGameState'
    ]),

    async backToLobby() {
      // delete game document, uncomment for deployment
      await gamesCollection
        .doc(this.currentGame)
        .delete()
        .then(() => {
          console.log("Game " + this.currentGame + " successfully deleted")
        }).catch(error => {
          console.log(error)
        })

      await timersCollection
        .doc(this.currentTimer)
        .delete()
        .then(() => {
          console.log("Timer " + this.currentTimer + " successfully deleted")
        }).catch(error => {
          console.log(error)
        })

      this.aClearGameState()
      this.$router.push("/")
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