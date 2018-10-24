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
      intervals: [],
    }
  },
  created () {
    console.log('debug module created')
    this.intervals.push(setInterval(this.periodic, 5000))
  },
  beforeDestroy () {
    console.log('debug module before destroy')
    this.intervals.forEach(t => clearInterval(t))
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
  methods: {
    async periodic () {
      this.values.socBMS = Math.random() * 100
      this.values.chargebits = Math.random() * 100
      this.values.dcCurrent = Math.random() * 100
      this.values.dcVoltage = Math.random() * 100 + 320
      this.values.dcPower = (this.values.dcCurrent * this.values.dcVoltage) / 1000
      this.values.batMaxTemp = Math.random() * 50
      this.values.batMinTemp = this.values.batMaxTemp - Math.random() * 7
      this.values.batModule01Temp = Math.random() * 50
      this.values.batModule02Temp = Math.random() * 50
      this.values.batModule03Temp = Math.random() * 50
      this.values.batModule04Temp = Math.random() * 50
      this.values.batModule05Temp = Math.random() * 50
      this.values.batInletTemp = Math.random() * 50
      this.values.maxCellVoltage = Math.random() + 3.5
      this.values.maxCellVoltageNo = Math.random() * 12
      this.values.minCellVoltage = Math.random() + 3.5
      this.values.minCellVoltageNo = Math.random() * 12
      this.values.fanStatus = Math.random() * 9
      this.values.fanSpeed = Math.random() * 9
      this.values.auxBatteryVoltage = Math.random() * 10.5 + 4
      this.values.cumulativeChargeEnergy = Math.random() * 1000
      this.values.cumulativeDischargeEnergy = Math.random() * 1000
      this.values.cumulativeOperatingTimeHours = Math.random() * 1000
      this.values.batModule06Temp = Math.random() * 50
      this.values.batModule07Temp = Math.random() * 50
      this.values.batModule08Temp = Math.random() * 50
      this.values.batModule09Temp = Math.random() * 50
      this.values.batModule10Temp = Math.random() * 50
      this.values.batModule11Temp = Math.random() * 50
      this.values.batModule12Temp = Math.random() * 50
      this.values.soh = Math.random() * 70 + 100
      this.values.socDisplay = Math.random() * 100

      this.$root.$emit('newCarValues', this.values)
    },
  },
}
</script>

<style>
</style>
