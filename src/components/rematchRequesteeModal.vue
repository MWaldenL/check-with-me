<template>
<b-modal hide-footer hide-header no-close-on-backdrop no-close-on-esc centered no-stacking size="sm" id="rematch-requestee-modal">
  <template #default="{  }">
    <div id="modal-body">
      <h4 class="modal-head" id="modal-header">Rematch Requested!</h4> <br>
      <h5 class="modal-head" id="modal-subheader">
        {{ enemyUsername }} is requesting a rematch. <br>
        Do you want to accept?
      </h5>
      <br>
      <br>

      <b-button class="mr-2 w-25" variant="success" @click="handleAccept">Yes</b-button>
      <b-button class="ml-2 w-25" variant="danger" @click="handleReject">No</b-button>
    </div>
  </template>
</b-modal>  
</template>

<script>
import { mapGetters } from 'vuex'
import { 
  auth,
  gamesCollection,
  timersCollection
} from '@/firebase'
export default {
  name: 'RematchRequesteeModal',
  computed: {
    ...mapGetters({
      currentGame: 'getCurrentGame',
      hostUserID: 'getHostUser',
      isHostWhite: 'getIsHostWhite',
      enemyUsername: 'getEnemyUsername',
    }),

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
    async handleAccept () {
      await gamesCollection
          .doc(this.currentGame)
          .update({
            rematch_accepted: true
          })
    },

    async handleReject () {
      await gamesCollection
          .doc(this.currentGame)
          .update({
            enemy_left: auth.currentUser.uid
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