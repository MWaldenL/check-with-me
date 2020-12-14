<template>
  <div>
    <Grid />
    <ResultModal />
  </div>
</template>

<script>
import Grid from '@/components/grid.vue'
import ResultModal from '@/components/resultModal.vue'

export default {
  name: 'Home',
  components: {
    Grid,
    ResultModal
  }
}
</script>