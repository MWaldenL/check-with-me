<template>
  <div id="box">
    <Sidebar />
    <div id="p1-details" class="details">
      <h1> {{ strP1Name }} <span id="p1-time"> {{ printTime(nP1minutes) }}:{{ printTime(nP1seconds) }} </span> </h1> 
      <h1 id="p1-count" class="pt-3"> Pieces left: {{ blackCount }} </h1>
    </div>
    <div id="table">
      <table>
        <tr v-for="row in 8" :key="row">
          <Cell v-for="col in 8" :row="9 - row" :col="col" :key="col" />
        </tr>
      </table>
    </div>
    <div id="p2-details" class="details">
      <h1 id="p2-count" class="pb-4"> Pieces left: {{ whiteCount }} </h1>
      <h1> <span id="p2-time"> {{ printTime(nP2minutes) }}:{{ printTime(nP2seconds) }} </span> {{ strP2Name }}</h1>
    </div>
    <b-button id="resign" class="btn-danger">Resign</b-button>
  </div>
</template>

<script>
import Cell from './cell'
import Sidebar from './sidebar'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Grid',
  components: {
    Cell,
    Sidebar
  },
  data:
    function () {
    return {
      strP1Name: "MikaReyes",
      strP2Name: "Sinigang",
      nP1minutes: 2,
      nP1seconds: 0,
      nP2minutes: 1,
      nP2seconds: 59
    }
  },
  computed: {
    ...mapGetters({
      whiteCount: 'getWhiteCount',
      blackCount: 'getBlackCount',
    })
  },
  methods: {
    printTime: function (time) {
      if (time > 10) {
        return time.toString(10)
      } else if (time > 0) {
        return "0" + time
      } else {
        return "00"
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway&family=Roboto&display=swap');

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
#p1-details {
  text-align: left;
  margin-right: 20px;
  margin-left: 200px;
}
#p2-details {
  text-align: right;
  margin-left: 20px;
  margin-right: 200px;
}
.details {
  color: whitesmoke;
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
}
.details h1 {
  margin: 0;
}
#p1-count,
#p2-count {
  font-family: 'Raleway', Helvetica, Arial, sans-serif;
  font-size: 20px;
}
#p1-time {
  margin-left: 100px;
  padding: 10px 30px;
  background-color: #424242;
}
#p2-time {
  margin-right: 100px;
  padding: 10px 30px;
  background-color: #424242;
}
#resign {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  font-weight: 100;
  font-size: 20px;
  padding: 10px 40px;

  position: absolute;
  right: 300px;
  bottom: 40vh;
}
#box {
  position: relative;
  margin-top: 10px;
}
</style>
