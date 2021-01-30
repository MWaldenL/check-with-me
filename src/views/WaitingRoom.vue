<template>
  <div id = 'waiting-room-page'>
    <Sidebar />
    <b-modal id="time-modal" @ok="updateTimer" ok-only hide-header>
      <div id='modal-label'>Change Game Timer</div>
      <div class="modal-body time-container">
          <slot name="body">
            <div v-bind:class="{'box-active': timeInput === 10*60, 'box-inactive': timeInput !== 10*60}" @click="putTime(10*60)">10 min</div>
            <div v-bind:class="{'box-active': timeInput === 5*60, 'box-inactive': timeInput !== 5*60}" @click="putTime(5*60)">5 min</div>
            <div v-bind:class="{'box-active': timeInput === 3*60, 'box-inactive': timeInput !== 3*60}" @click="putTime(3*60)">3 min</div>
            <div v-bind:class="{'box-active': timeInput === 1*60, 'box-inactive': timeInput !== 1*60}" @click="putTime(1*60)">1 min</div>
          </slot>
        </div>
    </b-modal>

    <b-modal v-model="isKicked" id="kick-modal" @ok="kickLeave" ok-only hide-header no-close-on-esc no-close-on-backdrop>
      <div>The room has been closed by the owner. Returning to lobby...</div>
    </b-modal>

    <b-modal v-model="isBeginning" id="begin-modal" @ok="goToGame" hide-header>
      <div class="text-center">
        <div class="font-weight-bold">
          Select color for Host:
        </div>
        <div class = "begin-modal-row">
          <div class = "begin-modal-column" @click="hostColor = 'w'">
            <div class = "square">
              <div id="pickWhite" class="chip white-chip">
              </div>
            </div>
            <div v-bind:class="{'box-active': hostColor === 'w', 'box-inactive': hostColor !== 'w'}">
              White
            </div>
          </div>
          <div class = "begin-modal-column" @click="hostColor = 'b'">
            <div class = "square">
              <div id="pickBlack" class="chip black-chip">
              </div>
            </div>
            <div v-bind:class="{'box-active': hostColor === 'b', 'box-inactive': hostColor !== 'b'}">
              Black
            </div>
          </div>
          <div class = "begin-modal-column" @click="hostColor = 'r'">
            <div class = "square">
              <div id="pickRand" class="chip rand-chip">
                <img class="questionMark" src="../../public/assets/question.png"/>
              </div>
            </div>
            <div v-bind:class="{'box-active': hostColor === 'r', 'box-inactive': hostColor !== 'r'}">
            Random
            </div>
          </div>
        </div>
      </div>
    </b-modal>

    <div id = 'waiting-room-proper'>
      <div id="waiting-room-label">Waiting Room</div>
      <div id="room-type">{{room.is_public ? "Public" : "Private"}}</div>
      <div class="row">
        <div id="left-panel" class="column">
          <div id="room-info" class="topper">
            <div>Name: {{ room.room_name }}</div>
            <div>id: {{ $route.params.id }}</div>
          </div>

          <div id="owner-data" class="user-data">
            <div class="owner-label">Room Owner</div>
            <div class="username">{{ host.username }}</div>
            <div class="stats">total wins: {{ host.wins_black + host.wins_white }}</div>
            <div class="stats">winrate: {{ getHostRate }}</div>
            <div class="stats">points: {{ getHostPoints }}</div>
          </div>

          <div id="left-button" v-show="isOwner === 1">
            <button :to="`/`" tag="button" class="red close-button" @click="destroyRoom">
              Close Room
            </button>
          </div>
        </div>
        
        <div id="right-panel" class="column">
          <div id="util-buttons" class="topper">
            <button id="link-button" class="orange" v-show="!room.is_public && isOwner === 1" ref="linker" @click="copyLink">copy invite link</button>
            <button id="set-time-button" v-b-modal.time-modal :disabled="isOwner === 0" class="orange">{{ getTimeMins }} mins</button>
          </div>

          <div v-if="isFull" id="guest-data" class="user-data">
            <div class="owner-label">Guest</div>
            <div class="username">{{ guest.username }}</div>
            <div class="stats">total wins: {{ guest.wins_black + guest.wins_white }}</div>
            <div class="stats">winrate: {{ getGuestRate }}</div>
            <div class="stats">points: {{ getGuestPoints }}</div>
          </div>
          <div v-if="!isFull" id="guest-waiting">
            <div class="waiting">Waiting</div>
          </div>

          <div v-show="isOwner === 1">
            <button :to="`/play`" :disabled="!isFull" 
                    v-bind:class="{'begin-button': isFull, 'begin-disabled': !isFull}"
                    v-on:click="isBeginning = true">
              Begin
            </button>
          </div>
        </div>
      </div>
      
      <div id="left-button" v-show="isOwner === 0">
        <button class="red" @click="leaveRoom">
          Leave Room
        </button>
      </div>
      <div v-show="!room.is_public" id="invite-footer">Invite your friend: {{ roomLink }}</div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import { gamesCollection, timersCollection } from '@/firebase'
