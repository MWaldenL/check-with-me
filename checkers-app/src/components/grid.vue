<template>
  <div id="table">
    <table>
      <tr>
        <CellDark blackVis />
        <CellLight />
        <CellDark blackVis />
        <CellLight />
        <CellDark blackVis />
        <CellLight />
        <CellDark blackVis />
        <CellLight />
      </tr>
      <tr>
        <CellLight />
        <CellDark blackVis />
        <CellLight />
        <CellDark blackVis />
        <CellLight />
        <CellDark blackVis />
        <CellLight />
        <CellDark blackVis />
      </tr>
      <tr>
        <CellDark blackVis />
        <CellLight />
        <CellDark blackVis />
        <CellLight />
        <CellDark blackVis />
        <CellLight />
        <CellDark blackVis />
        <CellLight />
      </tr>
      <tr>
        <CellLight />
        <CellDark />
        <CellLight />
        <CellDark />
        <CellLight />
        <CellDark />
        <CellLight />
        <CellDark />
      </tr>
      <tr>
        <CellDark />
        <CellLight />
        <CellDark />
        <CellLight />
        <CellDark />
        <CellLight />
        <CellDark />
        <CellLight />
      </tr>
      <tr>
        <CellLight />
        <CellDark whiteVis />
        <CellLight />
        <CellDark whiteVis />
        <CellLight />
        <CellDark whiteVis />
        <CellLight />
        <CellDark whiteVis />
      </tr>
      <tr>
        <CellDark whiteVis />
        <CellLight />
        <CellDark whiteVis />
        <CellLight />
        <CellDark whiteVis />
        <CellLight />
        <CellDark whiteVis />
        <CellLight />
      </tr>
      <tr>
        <CellLight />
        <CellDark whiteVis />
        <CellLight />
        <CellDark whiteVis />
        <CellLight />
        <CellDark whiteVis />
        <CellLight />
        <CellDark whiteVis />
      </tr>
    </table>
  </div>
</template>

<script>
import CellLight from './cell-light.vue'
import CellDark from './cell-dark.vue'

export default {
  name: 'Grid',
  components: {
    CellLight,
    CellDark
  },
  props: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
div#table {
  display: flex;;
  align-items: center;
  justify-content: center;
}
table {
  margin: 0;
  padding: 0;
}
</style>
