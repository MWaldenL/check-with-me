<template>
<b-modal hide-footer hide-header no-close-on-backdrop no-close-on-esc centered no-stacking id="wait-for-time-modal">
  <template #default="{ }">
    <div id="modal-body">
      <h4 class="modal-head" id="modal-header">Rematch Accepted!</h4> <br>
      <h5 class="modal-head" id="modal-subheader">
        Waiting for the host, {{ enemyUsername }}, to select the new time contol. <br>
      </h5>
      <b-icon icon="circle-fill" animation="throb" font-scale="4" class="mt-5" id="waiting"></b-icon>
    </div>
  </template>
</b-modal>  
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'WaitForTimeModal',
  computed: {
    ...mapGetters({
      enemyUsername: 'getEnemyUsername',
    })
  },
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

@keyframes color {
  0% { color: #779556 }
  33% { color: #569585 }
  67% { color: #955656 }
  100% { color: #779556 }
}

#waiting {
  animation: color 2s ease-in-out infinite
}
</style>