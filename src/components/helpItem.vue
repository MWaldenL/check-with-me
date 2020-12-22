<template>
  <b-row v-if="!text && !list" class="help-row">
    <b-col class="help-image-wrapper">
      <img  v-for="(_img, index) in img" class="help-image-lrg" :key="index" :src="_img">
    </b-col>
  </b-row>

  <b-row v-else-if="!img && !list" class="help-row">
    <b-col cols="8" class="help-content help-text">
      <div>
        <span class="help-bold" v-if="head">{{ head }}<br></span>{{ text }}
      </div>
    </b-col>
    <b-col></b-col>
  </b-row>

  <b-row v-else-if="list" class="help-row">
    <b-col cols="8" class="help-content help-text">
      <ul>
        <li v-for="(_item, index) in list" :key="index">{{ _item }}</li>
      </ul>
    </b-col>
    <b-col></b-col>
  </b-row>

  <b-row v-else class="help-row">
    <b-col cols="8" class="help-content help-text help-text-img">
      <div>
        <span class="help-bold" v-if="head">{{ head }}<br></span>{{ text }}
      </div>
    </b-col>
    <b-col class="help-image-wrapper">
      <img class="help-image" :src="img">
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'HelpItem'  ,
  props: ['head', 'text', 'img', 'list']
}
</script>

<style scoped>
.help-row {
  margin-top: 40px;
}

.help-content {
  font-family: 'Raleway', sans-serif;
  color: #000000;
  text-align: left;
}

.help-bold {
  font-weight: 700;
}

.help-text {
  font-size: 25px;
  display: flex;
  align-items: center;
}

.help-text-img {
  height: 250px;
}

.help-image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.help-image {
  max-width: 250px;
}

.help-image-lrg {
  max-width: 350px;
  margin: 0 25px 0 25px;
}
</style>
