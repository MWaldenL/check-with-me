<template>
  <div>
    <b-modal v-model="inGameLogout" id="game-logout-modal" @ok="logoutFromGame" hide-header no-close-on-esc no-close-on-backdrop>
      <div>Logging out will remove you from your current room. Proceed?</div>
    </b-modal>

    <b-button v-b-toggle.sidebar id="menu"><b-icon-caret-right-fill></b-icon-caret-right-fill></b-button>
    <b-sidebar id="sidebar" title="Check with Me" bg-variant="dark" text-variant="light">
      <div id="s-contents" class="px-3 py-2"  @click="checkRoute">
        <button id="lobby" class="router-link route-button" :disabled="isLobby || isWaiting" @click="playCheck">
          <h3 class="cursor-pointer text-white" :class="{disabled:isLobby || isWaiting}">Play</h3>
        </button>
        <router-link to="/profile" id="profile" class="router-link">
          <h3 class="cursor-pointer text-white">Profile</h3>
        </router-link>
        <router-link to="/leaderboard" id="leaderboard" class="router-link">
          <h3 class="cursor-pointer text-white">Leaderboard</h3>
        </router-link>
        <router-link to="/help" id="help" class="router-link">
          <h3 class="cursor-pointer text-white">How to Play</h3>
        </router-link>
        <button id="logout" class="router-link route-button" @click="showLogout">
          <h3 class="cursor-pointer text-white">Logout</h3>
        </button>
      </div>
    </b-sidebar>
  </div>  
</template>

<script>
import firebase from 'firebase'
import { gamesCollection } from '@/firebase'
import { mapGetters, mapActions } from 'vuex'
import { 
  checkUserGame, 
  getSingleGame, 
  removeGuest, 
  deleteGame 
} from '@/resources/gameModel.js'

export default {
  name: 'Sidebar',
  computed: {
    isLobby() {
      return this.$route.name === "GameLobby"
    },
    isWaiting() {
      return this.$route.name === "WaitingRoom"
    }
  },
  
  data() {
    return {
      inGameLogout: false
    }
  },

  methods: {
    ...mapActions([
      'logoutUser',
      'aClearGameState'
    ]),

    async showLogout() {
      const userID = firebase.auth().currentUser.uid
      const roomID = await checkUserGame(userID)
      
      // If coming from game room, show modal, else simply logout
      if (this.$route.name !== 'PlayBoard') {
        this.logout()
      } else if (roomID) {
        this.inGameLogout = true
      }
    },

    async logoutFromGame() {
      const userID = firebase.auth().currentUser.uid
      const roomID = await checkUserGame(userID)
      const room = await getSingleGame(roomID)
      const winnerFromLogout = 
        room.host_user.id === userID ? 
        room.other_user.id : 
        room.host_user.id
      
      await this.setWinnerFromLogout(roomID, winnerFromLogout)
      
      // If host user logs out, delete the game, else simply remove the guest
      if (room.host_user.id === userID) {
        await deleteGame(roomID)
      } else {
        await removeGuest(roomID)
      }

      // Logout after processing
      this.logout()
    },

    async playCheck() {
      const gameID = await checkUserGame(firebase.auth().currentUser.uid)
      if (gameID) {
        this.$router.push({ path: `/room/${gameID}` })
      } else {
        this.$router.push({ path: '/' })
      }
    },

    async setWinnerFromLogout(gameID, player) {
      await gamesCollection
        .doc(gameID)
        .update({ winner_from_logout: player })
    },

    checkRoute() {
      console.log(this.$route.name)
    },

    logout() {
      console.log("in logout")
      this.aClearGameState()
      firebase.auth().signOut()
        .then(() => {
          this.logoutUser()
          this.$router.push('/login')
        })
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jura&family=Raleway?display=swap');

.router-link {
  text-decoration: none;
  border-bottom: 0;
  outline: none;
}

#menu {
  position: absolute;
  left: 10px;
  top: 0;
}

#sidebar {
  font-family: 'Jura', monospace;
}

#s-contents h3 {
  font-family: 'Raleway', Helvetica, Arial, sans-serif;
  padding-top: 30px;
}

.route-button {
  background-color: #343a40;
  border:none;
  outline: none;
}
.route-button:active {
  outline: none;
}

.disabled {
  color: gray;
}
</style>