<template>
  <td id="cell" @click="focus" :style="bgStyle">
    <div id="checker-black" :style="blackStyle" v-show="blackVis"></div>
    <div id="checker-white" :style="whiteStyle" v-show="whiteVis"></div>
  </td>
</template>

<script>
export default {
  name: 'CellDark',
  props: {
    blackVis: Boolean,
    whiteVis: Boolean
  },
  data: function () {
    return {
      bgStyle: {
        backgroundColor: '#779556',
        height: '100px',
        width: '100px',
        margin: '0',
        padding: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      blackStyle: {
        borderRadius: '50%',
        width: '75px',
        height: '75px',
        background: 'radial-gradient(50% 50% at 50% 50%, rgba(48, 48, 48, 0.74) 0%, #424242 100%)',
        border: '12px solid #3A3A3A',
        boxSizing: 'border-box',
        opacity: '100%'
      },
      whiteStyle: {
        borderRadius: '50%',
        width: '75px',
        height: '75px',
        background: 'radial-gradient(50% 50% at 50% 50%, #FFFFFF 28.12%, #dacece 100%, #FFFFFF 100%)',
        border: '12px solid #EDEDED',
        boxSizing: 'border-box',
        opacity: '100%'
      }
    }
  },
  methods: {
    focus: function () {
      this.blackStyle.opacity = this.blackStyle.opacity === '100%' ? '50%' : '100%'
      this.whiteStyle.opacity = this.whiteStyle.opacity === '100%' ? '50%' : '100%'
    }
  }
}
</script>

<style scoped>
</style>
