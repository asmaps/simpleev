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
    this.periodic()
    this.intervals.push(setInterval(this.periodic, 2000))
    if (window.bluetoothSerial) {
      window.bluetoothSerial.unsubscribe()
      window.bluetoothSerial.subscribe('>', this.dataReceived, this.dataError)
    }
  },
  beforeDestroy () {
    if (window.bluetoothSerial) {
      window.bluetoothSerial.unsubscribe()
    }
    this.intervals.forEach(t => clearInterval(t))
  },
  watch: {
    'settings.carType': {
      handler (val) {
        if (val) {
          Vue.component(val, () => import('components/cars/' + val + '.vue'))
          this.moduleLoaded = true
        } else {
          this.$q.notify({
            message: this.$t('car.noCarSelected'),
            type: 'warning',
          })
        }
      },
      immediate: true
    },
    bluetoothConnected (val) {
      this.$root.$emit('bluetoothConnectionStateChanged', val)
      if (val) {
        this.$q.notify({
          type: 'positive',
          message: this.$t('car.bluetoothConnected')
        })
      } else {
        this.$q.notify({
          type: 'negative',
          message: this.$t('car.bluetoothDisconnected')
        })
      }
    },
  },
  methods: {
    periodic () {
      if (window.bluetoothSerial) {
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
          }
        )
      }
    },
    dataReceived (data) {
      console.debug({dataReceived: data})
      this.$root.$emit('bluetoothDataReceived', data)
    },
    dataError (error) {
      console.debug({subscribeError: error})
      this.$root.$emit('bluetoothDataError', error)
    },
  },
}
</script>

<style>
</style>
