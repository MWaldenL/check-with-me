<template>
  <div id = 'GameLobbyPage'>
    <Sidebar />
    <CreateRoomModal v-show="showModal" @close="showModal = false" />
    <!-- <CreateRoomModal v-bind:showModal="showModal" @close="showModal = false" /> -->
    <div id = 'GameLobbyProper'>
      <div id="GameLobbyPageLabel">Game Lobby</div>
      <hr id="GameLobbyRule">
      <table id="GameLobbyTable">
        <thead id='ColumnNames'>
          <tr>
            <th id = "headerName">Room Name</th>
            <th id = "headerHost">Host</th>
            <th id = "headerButtonCont">
              <button id = "headerButton" @click="createRoom()">
                + Create Room
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class='gameEntry' v-for="game in games" :key="game['.key']">
            <td class = "gameName">{{ game.room_name }}</td>
            <td class = "gameHost">{{ game.host_user[0] }}</td>
            <td class = "gameButton">
              <router-link :to="`/room/${ game.room_id }`" tag="button" :disabled="game.isFull" v-bind:class="{active: !game.isFull,'greenButton': !game.isFull,'redButton': game.isFull}" v-on:click.native="joinRoom(game.room_id)">
                {{game.isFull ? 'Full' : 'Join Room'}}
              </router-link>
              <!-- <button :disabled="game.isFull" v-bind:class="{active: !game.isFull,'greenButton': !game.isFull,'redButton': game.isFull}" @click="[$event.target.classList.add('redButton'), joinRoom(game.room_id)]">
                {{game.isFull ? 'Full' : 'Join Room'}}
              </button> -->
            </td>
          </tr>
        </tbody>
      </table>
      <div id="CriteriaSelect">
        <div class="triangle-left" @click="subPageNum()" v-bind:class="leftClass"></div>
        <div id="criteriaLabel">{{ pageNum }}</div>
        <div class="triangle-right" @click="addPageNum()" v-bind:class="rightClass"></div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import { db } from '@/firebase'
import Sidebar from '@/components/sidebar.vue'
import CreateRoomModal from '@/components/createRoomModal.vue'
import {
  getGames,
  getPrevGames,
  roomQuery,
  getCount
} from '@/resources/gameModel.js'

