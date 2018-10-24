<template>
  <div class="text-center">
    <q-icon name="fas fa-sync-alt" :color="iconColorClass" /><br>
    EVN
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      lastState: undefined,
    }
  },
  created () {
    this.$root.$on('newCarValues', this.handleNewValues)
  },
  beforeDestroy () {
    this.$root.$off('newCarValues', this.handleNewValues)
  },
  computed: {
    iconColorClass () {
      if (!this.lastState) {
        return 'warning'
      }
      if (this.lastState >= 200 && this.lastState < 300) {
        return 'positive'
      }
      return 'negative'
    },
    ...mapState({
      values: state => state.car.values,
      settings: state => state.settings,
    }),
  },
  methods: {
    handleNewValues (values) {
      console.log('new Values evnotify connector')
      console.log({values})
    },
  },
}
</script>

<style>
</style>
