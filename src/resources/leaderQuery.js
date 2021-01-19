import firebase from 'firebase'
import { db } from '@/firebase'

class WinRateLeader {
  constructor (username, loss_white, loss_black, wins_white, wins_black, draw_white, draw_black, points) {
      this.username = username
      this.win_rate = (wins_white + wins_black) / (wins_white + wins_black + loss_white + loss_black + draw_white + draw_black)
      this.points = points
  }
  toString() {
      return this.username + ': ' + this.win_rate
  }
}

var winRateConverter = {
  fromFirestore: function(snapshot, options) {
    const data = snapshot.data(options)
    return new WinRateLeader(data.username, data.loss_white, data.loss_black, data.wins_white, data.wins_black, data.draw_white, data.draw_black, data.points)
  }
}

class TotalWinsLeader {
  constructor (username, wins_white, wins_black, points) {
      this.username = username
      this.total_wins = wins_white + wins_black
      this.points = points
  }
  toString() {
      return this.username + ': ' + this.total_wins
  }
}

var totalWinsConverter = {
  fromFirestore: function(snapshot, options) {
    const data = snapshot.data(options)
    return new TotalWinsLeader(data.username, data.wins_white, data.wins_black, data.points)
  }
}

export default {
  sortWinRateThenElo (a, b) {
    if(a.win_rate === b.win_rate)
      return (a.points <= b.points) ? 1 : -1
    else
      return (a.win_rate < b.win_rate) ? 1 : -1
  },
  
  sortTotalWinsThenElo (a, b) {
    if(a.total_wins === b.total_wins)
      return (a.points <= b.points) ? 1 : -1
    else
      return (a.total_wins < b.total_wins) ? 1 : -1
  },
  //queryElo
  queryElo() {
    let leaders = []

    db.collection("users").orderBy("points", "desc").limit(10)
    .get()
    .then(querySnapshot => {
      let docs = querySnapshot.docs
      docs.forEach((doc, index) => {
        ////console.log(doc.id, " => ", doc.data());
        let leader = {
          rank: index + 1,
          username: doc.data().username,
          points: doc.data().points
        }
        leaders.push(leader)
      })
    })
    .catch(function(error) {
      //console.log("Error getting documents: ", error);
    })

    return leaders
  },

  //queryWinRate
  queryWinRate() {
    let leaders = []

    db.collection("users")
    .withConverter(winRateConverter)
    .get()
    .then(querySnapshot => {
      let winRates = []

      querySnapshot.forEach(doc => {
        ////console.log(doc.id, " => ", doc.data());
        let winRateLeader = doc.data()

        ////console.log(!isNaN(winRateLeader.win_rate))
        if(!isNaN(winRateLeader.win_rate))
          winRates.push(winRateLeader)
      })

      winRates.sort(this.sortWinRateThenElo)

      let limit = 10
      if(winRates.length < 10)
      limit = winRates.length
      
      for(let i = 0; i < limit; i++)
      {
        let leader = {
          rank: i + 1,
          username: winRates[i].username,
          points: (winRates[i].win_rate*100).toFixed(2) + "%"
        }

        leaders.push(leader)
      }
    })
    .catch(function(error) {
      //console.log("Error getting documents: ", error);
    })

    return leaders
  },

  //queryTotalWins
  queryTotalWins() {
    let leaders = []

    db.collection("users")
    .withConverter(totalWinsConverter)
    .get()
    .then(querySnapshot => {
      let totalWins = []

      querySnapshot.forEach(doc => {
        ////console.log(doc.id, " => ", doc.data());
        let totalWinsLeader = doc.data()

        ////console.log(!isNaN(winRateLeader.win_rate))
        totalWins.push(totalWinsLeader)
      })

      totalWins.sort(this.sortTotalWinsThenElo)

      let limit = 10
      if(totalWins.length < 10)
      limit = totalWins.length
      
      for(let i = 0; i < limit; i++)
      {
        let leader = {
          rank: i + 1,
          username: totalWins[i].username,
          points: totalWins[i].total_wins
        }

        leaders.push(leader)
      }
    })
    .catch(function(error) {
      //console.log("Error getting documents: ", error);
    })

    return leaders
  },

  //queryWhiteWins
  queryWhiteWins() {
    let leaders = []

    db.collection("users").orderBy("wins_white", "desc").orderBy("points", "desc").limit(10)
    .get()
    .then(querySnapshot => {
      let docs = querySnapshot.docs
      docs.forEach((doc, index) => {
        ////console.log(doc.id, " => ", doc.data());
        let leader = {
          rank: index + 1,
          username: doc.data().username,
          points: doc.data().wins_white
        }
        leaders.push(leader)
      })
    })
    .catch(function(error) {
      //console.log("Error getting documents: ", error);
    })

    return leaders
  },

  //queryBlackWins
  queryBlackWins() {
    let leaders = []

    db.collection("users").orderBy("wins_black", "desc").orderBy("points", "desc").limit(10)
    .get()
    .then(querySnapshot => {
      let docs = querySnapshot.docs
      docs.forEach((doc, index) => {
        ////console.log(doc.id, " => ", doc.data());
        let leader = {
          rank: index + 1,
          username: doc.data().username,
          points: doc.data().wins_black
        }
        leaders.push(leader)
      })
    })
    .catch(function(error) {
      //console.log("Error getting documents: ", error);
    })

    return leaders
  }
}

