<template>
  <div id = "RoomPage">
    This is a Room
  </div>
</template>

<script>
import Sidebar from '@/components/sidebar.vue'

export default {
  name: 'Room',
  components: {
    Sidebar
  }
}
</script>

<style scoped>
  #RoomPage {
    color: white;
    font-size: 3em;
  }
</style>