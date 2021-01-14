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
  data() {
    return {
      secondsLeft: this.secs
    }
  },

  props: { 
    secs: Number,
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
    },
  },

  methods: {
    tick() {
       setTimeout(() => {
        if (this.isRunning && this.secondsLeft > 0) {
          console.log('wahatt')
          this.secondsLeft--
          this.uploadTime()
        }
      }, 1000)
    },

    async uploadTime() {
      const timeObj = this.isHost ? 
        { host_timeLeft: this.secondsLeft } : 
        { other_timeLeft: this.secondsLeft }

      // Update the timer of the current player
      await gamesCollection.doc('Vc0H4f4EvY6drRKnvsk5').update(timeObj)
    },

    printTime(time) {
      return (time >= 10) ? time.toString(10) : `0${time}`
    }
  },
    
  created() {
    console.log(this.secondsLeft)
    this.tick()
  },

  updated() {
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