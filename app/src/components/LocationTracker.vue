<template>
  <div>
    <i class="fas fa-map-marker-alt" :class="iconColorClass"></i>
  </div>
</template>

<script>
export default {
  data () {
    return {
      state: undefined,
    }
  },
  created () {
    this.locationWatcher = navigator.geolocation.watchPosition(
      this.handleNewPosition,
      this.handlePositionError,
      {enableHighAccuracy: true}
    )
  },
  computed: {
    iconColorClass () {
      if (this.state === false) {
        return 'text-negative'
      } else if (this.state === true) {
        return 'text-positive'
      } else {
        return 'text-warning'
      }
    },
    values: {
      get () {
        return this.$store.state.car.values
      },
      set (val) {
        this.$store.commit('car/updateValues', val)
      }
    },
  },
  methods: {
    handleNewPosition (position) {
      console.log({newPosition: position})
      this.state = true
      this.values.location = position
    },
    handlePositionError (error) {
      console.log({error})
      this.state = false
      this.$q.notify({
        type: 'negative',
        message: `${this.$t('location.error')}: ${error.message}`,
      })
    },
  },
}
</script>

<style>
</style>
