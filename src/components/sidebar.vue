<template>
  <div>
    <b-modal v-model="isLoggingOutFromWaitingRoomOrGame" id="game-logout-modal" @ok="logoutFromGame" hide-header no-close-on-esc no-close-on-backdrop>
      <div>Logging out will remove you from your current room. Proceed?</div>
    </b-modal>

    <b-button v-b-toggle.sidebar id="menu"><b-icon-caret-right-fill></b-icon-caret-right-fill></b-button>
    <b-sidebar id="sidebar" title="Check with Me" bg-variant="dark" text-variant="light">
      <div id="s-contents" class="px-3 py-2"  @click="checkRoute">
        <button id="lobby" class="router-link route-button" :disabled="isPlayButtonDisabled" @click="playCheck">
          <h3 :class="playButtonDisabledClass">Play</h3>
        </button>
        <router-link to="/profile" id="profile" class="router-link" :disabled="isInGame">
          <h3 :class="inGameDisabledClass">Profile</h3>
        </router-link>
        <router-link to="/leaderboard" id="leaderboard" class="router-link" :disabled="isInGame">
          <h3 :class="inGameDisabledClass">Leaderboard</h3>
        </router-link>
        <router-link to="/help" id="help" class="router-link" :disabled="isInGame">
          <h3 :class="inGameDisabledClass">How to Play</h3>
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
import { auth, gamesCollection } from '@/firebase'
import { mapGetters, mapActions } from 'vuex'
import { 
  checkUserGame, 
  getSingleGame, 
  removeGuest, 
  deleteGame 
} from '@/resources/gameModel.js'

export default {
  name: 'Sidebar',
  props: ['selfColor', 'finishedUpdatingScore'],

  async created() {
    // Check if user is in game and disable links as needed
    const userID = auth.currentUser.uid
    const roomID = await checkUserGame(userID)
    this.isInGame = roomID && this.$route.name === "PlayBoard"
  },

  updated() {
    if (this.finishedUpdatingScore) {
      this.logout()
    }
  },

  computed: {
    ...mapGetters({
      activeGame: "getActiveGame",
      currentGame: "getCurrentGame"
    }),

    isLobby() {
      return this.$route.name === 'GameLobby'
    },

    isWaiting() {
      return this.$route.name === 'WaitingRoom'
    },

    isPlayButtonDisabled() {
      return this.isLobby || this.isWaiting || this.isInGame
    },

    inGameDisabledClass() {
      return {
        disabled: this.isInGame,
        'text-white': !this.isInGame,
        'cursor-pointer': !this.isInGame
      }
    },

    inLobbyWaitingDisabledClass() {
      const inLobbyWaiting = this.isLobby || this.isWaiting
      return {
        disabled: inLobbyWaiting,
        'text-white': !inLobbyWaiting,
        'cursor-pointer': !inLobbyWaiting
      }
    },

    playButtonDisabledClass() {
      return {
        disabled: this.isPlayButtonDisabled,
        'text-white': !this.isPlayButtonDisabled,
        'cursor-pointer': !this.isPlayButtonDisabled
      }
    }
  },
  
  data() {
    return {
      isInGame: false,
      inGameLogout: false,
      isLoggingOutFromWaitingRoom: false,
      isLoggingOutFromWaitingRoomOrGame: false
    }
  },

  watch: {
    finishedUpdatingScore(newVal, oldVal) {
      if (newVal === true) {
        this.logout()
      }
    }
  },

  methods: {
    ...mapActions([
      'logoutUser',
      'aClearGameState'
    ]),

    async showLogout() {
      const userID = auth.currentUser.uid
      const roomID = await checkUserGame(userID)
      const isInWaitingRoom = this.$route.name === 'WaitingRoom'
      const isInDeletedRoom = this.$route.name === 'PlayBoard' && !roomID
      const isNotInRoomOrGame = 
        this.$route.name !== 'PlayBoard' && 
        this.$route.name !== 'WaitingRoom'

      // If coming from game room, show modal, else simply logout
      if (isNotInRoomOrGame || isInDeletedRoom) {
        this.logout()
      } else if (isInWaitingRoom) {
        this.isLoggingOutFromWaitingRoom = true
        this.isLoggingOutFromWaitingRoomOrGame = true
      } else if (roomID) {
        console.log('in room')
        this.inGameLogout = true
        this.isLoggingOutFromWaitingRoomOrGame = true
      } else {
        console.log('else block')
        console.log(roomID)
      }
    },

    async logoutFromGame() {
      const userID = auth.currentUser.uid
      const roomID = await checkUserGame(userID)
      const room = await getSingleGame(roomID)

      // Ninja moves: logging out from a game is actually done in the watch method.
      // Logging out in the waiting room is done here
      // If host user logs out, delete the game, else simply remove the guest
      if (this.isLoggingOutFromWaitingRoom) {
        console.log('logout from waiting room')
        if (room.host_user.id === userID) {
          await deleteGame(roomID)
        } else {
          await removeGuest(roomID)
        }

        this.logout()
        return
      }

      if (!this.activeGame) {
        console.log('not active game')

        // logout handling during post-game
        await gamesCollection
          .doc(this.currentGame)
          .update({
            enemy_left_confirmed: true
          })
      } else {
        // For logging out from games
        const winColor = this.selfColor === 'w' ? 'B' : 'W'
        const winner = room.host_user.id === userID ? 
          room.other_user.id : 
          room.host_user.id

        await this.setWinnerFromLogout(roomID, winner)
        
        // Inform grid.vue that the player has logged out to compute the score
        this.$emit('logoutFromGame', { winner: winColor, isLoggingOut: true })

        // If host user logs out, delete the game, else simply remove the guest
        if (room.host_user.id === userID) {
          await deleteGame(roomID)
        } else {
          await removeGuest(roomID)
        }
      }
    },

    async playCheck() {
      const gameID = await checkUserGame(firebase.auth().currentUser.uid)
      if (gameID) {
        this.$router.push({ path: `/room/${gameID}` })
      } else {
        this.$router.push({ name: 'GameLobby' })
      }
    },

    async setWinnerFromLogout(gameID, winner) {
      await gamesCollection
        .doc(gameID)
        .update({ winner_from_logout: winner }, { merge: true })
    },

    checkRoute() {
      console.log(this.$route.name)
    },

    logout() {
      console.log('logging out')
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

.disabled {
  color: #888888;
  cursor: default !important
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
</style>