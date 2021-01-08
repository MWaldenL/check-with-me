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
            <th id = "headerButton">
              <button>
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
              <button v-bind:class="getButtonClass(game.button)">
                {{ game.button }}
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
  getNextGames,
  getPrevGames
} from '@/resources/gameModel.js'

export default {
  name: 'GameLobby',
  components: {
    Sidebar
  },
  data () {
    return{
      pageNum: 1,
      lastPageNum: 3,
      lastVisible: null,
      games: [/*
        {
          room_name: "Michiko Gomi's Room",
          host_user: "MichikoGomi",
          button: "Join Room"
        },
        {
          room_name: "Mika Reyes's Room",
          host_user: "MikaReyes",
          button: "Full"
        }
      */]
    }
  },
  computed: {
    leftClass: function () {
      return {
        'dead-triangle': this.pageNum === 1
      }
    },

    rightClass: function () {
      return {
        'dead-triangle': this.pageNum === this.lastPageNum
      }
    },
  },
  created() {
    db.collection("games")
    .where("is_public", "==", true)
    .orderBy("room_name", "asc")
    .limit(10)
    .get()
    .then(querySnapshot => {
      let docs = querySnapshot.docs

      this.lastVisible = docs[docs.length - 1].data().room_name
      console.log(this.lastVisible)

      docs.forEach((doc, index) => {
        //console.log(doc.id, " => ", doc.data());
        let game = {
          room_name: doc.data().room_name
        }

        doc.data().host_user
        .get()
        .then(user => {
          game.host_user = user.data().username

          doc.data().other_user
          .get()
          .then(other => {
            if(other.exists)
              game.button = "Full"
            else
              game.button = "Join Room"

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

      //console.log("in sub " + this.lastVisible)
      prevPage = getPrevGames(this.lastVisible)
      this.lastVisible = prevPage.lastVisible
      this.games = prevPage.games
    },

    addPageNum() {
      if(this.pageNum !== this.lastPageNum)
        this.pageNum = this.pageNum + 1

      //console.log("in add " + this.lastVisible)
      nextPage = getNextGames(this.lastVisible)
      this.lastVisible = nextPage.lastVisible
      this.games = nextPage.games
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
  }

  #GameLobbyRule {
    border-width: 1px 48vw;
    border-style: solid;
    border-color: #C4C4C4;
  }

  #GameLobbyTable {
    border-collapse:separate; 
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
    padding: 0px 8vw 0px 20px;
  }
  .gameName {
    text-align: left;
    padding: 15px 8vw 15px 20px;
    font-size: 1.25em;
  }

  #headerHost {
    text-align: left;
    padding: 0px 30vw 0px 10px;
  }
  .gameHost {
    text-align: left;
    column-width: 100px;
    padding: 15px 30vw 15px 10px;
    font-size: 1.25em;
  }

  #headerButton {
    padding: 0px 20px 0px 5vw;
  }
  .gameButton {
    text-align: right;
    padding: 15px 20px 15px 5vw;
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

  .dead-triangle{
    border-left: 0px solid #2d2d2d;
    border-right: 0px solid #2d2d2d;
  }
  .dead-triangle:hover{
    border-left: 0px solid #2d2d2d;
    border-right: 0px solid #2d2d2d;
  }
</style>