<template>
  <div id = 'LeaderboardPage'>
    <Sidebar />
    <div id="LeaderboardProper">
      <div id="LeaderboardPageLabel">Leaderboard</div>
      <hr id="LeaderboardRule">
      <table id="LeaderboardTable">
        <thead id='ColumnNames'>
          <tr>
            <th id = "headerRank">Rank</th>
            <th id = "headerName">Name</th>
            <th id = "headerScore">{{ criteriaList[criteriaIndex] }}</th>
          </tr>
        </thead>
        <tbody>
          <tr class='leaderEntry' v-for="leader in leaders" :key="leader['.key']">
            <td class = "leaderRank">{{ leader.rank }}</td>
            <td class = "leaderName">{{ leader.username }}</td>
            <td class = "leaderScore">{{ leader.points }}</td>
          </tr>
        </tbody>
      </table>
      <div id="CriteriaSelect">
        <div class="triangle-left" @click="moveCriteriaLeft()"></div>
        <div id="criteriaLabel">{{ criteriaList[criteriaIndex] }}</div>
        <div class="triangle-right" @click="moveCriteriaRight()"></div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import { db } from '@/firebase'
import Sidebar from '@/components/sidebar.vue'
import leaderQuery from '@/resources/leaderQuery'

export default {
  name: 'Leaderboard',
  components: {
    Sidebar
  },
  data () {
    return{
      criteriaList: ["Elo Rating", "Win Rate", "Total Wins", "Wins on White", "Wins on Black"],
      criteriaIndex: 0,
      leaders: []
    }
  },
  created() {
    db.collection("users").orderBy("points", "desc").limit(10)
      .get()
      .then(querySnapshot => {
        let docs = querySnapshot.docs
        docs.forEach((doc, index) => {
          //console.log(doc.id, " => ", doc.data());
          let leader = {
            rank: index + 1,
            username: doc.data().username,
            points: doc.data().points
          }
          this.leaders.push(leader)
        })
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      })
  },
  methods: {
    queryLeaders() {
      if(this.criteriaIndex === 0)
        this.leaders = leaderQuery.queryElo()
      else if(this.criteriaIndex === 1)
        this.leaders = leaderQuery.queryWinRate()
      else if(this.criteriaIndex === 2)
        this.leaders = leaderQuery.queryTotalWins()
      else if(this.criteriaIndex === 3)
        this.leaders = leaderQuery.queryWhiteWins()
      else if(this.criteriaIndex === 4)
        this.leaders = leaderQuery.queryBlackWins()
    },

    moveCriteriaLeft() {
      if (this.criteriaIndex === 0)
        this.criteriaIndex = 4
      else
        this.criteriaIndex = this.criteriaIndex - 1

      this.queryLeaders()
    },
    
    moveCriteriaRight() {
      if (this.criteriaIndex === 4)
        this.criteriaIndex = 0
      else
        this.criteriaIndex = this.criteriaIndex + 1

      this.queryLeaders()
    }
  }
}
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@700&family=Jura&display=swap');

  #LeaderboardProper {
    display: grid;
    place-items: center;
  }

  #LeaderboardPageLabel {
    font-family: 'Jura', monospace;
    font-size: 3em;
    color: #BCFC8A;
    padding-top: 10px;
  }

  #LeaderboardRule {
    border-width: 1px 48vw;
    border-style: solid;
    border-color: #C4C4C4;
  }

  #LeaderboardTable {
    border-collapse:separate; 
    border-spacing: 0px 15px;
  }

  #ColumnNames {
    color: #FFF;
    font-family: 'Raleway', Arial, Helvetica, sans-serif;
    font-weight: bold;
  }

  .leaderEntry>td {
    background-color: #C4C4C4;
    color: #000;
    font-family: 'Raleway', Arial, Helvetica, sans-serif;
    font-weight: bold;
  }

  #headerRank {
    text-align: left;
    padding: 0px 8vw 0px 20px;
  }
  .leaderRank {
    text-align: left;
    padding: 15px 8vw 15px 20px;
    font-size: 1.25em;
  }

  #headerName {
    text-align: left;
    padding: 0px 30vw 0px 10px;
  }
  .leaderName {
    text-align: left;
    column-width: 100px;
    padding: 15px 30vw 15px 10px;
    font-size: 1.25em;
  }

  #headerScore {
    padding: 0px 20px 0px 5vw;
  }
  .leaderScore {
    text-align: right;
    padding: 15px 20px 15px 5vw;
    font-size: 1.25em;
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

  .triangle-left {
    float: left;
    width: 0;
    height: 0;
    border-top: 15px solid transparent;
    border-right: 30px solid #FFF;
    border-bottom: 15px solid transparent;
    
  }

  #criteriaLabel {
    float:left;
    padding-left: 20px;
    padding-right: 20px;
  }

  .triangle-right {
    float: right;
    width: 0;
    height: 0;
    border-top: 15px solid transparent;
    border-left: 30px solid #FFF;
    border-bottom: 15px solid transparent;
  }

  .triangle-left:hover {
    border-right: 30px solid #BCFC8A;
  }

  .triangle-right:hover {
    border-left: 30px solid #BCFC8A;
  }
</style>