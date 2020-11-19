<template>
  <div id="table">
    <table>
      <tr v-for="row in 8" :key="row">
        <Cell v-for="col in 8" :row="row" :col="col" :key="col" />
      </tr>
    </table>
  </div>
</template>

<script>
import Cell from './cell'

export default {
  name: 'Grid',
  components: {
    Cell
  }
}
</script>

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
