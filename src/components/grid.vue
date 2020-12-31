<template>
  <div id="box">
    <Sidebar />
    <div id="p1-details" class="details">
      <h1> 
        {{ strP1Name }} 
        <Timer :secs="nP1Seconds" :isHost="false" :isRunning="bOtherRunning" />
      </h1> 
      <h1 id="p1-count" class="pt-3"> Pieces left: {{ blackCount }} </h1>
    </div>

    <div id="table">
      <table>
        <tr v-for="row in 8" :key="row">
          <Cell v-for="col in 8" :row="9 - row" :col="col" :key="col" @makeMove="updateLastPlayerMoved"/>
        </tr>
      </table>
    </div>
    
    <div id="p2-details" class="details">
      <h1 id="p2-count" class="pb-4"> Pieces left: {{ whiteCount }} </h1>
      <h1> 
        <Timer :secs="nP2Seconds" :isHost="true" :isRunning="bHostRunning" />
        {{ strP2Name }}
      </h1>
    </div>
    <b-button id="resign" class="btn-danger">Resign</b-button>
  </div>
</template>

<script>
import Timer from './timer'
import Cell from './cell'
import Sidebar from './sidebar'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Grid',
  components: {
    Cell,
    Timer,
    Sidebar
  },

  data () {
    return {
      strP1Name: 'MikaReyes',
      strP2Name: 'Sinigang',
      
      bHostRunning: true,
      bOtherRunning: false,

      nP1Seconds: 3,
      nP2Seconds: 76
    }
  },
  computed: {
    ...mapGetters({
      whiteCount: 'getWhiteCount',
      blackCount: 'getBlackCount',
      isHostWhite: 'getIsHostWhite',
      lastPlayerMoved: 'getLastPlayerMoved', 
    })
  },
  methods: {
    ...mapActions([
      'aSetLastPlayerMoved'
    ]),

    updateLastPlayerMoved(source) {
      const isMoveWhite = source.bHasWhiteChip || source.bHasWhiteKing 
      
      if (this.isHostWhite ^ isMoveWhite) {
        this.aSetLastPlayerMoved('other')
      } else {
        this.aSetLastPlayerMoved('host')
      }

      console.log(this.lastPlayerMoved)
      this.updateTimer()
      console.log("Updaeting timer")
      console.log(this.bHostRunning)
      console.log(this.bOtherRunning)
    },

    updateTimer() {
      if (this.lastPlayerMoved === 'host') {
        this.bHostRunning = false
        this.bOtherRunning = true
      } else {
        this.bHostRunning = true
        this.bOtherRunning = false
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
  display: flex;
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
