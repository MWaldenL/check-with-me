<template>
  <td class="dark" @click="focus" v-if="isDark">
    <div id="checker-black" class="chip black-chip" :style="blackOpacity" v-show="blackVis"></div>
    <div id="checker-white" class="chip white-chip" :style="whiteOpacity" v-show="whiteVis"></div>
  </td>
  <td class="light" v-else></td>
</template>

<script>
export default {
  props: ['row', 'col'],
  data () {
    return {
      blackOpacity: { opacity: '100%' },
      whiteOpacity: { opacity: '100%' }
    }
  },
  computed: {
    isDark () {
      return (this.row % 2 === 0) ? this.col % 2 === 1 : this.col % 2 === 0
    },

    blackVis () {
      return this.row >= 1 && this.row < 4 && this.isDark
    },

    whiteVis () {
      return this.row > 5 && this.row <= 8 && this.isDark
    }
  },
  methods: {
    focus () {
      this.blackOpacity.opacity = this.blackOpacity.opacity === '100%' ? '50%' : '100%'
      this.whiteOpacity.opacity = this.whiteOpacity.opacity === '100%' ? '50%' : '100%'
    }
  }
}
</script>

<style scoped>
.dark {
  background-color: #779556;
  height: 100px;
  width: 100px;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.light {
  background-color: #ebecd0;
  height: 100px;
  width: 100px;
  margin: 0;
  padding: 0;
}

.chip {
  border-radius: 50%;
  width: 75px;
  height: 75px;
  box-sizing: border-box;
  opacity: 100%;
}

.black-chip {
  background: radial-gradient(50% 50% at 50% 50%, rgba(48, 48, 48, 0.74) 0%, #424242 100%);
  border: 12px solid #3A3A3A;
}

.white-chip {
  background: radial-gradient(50% 50% at 50% 50%, #FFFFFF 28.12%, #dacece 100%, #FFFFFF 100%);
  border: 12px solid #EDEDED;
}
</style>
