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
    <b-row>
      <b-col cols="8" class="help-content help-text">
        <p>
          <span class="help-bold">King Movement. </span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
          laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in 
          voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat 
          non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </b-col>
      <b-col class="help-image-wrapper">
        <img class="help-image" src="../../public/assets/gif1.gif">
      </b-col>
    </b-row>
    <h1 id="prep-objective" class="help-content help-bold help-header">Preparation and Objectives</h1>
    <b-row>
      <b-col cols="8" class="help-content help-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in 
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat 
        non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </b-col>
      <b-col class="help-image-wrapper">
        <img class="help-image" src="../../public/assets/gif1.gif">
      </b-col>
    </b-row>
    <h1 id="mechanics" class="help-content help-bold help-header">Game Mechanics</h1>
    <b-row>
      <b-col cols="8" class="help-content help-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in 
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat 
        non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </b-col>
      <b-col class="help-image-wrapper">
        <img class="help-image" src="../../public/assets/gif1.gif">
      </b-col>
    </b-row>
    <h1 id="how-to-win" class="help-content help-bold help-header">How to Win</h1>
    <b-row>
      <b-col cols="8" class="help-content help-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in 
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat 
        non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </b-col>
      <b-col class="help-image-wrapper">
        <img class="help-image" src="../../public/assets/gif1.gif">
      </b-col>
    </b-row>
  </div>
</div>
</template>

<script>
import Sidebar from '@/components/sidebar.vue'

export default {
  name: 'Profile',
  components: {
    Sidebar,
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
  height: 78vh;
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

.help-text {
  font-size: 25px;
  display: flex;
  align-items: center;
}

.help-image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.help-image {
  max-width: 300px;
  margin: 20px;
}
</style>