export default {
  name: 'GameLobby',
  components: {
    Sidebar,
    CreateRoomModal
  },
  data () {
    return{
      pageNum: 1,
      lastPageNum: [],
      firstVisible: [],
      lastVisible: [],
      prevStart: [],
      games: [],
      lobbyNextQuery: roomQuery,
      lobbyPrevQuery: roomQuery,

      showModal: false
    }
  },
  computed: {
    leftClass: function () {
      return {
        'dead-triangle-left': this.pageNum === 1
      }
    },

    rightClass: function () {
      return {
        'dead-triangle-right': this.pageNum === this.lastPageNum[0]
      }
    }
  },
  created() {
    this.lastPageNum = getCount()

    let initGames = getGames(roomQuery)
    initGames
    .then(result => {
      //console.log(result.games)

      this.games = result.games
      this.lastVisible = result.lastVisible
      this.firstVisible = result.firstVisible
    })
  },
  methods: {
    subPageNum() {
      if(this.pageNum !== 1)
      {
        this.pageNum = this.pageNum - 1
        this.lobbyPrevQuery = this.lobbyPrevQuery.startAt(this.prevStart[this.pageNum - 1]).endBefore(this.firstVisible[0])

        let prevPage = getGames(this.lobbyPrevQuery)
        prevPage
        .then(result => {
          this.games = result.games
          this.lastVisible = result.lastVisible
          this.firstVisible = result.firstVisible
        })
      }
    },

    addPageNum() {
      if(this.pageNum !== this.lastPageNum[0])
      {
        this.pageNum = this.pageNum + 1
        this.lobbyNextQuery = this.lobbyNextQuery.startAfter(this.lastVisible[0])
        
        let nextPage = getGames(this.lobbyNextQuery)
        nextPage
        .then(result => {
          if(this.pageNum > this.prevStart.length)
            this.prevStart.push(this.firstVisible[0])
          this.games = result.games
          this.lastVisible = result.lastVisible
          this.firstVisible = result.firstVisible
        })
      }
    },

    joinRoom(room_id) {
      //console.log("INSIDE")
      let user_key = firebase.auth().currentUser.uid
      
      let room = this.games.find(obj => {
        return obj.room_id === room_id
      })
      let copy = this.games
      copy[this.games.indexOf(room)].isFull = true
      this.games = copy

      db.collection("games")
      .doc(room_id)
      .update({
        other_user:  db.doc('users/' + user_key)
      })
      .catch(error => {
        console.log("Error getting documents: ", error);
      })
    },

    createRoom() {
      this.showModal = true
    }
  }
}
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@700&family=Jura&display=swap');

  #GameLobbyProper {
    display: grid;
    place-items: center;
  }

  #GameLobbyPageLabel {
    font-family: 'Jura', monospace;
    font-size: 3em;
    color: #BCFC8A;
    padding-top: 10px;
    font-weight: 600;
  }

  #GameLobbyRule {
    border-width: 1px 48vw;
    border-style: solid;
    border-color: #C4C4C4;
  }

  #GameLobbyTable {
    border-collapse:collapse; 
    border-spacing: 0px 15px;
  }

  #ColumnNames {
    color: #FFF;
    font-family: 'Raleway', Arial, Helvetica, sans-serif;
    font-weight: bold;
  }

  .gameEntry>td {
    background-color: #C4C4C4;
    color: #000;
    font-family: 'Raleway', Arial, Helvetica, sans-serif;
    font-weight: bold;
  }

  #headerName {
    text-align: left;
    padding: 0px 20vw 10px 20px;
    font-size: 1.5em;
  }
  .gameName {
    text-align: left;
    padding: 15px 8vw 30px 20px;
    font-size: 1.5em;
    font-weight: bold;
  }

  #headerHost {
    text-align: Center;
    padding: 0px 15vw 10px 10px;
    font-size: 1.5em;
  }
  .gameHost {
    text-align: Center;
    column-width: 100px;
    padding: 15px 15vw 30px 10px;
    font-size: 1.5em;
    font-weight: bold;
  }

  #headerButtonCont {
    padding: 0px 20px 10px 5vw;
  }
  #headerButton {
    background-color: #C4C4C4;
    font-weight: bolder;
    color:  #779556;
    font-size: 1.5em;
  }
  .gameButton {
    text-align: right;
    padding: 15px 20px 30px 5vw;
    font-size: 1.5em;
    font-weight: bold;
  }
  .greenButton {
    background-color: #779556;
    color: #FFF;
    font-size: 0.75em;
    text-align: center;
    border: 0px solid #779556;
    border-radius: 5px;
    height: 90%;
    width: 100%;
  }
  .redButton {
    background-color: #FF4949;
    color: #FFF;
    font-size: 0.75em;
    text-align: center;
    border: 0px solid #FF4949;
    border-radius: 5px;
    height: 90%;
    width: 100%;
    cursor: default
  }

  #CriteriaSelect {
    color: #FFF;
    font-family: 'Raleway', Arial, Helvetica, sans-serif;
    font-weight: bold;
  }

  #CriteriaSelect {
    padding: 20px;
    margin: 10px;
  }
  #criteriaLabel {
    float:left;
    padding-left: 20px;
    padding-right: 20px;
  }

  .triangle-left {
    float: left;
    width: 0;
    height: 0;
    border-top: 15px solid transparent;
    border-right: 30px solid #FFF;
    border-bottom: 15px solid transparent;
    
  }
  .triangle-left:hover {
    border-right: 30px solid #BCFC8A;
    cursor: pointer;
  }

  .triangle-right {
    float: right;
    width: 0;
    height: 0;
    border-top: 15px solid transparent;
    border-left: 30px solid #FFF;
    border-bottom: 15px solid transparent;
  }
  .triangle-right:hover {
    border-left: 30px solid #BCFC8A;
    cursor: pointer;
  }

  .dead-triangle-right{
    border-left: 30px solid #444444;
  }
  .dead-triangle-right:hover{
    border-left: 30px solid #444;
    cursor: default;
  }

  .dead-triangle-left{
    border-right: 30px solid #444;
  }
  .dead-triangle-left:hover{
    border-right: 30px solid #444;
    cursor: default;
  }
</style>