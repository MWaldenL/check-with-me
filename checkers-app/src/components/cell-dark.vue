<template>
  <td id="cell">
    <div id="checker-black" v-show="blackVis"></div>
    <div id="checker-white" v-show="whiteVis"></div>
  </td>
</template>

<script>
export default {
  name: 'CellDark',
  data: () => {
    return {
      blackVis: true
    }
  }
}
</script>

<style scoped>
  #cell {
    background-color: #779556;
    height: 100px;
    width: 100px;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #checker-black {
    border-radius: 50%;
    width: 75px;
    height: 75px;
    background: radial-gradient(50% 50% at 50% 50%, rgba(48, 48, 48, 0.74) 0%, #424242 100%);
    border: 12px solid #3A3A3A;
    box-sizing: border-box;
  }
  #checker-white {
    border-radius: 50%;
    width: 75px;
    height: 75px;
    background: radial-gradient(50% 50% at 50% 50%, #FFFFFF 28.12%, #BFBEBE 100%, #FFFFFF 100%);
    border: 12px solid #EDEDED;
    box-sizing: border-box;
  }
</style>
