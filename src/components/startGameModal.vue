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
export default {
  name: 'StartGameModal',
  computed: {
    ...mapGetters({
      enemyUsername: "getEnemyUsername"
    })
  },
  methods: {
    ...mapActions([
      "aResetGame"
    ]),
    handleStart() {
      // handle state reset for non-host player
      this.aResetGame()
      this.$bvModal.hide('start-game-modal')
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