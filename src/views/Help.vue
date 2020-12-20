<template>
<div id="box">
  <Sidebar />
  <h1 id="title">How to Play</h1>
  <b-nav tabs justified v-b-scrollspy:instructions-box class="instructions">
    <b-nav-item class="nav-item" href="#what-is-checkers" @click="scrollIntoView">What is Checkers</b-nav-item>
    <b-nav-item class="nav-item" href="#prep-objective" @click="scrollIntoView">Preparation and Objectives</b-nav-item>
    <b-nav-item class="nav-item" href="#mechanics" @click="scrollIntoView">Game Mechanics</b-nav-item>
    <b-nav-item class="nav-item" href="#how-to-win" @click="scrollIntoView">How to Win</b-nav-item>
  </b-nav>
  <div id="instructions-box" class="instructions" ref="content">
    <h1 id="what-is-checkers" class="help-content help-bold help-header">What is Checkers</h1>
    <HelpItem :text="this.helpMessages.intro.CHECKERS_DESC" :head="'King Movement. '" />
    <h1 id="prep-objective" class="help-content help-bold help-header">Preparation and Objectives</h1>
    <HelpItem :text="this.helpMessages" />
    <h1 id="mechanics" class="help-content help-bold help-header">Game Mechanics</h1>
    <HelpItem :text="this.helpMessages" />
    <h1 id="how-to-win" class="help-content help-bold help-header">How to Win</h1>
    <HelpItem :text="this.helpMessages" />
  </div>
</div>
</template>

<script>
import Sidebar from '@/components/sidebar.vue'
import HelpItem from '@/components/helpItem.vue'
import helpMessages from '@/resources/helpContent.js'

export default {
  name: 'Help',
  components: {
    Sidebar,
    HelpItem
  },
  data() {
    return {
      helpMessages
    }
  },
  methods: {
    scrollIntoView(event) {
        event.preventDefault()
        const href = event.target.getAttribute('href')
        const el = href ? document.querySelector(href) : null
        if (el) {
          this.$refs.content.scrollTop = el.offsetTop
        }
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

#title {
  padding: 2vh;
  font-family: 'Jura', monospace;
  font-size: 6vh;
  font-weight: bold;
  color: #BCFC8A;
}

.instructions {
  margin-left: 3vw;
  margin-right: 3vw;
}

a.nav-link {
  font-family: 'Raleway', sans-serif;
  font-size: 20px;
  transition: all 0.2s;
  padding: 20px;
  color: #FFFFFF;
}

a.nav-link.active {
  background-color: #C4C4C4;
  border-color: #C4C4C4;
  color: #000000;
}

a.nav-link:hover {
  background-color: #C4C4C4;
  border-color: #C4C4C4;
  color: #000000;
}

#instructions-box {
  position: relative; 
  background-color: #C4C4C4; 
  overflow-y: scroll; 
  height: 75vh;
  padding: 0 30px 30px 30px;
}

.help-content {
  font-family: 'Raleway', sans-serif;
  color: #000000;
  text-align: left;
}

.help-bold {
  font-weight: 700;
}

.help-header {
  padding: 50px 0
}
</style>