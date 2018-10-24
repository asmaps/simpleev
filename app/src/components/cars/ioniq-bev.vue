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
      updateFrequency: 2000,
      intervals: [],
      badDataCount: 0,
    }
  },
  created () {
    console.log('Ioniq BEV module created')
    this.$root.$on('bluetoothDataReceived', this.handleData)
    this.$root.$on('manSendData', this.sendData)
  },
  beforeDestroy () {
    console.log('Ioniq BEV module before destroy')
    this.intervals.forEach(t => clearInterval(t))
    this.$root.$off('bluetoothDataReceived', this.handleData)
    this.$root.$off('manSendData', this.sendData)
  },
  computed: {
    values: {
      get () {
        return this.$store.state.car.values
      },
      set (val) {
        this.$store.commit('car/updateValues', val)
      }
    },
  },
  watch: {
    bluetoothConnected: {
      handler (val) {
        if (val) {
          this.initCommunication()
        }
      },
      immediate: true,
    },
  },
  methods: {
    badDataReceived () {
      if (this.initStep > this.initCMD.length) {
        this.badDataCount++
        if (this.badDataCount > 10) {
          this.$q.notify({
            message: this.$t('notify.reinit'),
            type: 'warning',
          })
          this.initStep = 0
          this.initCommunication()
        }
      }
    },
    handleData (data) {
      this.$root.$emit('recvData', data)
      if (this.initStep < this.initCMD.length) {
        // initialize comm
        this.initCommunication()
      } else if (this.initStep === this.initCMD.length) {
        // start periodic data requests
        this.initStep++
        this.periodic()
        this.intervals.push(setInterval(this.periodic, this.updateFrequency))
      } else {
        try {
          data = data.trim('> ')
          this.evaluateData(data.split('\r').map(d => this.splitData(d)))
          this.badDataCount = 0
        } catch (error) {
          console.debug('Error during data handling')
          console.debug({error})
          this.badDataReceived()
        }
      }
    },
    initCommunication () {
      this.sendData(this.initCMD[this.initStep++])
    },
    sendData (data) {
      this.$root.$emit('sendData', data)
      window.bluetoothSerial.write(data + '\r')
    },
    async periodic () {
      this.sendData('2105')
      await this.$utils.asyncDelay(1000)
      this.sendData('2101')
    },
    splitData (data) {
      if (typeof data !== 'string') {
        console.debug('Invalid data type', data)
        this.badDataReceived()
        return
      }
      if (data.length < 10) {
        console.debug('Invalid data length', data)
        this.badDataReceived()
        return
      }
      let out = {}
      out.from = data.substr(0, 3)
      out.blockId = data.substr(3, 2)
      out.data = data.substr(5)

      if (out.from === '7EC') {
        this.$root.$emit('analyzedData', out)
      }

      return out
    },
    evaluateData (splitData) {
      if (!splitData) {
        return
      }
      splitData = splitData.filter(el => el && el.from === '7EC')
      let cmdBlock = splitData.find(el => el.blockId === '10')
      if (!cmdBlock) {
        this.$root.$emit('interpretedData', 'No command block found')
        this.badDataReceived()
        return
      }

      // sort by blockId, remove blockId 10 (command block), chain data bytes
      splitData.sort((a, b) => a.blockId > b.blockId ? 1 : -1)
      let bytes = splitData.filter(el => el.blockId !== '10').reduce((d, el) => d + el.data, '')

      switch (cmdBlock.data) {
        case '3D6101FFFFFFFF':
          this.response2101(bytes)
          break
        case '2D6105FFFFFFFF':
          this.response2105(bytes)
          break
        default:
          this.$root.$emit('interpretedData', 'Invalid command block data: ' + cmdBlock.data)
          this.badDataReceived()
      }
    },
    response2101 (bytes) {
      let parseSigned = this.$utils.parseSigned
      this.$root.$emit('interpretedData', 'Command 2101 registered')

      this.values.socBMS = parseInt(bytes.substr(0, 2), 16) / 2
      this.values.chargebits = parseInt(bytes.substr(10, 2), 16).toString(2).padStart(8, '0')
      this.values.dcCurrent = parseSigned(bytes.substr(12, 4)) * 0.1
      this.values.dcVoltage = parseInt(bytes.substr(16, 4), 16) * 0.1
      this.values.batMaxTemp = parseSigned(bytes.substr(20, 2))
      this.values.batMinTemp = parseSigned(bytes.substr(22, 2))
      this.values.batModule01Temp = parseSigned(bytes.substr(24, 2))
      this.values.batModule02Temp = parseSigned(bytes.substr(26, 2))
      this.values.batModule03Temp = parseSigned(bytes.substr(28, 2))
      this.values.batModule04Temp = parseSigned(bytes.substr(30, 2))
      this.values.batModule05Temp = parseSigned(bytes.substr(32, 2))
      this.values.batInletTemp = parseSigned(bytes.substr(36, 2))
      this.values.maxCellVoltage = parseInt(bytes.substr(38, 2), 16) * 0.02
      this.values.maxCellVoltageNo = parseInt(bytes.substr(40, 2), 16)
      this.values.minCellVoltage = parseInt(bytes.substr(42, 2), 16) * 0.02
      this.values.minCellVoltageNo = parseInt(bytes.substr(44, 2), 16)
      this.values.fanStatus = parseInt(bytes.substr(46, 2), 16)
      this.values.fanSpeed = parseInt(bytes.substr(48, 2), 16)
      this.values.auxBatteryVoltage = parseInt(bytes.substr(50, 2), 16) * 0.1
      this.values.cumulativeChargeEnergy = parseInt(bytes.substr(68, 8), 16) * 0.1
      this.values.cumulativeDischargeEnergy = parseInt(bytes.substr(76, 8), 16) * 0.1
      this.values.cumulativeOperatingTimeHours = parseInt(bytes.substr(84, 8), 16) / 3600

      this.values.dcPower = (this.values.dcCurrent * this.values.dcVoltage) / 1000

      this.$emit('newCarValues', this.values)
    },
    response2105 (bytes) {
      let parseSigned = this.$utils.parseSigned
      this.$root.$emit('interpretedData', 'Command 2105 registered')

      this.values.batModule06Temp = parseSigned(bytes.substr(10, 2))
      this.values.batModule07Temp = parseSigned(bytes.substr(12, 2))
      this.values.batModule08Temp = parseSigned(bytes.substr(14, 2))
      this.values.batModule09Temp = parseSigned(bytes.substr(16, 2))
      this.values.batModule10Temp = parseSigned(bytes.substr(18, 2))
      this.values.batModule11Temp = parseSigned(bytes.substr(20, 2))
      this.values.batModule12Temp = parseSigned(bytes.substr(22, 2))
      this.values.soh = parseInt(bytes.substr(42, 4), 16) * 0.1
      this.values.socDisplay = parseInt(bytes.substr(54, 2), 16) * 0.5

      this.$emit('newCarValues', this.values)
    }
  },
}
</script>

<style>
</style>
