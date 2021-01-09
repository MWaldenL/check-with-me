<template>
  <div id = 'GameLobbyPage'>
    <Sidebar />
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
            <td class = "gameHost">{{ game.host_user }}</td>
            <td class = "gameButton">
              <button :disabled="!isActive[game.index]" v-bind:class="getButtonClass(game.button)" @click="[$event.target.classList.add('redButton'), joinRoom(game.room_id, game.index)]">
                {{isActive[game.index] ? 'Join Room' : 'Full'}}
              </button>
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
import {
  getGames,
  getPrevGames,
  roomQuery,
  getCount
} from '@/resources/gameModel.js'

export default {
  name: 'GameLobby',
  components: {
    Sidebar
  },
  data () {
    return{
      pageNum: 1,
      lastPageNum: [],
      firstVisible: [],
      lastVisible: [],
      prevStart: [],
      games: [],
      isActive: [],
      lobbyNextQuery: roomQuery,
      lobbyPrevQuery: roomQuery
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
    },
  },
  created() {
    this.lastPageNum = getCount()

    roomQuery
    .get()
    .then(querySnapshot => {
      let docs = querySnapshot.docs

      this.firstVisible.push(docs[0])
      this.lastVisible = [docs[docs.length - 1]]
      console.log(this.lastVisible)

      docs.forEach((doc, index) => {
        //console.log(doc.id, " => ", doc.data());
        let game = {
          index: index,
          room_id: doc.id,
          room_name: doc.data().room_name
        }

        doc.data().host_user
        .get()
        .then(user => {
          game.host_user = user.data().username

          doc.data().other_user
          .get()
          .then(other => {
            if(other.exists){
              game.button = "Full"
              this.isActive.push(0)
            }
            else{
              game.button = "Join Room"
              this.isActive.push(1)
            }

            this.games.push(game)
          })
        })
      })
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    })
  },
  methods: {
    getButtonClass(text) {
      let status = text === "Join Room"
      return {
        active: status,
        'greenButton': status,
        'redButton': !status
      }
    },

    subPageNum() {
      if(this.pageNum !== 1)
        this.pageNum = this.pageNum - 1

      let promise = new Promise((resolve) => {
        this.lobbyPrevQuery = this.lobbyPrevQuery.startAt(this.prevStart[this.pageNum - 1]).endBefore(this.firstVisible[0])
        console.log(this.lobbyPrevQuery)
        let prevPage = getGames(this.lobbyPrevQuery)

        resolve(prevPage)
      })
      .then(prevPage => {
        //this.prevStart = this.firstVisible
        this.firstVisible = prevPage.firstVisible
        this.lastVisible = prevPage.lastVisible
        this.games = prevPage.games
      })
    },

    addPageNum() {
      console.log(this.lastPageNum[0])

      if(this.pageNum !== this.lastPageNum[0])
        this.pageNum = this.pageNum + 1

      let promise = new Promise((resolve) => {
        this.lobbyNextQuery = this.lobbyNextQuery.startAfter(this.lastVisible[0])
        let nextPage = getGames(this.lobbyNextQuery)

        resolve(nextPage)
      })
      .then(nextPage => {
        if(this.pageNum > this.prevStart.length)
          this.prevStart.push(this.firstVisible[0])
        this.firstVisible = nextPage.firstVisible
        this.lastVisible = nextPage.lastVisible
        this.games = nextPage.games
      })
    },

    joinRoom(room_id, index) {
      let user = firebase.auth().currentUser.uid
      console.log(user + " " + index)

      this.isActive.splice(index, 1, 0);
      console.log(this.isActive)

      // let path = "/users/" + user;
      // let ref = db.getInstance().getReference(path);
      // db.collection("games")
      // .doc(room_id)
      // .update({
      //   other_user: ref
      // })
      // .then(() => {

      // })
      // .catch(error => {
      //   console.log("Error getting documents: ", error);
      // })
    },

    createRoom() {
      alert("Hello! I am create room (next ticket)!!");
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
    font-size: 1.25em;
  }

  #headerHost {
    text-align: left;
    padding: 0px 15vw 10px 10px;
    font-size: 1.5em;
  }
  .gameHost {
    text-align: left;
    column-width: 100px;
    padding: 15px 15vw 30px 10px;
    font-size: 1.25em;
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
    font-size: 1.25em;
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
  }

  .dead-triangle-right{
    border-left: 30px solid #444444;
  }
  .dead-triangle-right:hover{
    border-left: 30px solid #444;
  }

  .dead-triangle-left{
    border-right: 30px solid #444;
  }
  .dead-triangle-left:hover{
    border-right: 30px solid #444;
  }
</style>