<template>
  <q-page padding>
    <div class="row gutter-sm justify-around">
      <div v-if="values.dcPower">
        <q-card class="text-center">
          <q-card-main class="bg-blue-grey-10 q-display-1">{{ values.dcPower.toFixed(2) }} kW</q-card-main>
          <q-card-main class="bg-blue-grey q-headline">{{ $t('dashboard.dcPower') }}</q-card-main>
        </q-card>
      </div>
      <div v-if="values.socDisplay">
        <q-card class="text-center">
          <q-card-main class="bg-blue-grey-10 q-display-1">{{ values.socDisplay.toFixed(1) }} %</q-card-main>
          <q-card-main class="bg-blue-grey q-headline">{{ $t('dashboard.socDisplay') }}</q-card-main>
        </q-card>
      </div>
      <div v-if="values.dcCurrent">
        <q-card class="text-center">
          <q-card-main class="bg-blue-grey-10 q-display-1">{{ values.dcCurrent.toFixed(1) }} A</q-card-main>
          <q-card-main class="bg-blue-grey q-headline">{{ $t('dashboard.dcCurrent') }}</q-card-main>
        </q-card>
      </div>
      <div v-if="values.dcVoltage">
        <q-card class="text-center">
          <q-card-main class="bg-blue-grey-10 q-display-1">{{ values.dcVoltage.toFixed(1) }} V</q-card-main>
          <q-card-main class="bg-blue-grey q-headline">{{ $t('dashboard.dcVoltage') }}</q-card-main>
        </q-card>
      </div>
      <div v-if="batAvgTemp">
        <q-card class="text-center">
          <q-card-main class="bg-blue-grey-10 q-display-1">{{ batAvgTemp }} °C</q-card-main>
          <q-card-main class="bg-blue-grey q-headline">{{ $t('dashboard.batAvgTemp') }}</q-card-main>
        </q-card>
      </div>
      <div v-if="values.auxBatteryVoltage">
        <q-card class="text-center">
          <q-card-main class="bg-blue-grey-10 q-display-1">{{ values.auxBatteryVoltage.toFixed(1) }} V</q-card-main>
          <q-card-main class="bg-blue-grey q-headline">{{ $t('dashboard.auxBatteryVoltage') }}</q-card-main>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    values () {
      return this.$store.state.car.values
    },
    batAvgTemp () {
      let sum = 0,
        count = 0

      for (let [k, v] of Object.entries(this.values)) {
        if (/batModule\d+Temp/.exec(k)) {
          sum += v
          count++
        }
      }

      if (count === 0) {
        return '??'
      }

      return (sum / count).toFixed(1)
    },
  },
  methods: {
  }
}
</script>
