<template>
  <div>
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
        <router-link to="/login" id="logout" class="router-link" @click.native="logout">
          <h3 class="cursor-pointer text-white">Logout</h3>
        </router-link>
      </div>
    </b-sidebar>
  </div>  
</template>

<script>
import firebase from 'firebase'
import { mapGetters, mapActions } from 'vuex'
import { checkUserGame } from '@/resources/gameModel.js'

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
  methods: {
    ...mapActions(['logoutUser']),
    logout () {
      firebase.auth().signOut()
        .then(() => {
          this.logoutUser()
          this.$router.push('/login')
        })
      ////console.log(this.$route.name)
    },
    async playCheck () {
      const gameID = await checkUserGame(firebase.auth().currentUser.uid)
      if(gameID !== false)
        this.$router.push({ path: '/room/' + gameID })
      else
        this.$router.push({ path: '/'})
      //console.log(doc)
    },
    checkRoute () {
      console.log(this.$route.name)
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jura&family=Raleway?display=swap');

.router-link {
  text-decoration: none;
  border-bottom: 0
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
}
.route-button:active {
  outline: none;
}

.disabled {
  color: gray;
}
</style>