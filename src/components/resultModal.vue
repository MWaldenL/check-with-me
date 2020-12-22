<template>
  <b-modal v-model="this.inactiveGame" ref="modal" id="modal" centered hide-footer no-close-on-backdrop no-close-on-esc hide-header>
    <h1 id="modal-body"> {{ winnerMessage }} </h1>
    <b-button block variant="success" @click="restartGame()">Restart</b-button>
    <b-button block variant="danger" @click="exitModal()">Exit</b-button>
  </b-modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ResultModal',
  computed: {
    ...mapGetters({
      inactiveGame: 'getInactiveGame',
      activeGame: 'getActiveGame',
      winner: 'getWinner'
    }), 

    winnerMessage () {
      if (this.winner === 'D')
        return 'DRAW'
      else if (this.winner === 'W')
        return 'WHITE WINS'
      else if (this.winner === 'B')
        return 'BLACK WINS'
    },
  },
  methods: {
    ...mapActions(['aSetActiveGame', 'aResetGame']),
    restartGame () {
      this.aResetGame()
    },
    exitModal () {
      this.$refs['modal'].hide()
    }
  }
}
</script>

<style scoped>
  #modal-body {
    text-align: center;
    padding: 10px 0;
  }
</style>