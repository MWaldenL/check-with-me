<template>
  <div id="box">
    <Sidebar />
  </div>
</template>

<script>
import Sidebar from '@/components/sidebar.vue'

export default {
  name: 'ChangePassword',
  components: {
    Sidebar
  }
}
</script>

<style scoped>
#box {
  position: relative;
  margin-top: 10px;
}
</style>