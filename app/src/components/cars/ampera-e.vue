<template>
  <div></div>
</template>

<script>
export default {
  props: {
    bluetoothConnected: Boolean,
  },
  data () {
    return {
      initCMD: ['ATD', 'ATZ', 'ATE0', 'ATL0', 'ATS0', 'ATH1', 'ATSP0', 'AT0', 'ATSTFF', 'ATFE', 'ATSP6'],
      initStep: 0,
      command: '015B',
      updateFrequency: 5000,
      intervals: [],
      values: {},
    }
  },
  created () {
    console.log('Ampera-e module created')
    this.$root.$on('bluetoothDataReceived', this.handleData)
    this.$root.$on('manSendData', this.sendData)
  },
  beforeDestroy () {
    console.log('Ampera-e module before destroy')
    this.intervals.forEach(t => clearInterval(t))
  },
  watch: {
    bluetoothConnected: {
      handler (val) {
        if (val) {
          this.initCommunication()
        }
      },
      immediate: true,
    }
  },
  computed: {
  },
  methods: {
    handleData (data) {
      this.$root.$emit('recvData', data)
      if (this.initStep < this.initCMD.length) {
        // initialize comm
        this.initCommunication()
      } else if (this.initStep === this.initCMD.length) {
        // start periodic data requests
        this.initStep++
        this.intervals.push(setInterval(this.periodic, this.updateFrequency))
      } else {
        data = data.trim('> ')
        data.split('\r').forEach(d => this.evaluateData(this.splitData(d)))
      }
    },
    initCommunication () {
      this.sendData(this.initCMD[this.initStep++])
    },
    sendData (data) {
      this.$root.$emit('sendData', data)
      window.bluetoothSerial.write(data + '\r')
    },
    periodic () {
      // get SoC
      // this.sendData('015B')

      // get voltage
      // this.sendData('22432D')
    },
    splitData (data) {
      // 7E803415BDB>
      if (typeof data !== 'string') {
        console.error('Invalid data type', data)
        return
      }
      if (data.length < 10) {
        console.error('Invalid data length', data)
        return
      }
      let out = {}
      out.from = data.substr(0, 3)
      out.bytes = parseInt(data.substr(4, 1))
      out.data = data.substr(5, out.bytes * 2)

      return out
    },
    evaluateData (splitData) {
      console.log({splitData})
      if (!splitData) {
        return
      }
      let res = ''
      if (splitData.data.startsWith('415B')) {
        // 015B = SoC
        let val = (parseInt(splitData.data.substr(4, 2), 16) * 100 / 255)
        res = `SoC: ${val.toFixed(1)}%`
        this.values.soc = val
      } else if (splitData.data.startsWith('622429')) {
        // 222429 = Voltage
        let val = this.$utils.parseSigned(splitData.data.substr(6, 4)) / 64
        res = `DC Voltage: ${val.toFixed(1)}V`
        this.values.dc_voltage = val
      } else if (splitData.data.startsWith('622414')) {
        // 222414 = Current
        let val = this.$utils.parseSigned(splitData.data.substr(6, 4)) / 20
        res = `DC Current: ${val.toFixed(1)}V`
        this.values.dc_current = val
      } else {
        res = `${splitData.data} from ${splitData.id}`
      }
      this.$root.$emit('analyzedData', res)
    }
  },
}
</script>

<style>
</style>
