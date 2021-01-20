<template>
  <div id = 'waiting-room-page'>
    <Sidebar />
    <b-modal id="time-modal"  ok-only hide-header>
      <div id='modal-label'>Change Game Timer</div>
      <div class="modal-body time-container">
          <slot name="body">
            <div v-bind:class="{'box-active': timeInput === 10, 'box-inactive': timeInput !== 10}" @click="putTime(10)">10 min</div>
            <div v-bind:class="{'box-active': timeInput === 5, 'box-inactive': timeInput !== 5}" @click="putTime(5)">5 min</div>
            <div v-bind:class="{'box-active': timeInput === 3, 'box-inactive': timeInput !== 3}" @click="putTime(3)">3 min</div>
            <div v-bind:class="{'box-active': timeInput === 1, 'box-inactive': timeInput !== 1}" @click="putTime(1)">1 min</div>
          </slot>
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
            <div class="stats">points: {{ host.points }}</div>
          </div>

          <div id="left-button" v-show="isOwner === 1">
            <button :to="`/`" tag="button" class="red close-button" @click="destroyRoom">
              Close Room
            </button>
          </div>
        </div>
        
        <div id="right-panel" class="column">
          <div id="util-buttons" class="topper">
            <button class="orange" v-show="!room.is_public">copy invite link</button>
            <button v-b-modal.time-modal :disabled="isOwner === 0" class="orange">{{ timeInput }} mins</button>
          </div>

          <div v-if="isFull" id="guest-data" class="user-data">
            <div class="owner-label">Guest</div>
            <div class="username">{{ guest.username }}</div>
            <div class="stats">total wins: {{ guest.wins_black + guest.wins_white }}</div>
            <div class="stats">winrate: {{ getGuestRate }}</div>
            <div class="stats">points: {{ guest.points }}</div>
          </div>
          <div v-if="!isFull" id="guest-waiting">
            <div class="waiting">Waiting</div>
          </div>

          <div v-show="isOwner === 1">
            <router-link :to="`/play`" tag="button" class="green begin-button" v-on:click.native="setTimer(timer.host_timeLeft/60)">
              Begin
            </router-link>
          </div>
        </div>
      </div>
      
      <div id="left-button" v-show="isOwner === 0">
        <button class="red" @click="leaveRoom">
          Leave Room
        </button>
      </div>
      <div v-show="!room.is_public" id="invite-footer">Invite your friend: {{ room.room_link }}</div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import { db } from '@/firebase'
import Sidebar from '@/components/sidebar.vue'
import { getSingleGame, deleteGame, removeGuest } from '@/resources/gameModel.js'
import { getSingleUser } from '@/resources/userModel.js'
import { getSingleTimer } from '@/resources/timerModel.js'

export default {
  name: "WaitingRoom",
  components: {
    Sidebar
  },
  data() {
    return {
      roomID: "",
      room: {
        is_public: true,
      },
      host: {
        wins_black: 0,
        wins_white: 0
      },
      guest: null,
      timer: {
        host_timeLeft: 0,
        other_timeLeft: 0,
        game_id: "",
        last_player_moved: ""
      },
      isOwner: -1,
      timeInput: 0
    }
  },
  computed: {
    getHostRate: function () {
      if(this.host !== null){
        const wins = this.host.wins_black + this.host.wins_white
        const draws = this.host.draw_black + this.host.draw_white
        const losses = this.host.loss_black + this.host.loss_black

        if(draws+losses === 0 && wins === 0)
          return "no games"
        else if(draws+losses === 0)
          return "perfect"
        else
          return (wins/(wins + draws + losses)*100).toFixed(2) + "%"
      }
    },

    getGuestRate: function () {
      if(this.host !== null){
        const wins = this.guest.wins_black + this.guest.wins_white
        const draws = this.guest.draw_black + this.guest.draw_white
        const losses = this.guest.loss_black + this.guest.loss_black

        if(draws+losses === 0 && wins === 0)
          return "no games"
        else if(draws+losses === 0)
          return "perfect"
        else
          return (wins/(wins + draws + losses)*100).toFixed(2) + "%"
      }
    },

    isFull: function () {
      return this.guest !== null
    }
  },
  async created() {
    const roomID = await this.$route.params.id
    this.roomID = roomID
    const room = await getSingleGame(roomID)
    this.room = room
    console.log(room)

    const host = await getSingleUser(room.host_user.id)
    this.host = host
    console.log(host)
    if(firebase.auth().currentUser.uid === room.host_user.id)
      this.isOwner = 1
    else
      this.isOwner = 0

    const timer = await getSingleTimer(room.timer_id.id)
    this.timer = timer
    this.timeInput = (timer.host_timeLeft/60).toFixed(0)
    console.log(timer)

    if(room.other_user.id !== "nil") {
      const guest = await getSingleUser(room.other_user.id)
      this.guest = guest
      console.log(guest)
    }

    
  },
  methods: {
    async destroyRoom () {
      //console.log(this.roomID)
      await deleteGame(this.roomID)

      this.$router.push({ path: '/'})
    },
    async leaveRoom () {
      await removeGuest(this.roomID)

      this.$router.push({ path: '/'})
    },
    putTime (time) {
      this.timeInput = time
    }
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

  }
  #room-info {
    text-align: left;
    margin-left: 13%;
    color: #FFF;
    font-size: 1.5em;
    font-weight: bold;

    height: 80px;
    width: 20vw;
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
    text-align: center;
    margin-bottom: 5%;
    display: flex;
    place-items: center;
    padding: 25%;
  }
  .waiting {
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
  }
  .orange {
    background-color: #E6912C;
    color: #FFF;
    border: 0px solid #E6912C;
    height: 100%;
    font-weight: bold;
  }
  .red {
    background-color: #FF4949;
    color: #FFF;
    border: 0px solid #FF4949;
    border-radius: 5px;
    height: 30px;
    width: 20%;
    font-weight: bold;
  }
  .green {
    background-color: #779556;
    color: #FFF;
    border: 0px solid #779556;
    border-radius: 5px;
    height: 30px;
    width: 20%;
    font-weight: bold;
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
</style>