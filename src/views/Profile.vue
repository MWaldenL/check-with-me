<template>
<div id="box">
  <Sidebar />
  <h1 id="title">Profile</h1>
  <div id="user-details">
    <h1 id="hello">Hello, <span id="username">{{ user.data.username }}</span></h1>
    <b-row style="margin-bottom: 30px">
      <b-col>
        <h2 class="col-header">Your information</h2>
        <h2 class="col-content">First name: <span class="col-details">{{ user.data.first_name }}</span></h2>
        <h2 class="col-content">Last name: <span class="col-details">{{ user.data.last_name }}</span></h2>
        <h2 class="col-content">Email: <span class="col-details">{{ getEmail }}</span></h2>
      </b-col>
      <b-col></b-col>
      <b-col>
        <h2 class="col-header">Your options</h2>
        <router-link to="/change-password" class="router-link">
          <h2 class="col-content col-details cursor-pointer" id="change-pw">Change password</h2>
        </router-link>
      </b-col>
    </b-row>
    <h2 class="col-header">Your statistics</h2>
    <b-row>
      <b-col><Statistic title="Total Wins" :value="getTotalWins" /></b-col>
      <b-col><Statistic title="Wins on White" :value="user.data.wins_white" /></b-col>
      <b-col><Statistic title="Wins on Black" :value="user.data.wins_black" /></b-col>
    </b-row>
    <h2 class="col-header"></h2>
    <b-row>
      <b-col><Statistic title="Win Rate" :value="getWinRate" /></b-col>
      <b-col><Statistic title="Points" :value="getPoints" /></b-col>
      <b-col><Statistic title="Total Games" :value="getTotalGames" /></b-col>
    </b-row>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Sidebar from '@/components/sidebar.vue'
import Statistic from '@/components/statistic.vue'

export default {
  name: 'Profile',
  components: {
    Sidebar,
    Statistic
  },
  computed: {
    ...mapGetters({
      user: 'getCurrentUser'
    }),

    getEmail () {
      const email = this.user.data.email
      const length = email.length - 5

      let string = email.substring(0, 2);
      for (let i = 0; i < length; i++)
        string = string.concat("*")
      string = string.concat(email.substring(length + 2, length + 5))

      return string
    },

    getTotalWins () {
      return this.user.data.wins_white + this.user.data.wins_black
    },

    getTotalGames () {
      return this.user.data.wins_white + this.user.data.wins_black +
        this.user.data.draw_white + this.user.data.draw_black +
        this.user.data.loss_white + this.user.data.loss_black
    },

    getWinRate () {
      const nWins = this.user.data.wins_white + this.user.data.wins_black
      const nDraw = this.user.data.draw_white + this.user.data.draw_black
      const nLoss = this.user.data.loss_white + this.user.data.loss_black

      const nCounted = nWins + nLoss

      if (nCounted === 0 && nDraw !== 0) {
        return "0.00%"
      } else if (nCounted === 0 && nDraw === 0) {
        return "N/A"
      } else {
        const nRate = nWins / nCounted * 100
        return nRate.toFixed(2) + "%"
      }
    },

    getPoints () {
      const nWins = (this.user.data.wins_white + this.user.data.wins_black) * 1
      const nDraw = (this.user.data.draw_white + this.user.data.draw_black) * 0.5
      const nLoss = (this.user.data.loss_white + this.user.data.loss_black) * -0.5

      return nWins + nDraw + nLoss
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@700&family=Jura&display=swap');

#box {
  position: relative;
  margin-top: 10px;
}

#user-details {
  margin-left: 2.5vw;
  margin-right: 2.5vw;
}

#title {
  padding: 2vh;
  font-family: 'Jura', monospace;
  font-size: 6vh;
  font-weight: bold;
  color: #BCFC8A;
}

#hello {
  text-align: left;
  font-family: 'Raleway', Arial, Helvetica, sans-serif;
  font-size: 6vh;
  color: #585858;
  margin-bottom: 3.5vh;
}

#username {
  font-weight: 700;
  color: #FFFFFF;
}

.col-header {
  text-align: left;
  font-family: 'Raleway', Arial, Helvetica, sans-serif;
  font-size: 3vh;
  color: #585858;
  margin-bottom: 2.5vh;
}

.col-content {
  text-align: left;
  font-family: 'Raleway', Arial, Helvetica, sans-serif;
  font-size: 3vh;
  color: #585858;
}

.col-details {
  color: #FFFFFF;
}

#change-pw {
  transition: all 0.2s;
}

#change-pw:hover {
  color: #BCFC8A;
}

.router-link {
  text-decoration: none;
}
</style>