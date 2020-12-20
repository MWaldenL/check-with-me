<template>
  <b-row v-if="img">
    <b-col cols="8" class="help-content help-text">
      <p>
        <span class="help-bold" v-if="head">King Movement. </span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
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
  <b-row v-else>
    <b-col class="help-content help-text">
      <p>
        <span class="help-bold" v-if="head">{{ head }}</span>{{ text }}
      </p>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'HelpItem'  ,
  props: ['head', 'text', 'img']
}
</script>

<style scoped>
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
