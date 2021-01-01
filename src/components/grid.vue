<template>
  <div id="box">
    <Sidebar />
    <div id="p1-details" class="details">
      <h1> 
        {{ enemyName }} 
        <keep-alive>
          <span class="time text-white" id="enemyTime">
            {{ enemySeconds | minutes | formattedTime }}:{{ enemySeconds | seconds | formattedTime }}
          </span>
        </keep-alive>
      </h1> 
      <h1 id="p1-count" class="pt-3"> Pieces left: {{ blackCount }} </h1>
    </div>

    <div id="table">
      <table>
        <tr v-for="row in 8" :key="row">
          <Cell 
            v-for="col in 8" 
            :row="9 - row" 
            :col="col" 
            :canMakeMove="canMakeMove"
            :selfColor="selfColor"
            :key="col" 
            @makeMove="updateLastPlayerMoved"/>
        </tr>
      </table>
    </div>
    
    <div id="p2-details" class="details">
      <h1 id="p2-count" class="pb-4"> Pieces left: {{ whiteCount }} </h1>
      <h1>
        <keep-alive>
          <span class="time text-white" id="selfTime">
            {{ selfSeconds | minutes | formattedTime }}:{{ selfSeconds | seconds | formattedTime }}
          </span>
        </keep-alive>
        {{ selfName }}
      </h1>
    </div>
    <!-- <b-button id="resign" class="btn-danger">Resign</b-button> -->
  </div>
</template>

<script>
import { 
  auth, 
  gamesCollection, 
  usersCollection, 
} from '@/firebase'
import Cell from './cell'
import Sidebar from './sidebar'
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'

export default {
  name: 'Grid',
  components: {
    Cell,
    Sidebar
  },
  
  async created() {
    await axios.get('http://localhost:5000/startTime/host')
    this.currentGame = gamesCollection.doc('Vc0H4f4EvY6drRKnvsk5')
  },

  data () {
    return {
      strP1Name: 'MikaReyes',
      strP2Name: 'Sinigang',
      currentGame: null,
      bHostRunning: true,
      bOtherRunning: false,
    }
  },
  computed: {
    ...mapGetters({
      whiteCount: 'getWhiteCount',
      blackCount: 'getBlackCount',

      currentUser: 'getCurrentUser',
      hostUserID: 'getHostUser',
      otherUserID: 'getOtherUser',

      isHostWhite: 'getIsHostWhite',
      hostTimeLeft: 'getHostTimeLeft',
      otherTimeLeft: 'getOtherTimeLeft',
      lastPlayerMoved: 'getLastPlayerMoved'
    }),

    canMakeMove() {
      console.log(this.lastPlayerMoved)
      console.log(auth.currentUser.uid)
      return this.lastPlayerMoved !== auth.currentUser.uid
    },

    selfSeconds() {
      console.log(auth.currentUser.uid)
      console.log(this.hostTimeLeft + " | " + this.otherTimeLeft)

      return (auth.currentUser.uid === this.hostUserID) ?
        this.hostTimeLeft :
        this.otherTimeLeft
    },

    enemySeconds() {
      console.log(this.hostTimeLeft + " | " + this.otherTimeLeft)
      return (auth.currentUser.uid === this.hostUserID) ?
        this.otherTimeLeft :
        this.hostTimeLeft
    },

    selfColor() {
      return (auth.currentUser.uid === this.hostUserID) ?
        ((this.isHostWhite) ? 'w' : 'b') : 
        ((this.isHostWhite) ? 'b' : 'w')
    }
  },

  filters: {
    minutes(timeInSecs) {
      return Math.floor(timeInSecs / 60)
    },

    seconds(timeInSecs) {
      return timeInSecs % 60
    },

    formattedTime(time) {
      return (time >= 10) ? time.toString(10) : `0${time}`
    }
  },  

  asyncComputed: {
    async enemyName() {
      const uid = auth.currentUser.uid === this.hostUserID ? 
        this.otherUserID : 
        this.hostUserID

      const userDoc = await usersCollection.doc(uid).get()
      const username = userDoc.data().username
      return username
    },

    async selfName() {
      const user = await this.currentUser.data
      return user.username
    },
  },

  methods: {
    ...mapActions([
      'aSetLastPlayerMoved',
      'aSetHostTimeLeft',
      'aSetOtherTimeLeft'
    ]),

    async updateLastPlayerMoved(square) {
      const isMoveWhite = square.bHasWhiteChip || square.bHasWhiteKing 
      const lastPlayerMoved = (this.isHostWhite ^ isMoveWhite) ? this.otherUserID : this.hostUserID

      // Write last player moved to db 
      this.currentGame.update({ last_player_moved: lastPlayerMoved })

      // Stop last player's clock
      axios.get('http://localhost:5000/stopTime')
      
      // Start the other player's clock
      const player = lastPlayerMoved === this.hostUserID ? 'other' : 'host'
      axios.get(`http://localhost:5000/startTime/${player}`)
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
#enemyTime {
  margin-left: 100px;
  padding: 10px 30px;
  background-color: #424242;
}
#selfTime {
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
