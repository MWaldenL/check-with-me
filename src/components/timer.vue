<template>
  <div id="timer">
    <span class="time text-white" id="p1-time">
      {{ printTime(minutes) }}:{{ printTime(seconds) }}
    </span>
  </div>
</template>

<script>
import firebase from 'firebase'
import { db, gamesCollection } from '@/firebase'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      secondsLeft: this.secs
    }
  },

  props: { 
    secs: Number,
    isHost: Boolean,
    isRunning: Boolean
  },

  computed: {
    ...mapGetters({
      user: 'getCurrentUser'
    }),

    minutes() {
      return Math.floor(this.secondsLeft / 60)
    }, 

    seconds() {
      return this.secondsLeft % 60
    }
  },

  methods: {
    tick() {
      setTimeout(() => {
        console.log("tick")
        console.log(this.isRunning)
        if (this.isRunning && this.secondsLeft > 0)
          this.secondsLeft--
          // this.uploadTime()
      }, 1000)
    },

    async uploadTime() {
      const timeObj = this.isHost ? 
        { host_timeLeft: this.secondsLeft } : 
        { other_timeLeft: this.secondsLeft }

      // Update the timer of the current player
      await gamesCollection.doc('fjEU36gMVBuVTLQn5mrD').update(timeObj)
    },

    printTime(time) {
      if (time >= 10) {
        return time.toString(10)
      } else {
        return "0" + time
      }
    }
  },
    
  created() {
    console.log("created")
    this.tick()
  },

  updated() {
    console.log("updated")
    this.tick()
  }
}
</script>

<style>
.time {
  margin-left: 100px;
  padding: 10px 30px;
  background-color: #424242;
}
</style>