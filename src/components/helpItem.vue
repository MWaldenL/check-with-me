<template>
  <b-row v-if="!text">
    <b-col class="help-image-wrapper">
      <img  v-for="(_img, index) in img" class="help-image-lrg" :key="index" :src="_img">
    </b-col>
  </b-row>

  <b-row v-else-if="!img">
    <b-col cols="8" class="help-content help-text">
      <p>
        <span class="help-bold" v-if="head">{{ head }}</span>{{ text }}
      </p>
    </b-col>
    <b-col></b-col>
  </b-row>

  <b-row v-else>
    <b-col cols="8" class="help-content help-text">
      <p>
        <span class="help-bold" v-if="head">{{ head }}</span>{{ text }}
      </p>
    </b-col>
    <b-col class="help-image-wrapper">
      <img  v-for="(_img, index) in img" class="help-image" :key="index" :src="_img">
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
  max-width: 250px;
  margin: 40px;
}

.help-image-lrg {
  max-width: 500px;
  margin: 40px;
}
</style>
