<template>
<b-modal hide-footer hide-header no-close-on-backdrop no-close-on-esc centered size="sm" id="confirm-leave-modal">
  <template #default="{  }">
    <div id="modal-body">
      <h4 class="modal-head" id="modal-header">Leaving Already?</h4> <br>
      <h5 class="modal-head" id="modal-subheader">
        This room will be closed. <br>
        Are you sure you want to leave?
      </h5>
      <br>
      <br>

      <b-button class="mr-2 w-25" variant="danger" @click="handleConfirm">Yes</b-button>
      <b-button class="ml-2 w-25" variant="success" @click="handleNo">No</b-button>
    </div>
  </template>
</b-modal>  
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { 
  gamesCollection,
  timersCollection
} from '@/firebase'
export default {
  name: 'ConfirmLeaveModal',
  computed: {
    ...mapGetters({
      currentGame: 'getCurrentGame',
    })
  },
  methods: {
    ...mapActions(['aDeleteGame', 'aDeleteTimer']),

    async handleConfirm () {
      await gamesCollection
        .doc(this.currentGame)
        .update({
          enemy_left_confirmed: true
        })
    },

    async handleNo () {
      await gamesCollection
        .doc(this.currentGame)
        .update({
          enemy_left: "none"
        })
      
      this.$bvModal.hide("confirm-leave-modal")
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