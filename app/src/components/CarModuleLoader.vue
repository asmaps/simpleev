<template>
  <div>
    <i class="fab fa-bluetooth-b" :class="iconColorClass"></i>
    <component v-if="moduleLoaded"
               :bluetooth-connected="bluetoothConnected"
               :is="settings.carType"
               ref="carModule"></component>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      intervals: [],
      bluetoothConnected: undefined,
      moduleLoaded: false,
    }
  },
  computed: {
    iconColorClass () {
      if (this.bluetoothConnected === false) {
        return 'text-negative'
      } else if (this.bluetoothConnected === true) {
        return 'text-positive'
      } else {
        return 'text-warning'
      }
    },
    ...mapState({
      settings: state => state.settings,
    })
  },
  created () {
    console.log('Car Module loader created')
    this.intervals.push(setTimeout(this.periodic, 5000))
    window.bluetoothSerial.subscribe('>', this.dataReceived, this.dataError)
  },
  beforeDestroy () {
    window.bluetoothSerial.unsubscribe()
    this.intervals.forEach(t => clearInterval(t))
  },
  watch: {
    'settings.carType': {
      handler (val) {
        if (val) {
          Vue.component(val, () => import('components/cars/' + val + '.vue'))
          this.moduleLoaded = true
        }
      },
      immediate: true
    },
    bluetoothConnected (val) {
      this.$root.$emit('bluetoothConnectionStateChanged', val)
    },
  },
  methods: {
    periodic () {
      window.bluetoothSerial.isConnected(
        () => {
          this.bluetoothConnected = true
        }, () => {
          this.bluetoothConnected = false
          if (this.settings.device) {
            window.bluetoothSerial.connect(
              this.settings.device,
              el => {
                this.bluetoothConnected = true
              },
              error => console.log({bluetoothConnectError: error})
            )
          }
        })
    },
    dataReceived (data) {
      console.log({dataReceived: data})
      this.$root.$emit('bluetoothDataReceived', data)
    },
    dataError (error) {
      console.log({subscribeError: error})
      this.$root.$emit('bluetoothDataError', error)
    },
  },
}
</script>

<style>
</style>
