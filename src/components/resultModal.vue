<template>
  <div id='modal' class='modal-bg' v-bind:class="{'modal-vis':!this.activeGame}">
    <div class='modal'>
      {{ winnerMessage }}
      <input type="button" @click='restartGame()' value="Restart">
      <input type="button" @click='exitModal()' value="Exit">
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ResultModal',
  computed: {
    ...mapGetters({
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
    }
  },
  methods: {
    ...mapActions(['aSetActiveGame', 'aResetGame']),
    restartGame () {
      this.aResetGame()
    },
    exitModal () {
      let element = document.getElementById("modal");
      element.classList.add("modal-reset");
    }
  }
}
</script>

<style scoped>
  .modal-bg {
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    background-color:rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    visibility: hidden;
    opacity: 0
  }

  .modal-vis {
    visibility: visible;
    opacity: 1;
  }

  .modal-reset {
    visibility: hidden;
    opacity: 0
  }

  .modal {
    background-color: white;
    width: 30%;
    height: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
</style>