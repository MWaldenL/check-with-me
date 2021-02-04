<template>
<div id="box">
  <Sidebar />
  <h1 id="title">Profile</h1>
  <div id="user-details">
    <h1 id="hello">Hello, <span id="username">{{ username }}</span></h1>
    <b-row style="margin-bottom: 30px">
      <b-col>
        <h2 class="col-header">Your information</h2>
        <h2 class="col-content">First name: <span class="col-details">{{ firstName }}</span></h2>
        <h2 class="col-content">Last name: <span class="col-details">{{ lastName }}</span></h2>
        <h2 class="col-content">Email: <span class="col-details">{{ email }}</span></h2>
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
      <b-col><Statistic title="Total Wins" :value="totalWins" /></b-col>
      <b-col><Statistic title="Wins on White" :value="winsOnWhite" /></b-col>
      <b-col><Statistic title="Wins on Black" :value="winsOnBlack" /></b-col>
    </b-row>
    <h2 class="col-header"></h2>
    <b-row>
      <b-col><Statistic title="Win Rate" :value="winRate" /></b-col>
      <b-col><Statistic title="Points" :value="points" /></b-col>
      <b-col><Statistic title="Total Games" :value="totalGames" /></b-col>
    </b-row>
  </div>
</div>
</template>

<script>
import {
  auth,
  usersCollection
} from '@/firebase'
import Sidebar from '@/components/sidebar.vue'
import Statistic from '@/components/statistic.vue'

export default {
  name: 'Profile',
  components: {
    Sidebar,
    Statistic
  },
  data() {
    return {
      username: null,
      firstName: null,
      lastName: null,
      email: null,
      totalWins: 0,
      winsOnBlack: 0,
      winsOnWhite: 0,
      totalGames: 0,
      winRate: 0,
      points: 0
    }
  },
  async created() {
    const selfID = auth.currentUser.uid;
    const user = await usersCollection.doc(selfID).get()

    this.username = user.data().username
    this.firstName = user.data().first_name
    this.lastName = user.data().last_name
    
    const rawEmail = user.data().email
    const length = rawEmail.length - 5

    let string = rawEmail.substring(0, 2);
    for (let i = 0; i < length; i++)
      string = string.concat("*")
    string = string.concat(rawEmail.substring(length + 2, length + 5))

    this.email = string

    this.winsOnBlack = user.data().wins_black
    this.winsOnWhite = user.data().wins_white
    this.totalWins = this.winsOnBlack + this.winsOnWhite

    const totalDraw = user.data().draw_white + user.data().draw_white
    const totalLoss = user.data().loss_white + user.data().loss_white

    this.totalGames = this.totalWins + totalDraw + totalLoss

    const totalCounted = this.totalWins + totalLoss

    if (totalCounted === 0 && totalDraw !== 0) {
      this.winRate = "0.00%"
    } else if (totalCounted === 0 && totalDraw === 0) {
      this.winRate = "N/A"
    } else {
      const rate = this.totalWins / totalCounted * 100
      this.winRate = rate.toFixed(2) + "%"
    }

    this.points = user.data().points.toFixed(2)
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