import Sidebar from '@/components/sidebar.vue'
import { getSingleGame, deleteGame, removeGuest, setWhitePlayer, setGameStarted } from '@/resources/gameModel.js'
import { getSingleUser } from '@/resources/userModel.js'
import { getSingleTimer, changeTime } from '@/resources/timerModel.js'
import { mapActions } from 'vuex'

export default {
  name: "WaitingRoom",
  components: {
    Sidebar
  },

  data() {
    return {
      roomID: "nil",
      roomLink: "",
      room: {
        is_public: true,
      },
      host: {
        wins_black: 0,
        wins_white: 0,
        points: 0
      },
      guest: null,
      timer: {
        host_timeLeft: 0,
        other_timeLeft: 0,
        game_id: "",
        last_player_moved: ""
      },
      isOwner: -1,
      timeInput: 0,
      gameUnsubscribe: null,
      timeUnsubscribe: null,
      isKicked: false,
      isBeginning: false,
      hostColor: "w"
    }
  },

  computed: {
    getHostRate() {
      if (this.host !== null) {
        const wins = this.host.wins_black + this.host.wins_white
        const draws = this.host.draw_black + this.host.draw_white
        const losses = this.host.loss_white + this.host.loss_black

        if (draws+losses === 0 && wins === 0) {
          return "no games"
        } else if (draws+losses === 0) {
          return "perfect"
        } else {
          return (wins/(wins + losses)*100).toFixed(2) + "%"
        }
      }
    },

    getGuestRate() {
      if (this.host !== null) {
        const wins = this.guest.wins_black + this.guest.wins_white
        const draws = this.guest.draw_black + this.guest.draw_white
        const losses = this.guest.loss_white + this.guest.loss_black

        if (draws+losses === 0 && wins === 0) {
          return "no games"
        } else if (draws+losses === 0) {
          return "perfect"
        } else {
          return (wins/(wins + losses)*100).toFixed(2) + "%"
        }
      }
    },

    isFull() {
      return this.guest !== null
    },

    getTimeMins() {
      return (this.timeInput / 60).toFixed(0)
    },

    getHostPoints() {
      if(this.host !== null)
        return (this.host.points).toFixed(2)
    },

    getGuestPoints() {
      if(this.guest !== null)
        return (this.guest.points).toFixed(2)
    }
  },

  async created() {
    const roomID = await this.$route.params.id
    this.roomID = roomID
    this.roomLink = "https://check-with-me.web.app/#/room/" + roomID
    const room = await getSingleGame(roomID)
    this.room = room

    const host = await getSingleUser(room.host_user.id)
    this.host = host

    if (firebase.auth().currentUser.uid === room.host_user.id) {
      this.isOwner = 1
    } else {
      this.isOwner = 0
    }

    const timer = await getSingleTimer(room.timer_id.id)
    this.timer = timer
    this.timeInput = timer.host_timeLeft

    if (room.other_user.id !== "nil") {
      const guest = await getSingleUser(room.other_user.id)
      this.guest = guest
    }
  },
  methods: {
    ...mapActions([
      'aInitGame'
    ]),

    async destroyRoom() {
      await deleteGame(this.roomID)
      this.gameUnsubscribe()
      this.timeUnsubscribe()
      this.$router.push({ path: '/'})
    },

    async leaveRoom() {
      await removeGuest(this.roomID)
      this.gameUnsubscribe()
      this.timeUnsubscribe()
      this.$router.push({ path: '/'})
    },

    putTime(time) {
      this.timeInput = time
    },
    async goToGame() {
      let room_id = this.roomID

      let isHostWhite
      if(this.hostColor === 'w')
        isHostWhite = true
      else if(this.hostColor === 'b')
        isHostWhite = false
      else{
        let rand = Math.random() < 0.5
        //console.log(rand)
        isHostWhite = rand
      }

      await setWhitePlayer(room_id, isHostWhite)
      await this.aInitGame(room_id)
      await setGameStarted(room_id, true)
      this.$router.push({ path: `/play/${ room_id }`})
    },

    copyLink() {
      const el = document.createElement('textarea');
      el.value = this.roomLink;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    },

    async updateTimer() {
      changeTime(this.timeInput, this.room.timer_id.id)
    },

    kickLeave() {
      this.gameUnsubscribe()
      this.timeUnsubscribe()
      this.$router.push({ path: '/'})
    }
  },

  async mounted() {
    const roomID = await this.$route.params.id
    const game = await getSingleGame(roomID)
    const timerID = game.timer_id.id

    this.gameUnsubscribe = gamesCollection
      .doc(roomID)
      .onSnapshot(async doc => {
        if (doc.exists) {
          const gameStartedFirstTime = 
            this.isOwner === 0 && 
            doc.data().game_started && 
            doc.data().is_first_run

          if (this.isOwner == 0 && doc.data().other_user.id === "nil"){
            this.$router.push({ path: '/'})
          } else if (gameStartedFirstTime) { // Route to the game proper when the other player has started 
            await this.aInitGame(roomID)
            this.$router.push({ path: `/play/${ roomID }`})
            this.gameUnsubscribe()  // Prevent rerouting to the same path every time
          } else {
            const guest = await getSingleUser(doc.data().other_user.id)
            this.guest = guest
          }
        } else {
          if (this.isOwner == 0) {
            this.isKicked = true
          } else {
            console.log('doc no exist')
            // this.$router.push({ path: '/'})
          }
        }
      })

    this.timeUnsubscribe = timersCollection
      .doc(timerID)
      .onSnapshot(async doc => {
        if (doc.exists) {
          this.timeInput = doc.data().host_timeLeft
        }
      })
  }
}
</script>

