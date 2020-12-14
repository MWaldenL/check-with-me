<template>
  <div id="box">
    <h1 class="statistic-text">{{ title }}</h1>
    <h1 class="statistic-text">{{ value }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Statistic',
  props: ['title', 'value']
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@700&display=swap');

#box {
  background-color: #C4C4C4;
  padding: 1.25vh;
}

.statistic-text {
  font-family: 'Raleway', Arial, Helvetica, sans-serif;
  font-size: 3vh;
  font-weight: 700;
  color: #181818;
}
</style>
