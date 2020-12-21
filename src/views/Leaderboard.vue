<template>
  <div id = 'LeaderboardPage'>
    <Sidebar />
    <h3>Leaderboard</h3>
    <div class="LeaderboardList">
      <ul>
        <li class='ColumnNames'>

        </li>
        <li class='leaderEntry' v-for="leader in leaders" :key="leader['.key']">
          {{ leader.username }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import { db } from '@/firebase'
import Sidebar from '@/components/sidebar.vue'

export default {
  name: 'Leaderboard',
  components: {
    Sidebar
  }
}
</script>

<style>

</style>