<style scoped>
  #waiting-room-label {
    font-family: 'Jura', monospace;
    font-size: 3em;
    color: #BCFC8A;
    padding-top: 10px;
    font-weight: 600;
  }
  #room-type {
    font-family: 'Jura', monospace;
    font-size: 1.5em;
    color: #BCFC8A;
    padding-top: 10px;
    font-weight: 600;
  }
  .row {
    font-family: 'Raleway', Arial, Helvetica, sans-serif;
    display: flex;
    width: 100%;
  }
  .column {
    flex: 50%;
  }

  #util-buttons {
    margin-left: 12%;
    height: 80px;
    width: 100%;
    display: flex;
    place-items: center;
  }
  #room-info {
    text-align: left;
    margin-left: 13%;
    color: #FFF;
    font-size: 1.5em;
    font-weight: bold;

    height: 80px;
    width: 86%;
  }

  .user-data {
    background: #C4C4C4;
    height: 50vh;
    margin: 0px 12% 0px 12%;
    font-weight: bold;
    text-align: left;
    margin-bottom: 5%;
  }
  #guest-waiting {
    background: #C4C4C4;
    height: 50vh;
    margin: 0px 12% 0px 12%;
    font-weight: bold;
    margin-bottom: 5%;
    display: flex;
    place-items: center;
    justify-content: center;
    color: #585858;
    font-size: 2.5em;
  }
  .owner-label {
    color: #585858;
    font-size: 1.3em;
    margin-left: 10%;
    padding-top: 5%;
    color: #585858;
  }
  .username {
    color: #000;
    font-size: 2.7em;
    margin-left: 10%;
  }
  .stats {
    color: #585858;
    font-size: 2em;
    margin-left: 10%;
  }

  .close-button {
    float: right;
    margin-right: 12%;
  }
  .begin-button {
    float: left;
    margin-left: 12%;
    background-color: #779556;
    color: #FFF;
    border: 0px solid #779556;
    border-radius: 5px;
    height: 30px;
    width: 20%;
    font-weight: bold;
    min-width: 110px;
  }
  .begin-disabled {
    float: left;
    margin-left: 12%;
    background-color: #5e7545;
    color: rgb(204, 204, 204);
    border: 0px solid #5e7545;
    border-radius: 5px;
    height: 30px;
    width: 20%;
    font-weight: bold;
    min-width: 110px;
  }
  .orange {
    background-color: #E6912C;
    color: #FFF;
    border: 0px solid #E6912C;
    height: 50%;
    font-weight: bold;
  }
  #link-button {
    width: 47%;
    margin-right: 3%;
  }
  #set-time-button {
    width: 26%;
  }
  .red {
    background-color: #FF4949;
    color: #FFF;
    border: 0px solid #FF4949;
    border-radius: 5px;
    height: 30px;
    width: 20%;
    font-weight: bold;
    min-width: 110px;
  }

  #invite-footer {
    margin-top: 40px;
    color: rgb(173, 173, 173);
    font-family: 'Raleway', Arial, Helvetica, sans-serif;
    font-size: 1.2em;
  }

  #modal-label {
    color: #585858;
    font-size: 1.5em;
    text-align: center;
  }
  .time-container{
  margin: 0px 0px 15px 0px;
  width:100%;
  height:50%;
  background-color:#fff;
  display:grid;
  grid-template-columns: 46% 46%;
  grid-row: auto auto;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
}
.box-active{
    background-color:#E6912C;
    padding:8px;
    border-radius:0px;
    color:#fff;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:1em;
    font-weight: bold;
}
.box-inactive{
    background-color:#b37f40;
    padding:8px;
    border-radius:0px;
    color:rgb(214, 208, 208);
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:1em;
    font-weight: bold;
}

.begin-modal-row{
  display: flex;
  place-items: center;
  justify-content: center;
  display: flex;
  place-items: center;
  justify-content: center;
  flex-direction: row;
}
.begin-modal-column{
  display: flex;
  place-items: center;
  justify-content: center;
  display: flex;
  place-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 20px;
  text-align: center;
}
.square {
  height: 80px;
  width: 80px;
  margin: 0;
  padding: 0;
  margin-bottom: 10px;
}
.chip {
  z-index: 2;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  opacity: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}
.black-chip {
  background: radial-gradient(50% 50% at 50% 50%, rgba(48, 48, 48, 0.74) 0%, #424242 100%);
  border: 10px solid #3A3A3A;
}
.white-chip {
  background: radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.74) 0%, #D0D0D0 100%);
  border: 12px solid #EDEDED;
}
.rand-chip {
  background: radial-gradient(50% 50% at 50% 50%, #979797 0%, #979797 100%);
  border: 12px solid #979797;
}
.questionMark {
  height: 100%;
  width: 100%;
}
</style>