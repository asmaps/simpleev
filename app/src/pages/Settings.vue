<template>
  <q-page padding>
    <q-field :label="$t('settings.device')">
      <q-select v-model="device"
                :options="deviceOptions">
      </q-select>
    </q-field>
    <q-field :label="$t('settings.carType')">
      <q-select v-model="carType"
                :options="carTypeOptions">
      </q-select>
    </q-field>
    <q-field :label="$t('settings.keepAwake')">
      <q-btn-toggle v-model="keepAwake"
                    :options="[
                    {label: $t('yes'), value: true},
                    {label: $t('no'), value: false},
                    ]" />
    </q-field>
    <q-field :label="$t('settings.trackLocation')">
      <q-btn-toggle v-model="trackLocation"
                    :options="[
                    {label: $t('yes'), value: true},
                    {label: $t('no'), value: false},
                    ]" />
    </q-field>
    <div><pre>{{ JSON.stringify(settings, null, 2) }}</pre></div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      enabledCarsTypes: ['ampera-e', 'ioniq-bev'],
      pairedDevices: [],
      listError: undefined,
    }
  },
  computed: {
    device: {
      get () {
        return this.settings.device
      },
      set (val) {
        this.$store.commit('settings/update', {device: val})
      }
    },
    keepAwake: {
      get () {
        return this.settings.keepAwake || false
      },
      set (val) {
        this.$store.commit('settings/update', {keepAwake: val})
      }
    },
    carType: {
      get () {
        return this.settings.carType
      },
      set (val) {
        this.$store.commit('settings/update', {carType: val})
      }
    },
    trackLocation: {
      get () {
        return this.settings.trackLocation || false
      },
      set (val) {
        this.$store.commit('settings/update', {trackLocation: val})
      }
    },
    settings () {
      return this.$store.state.settings
    },
    carTypeOptions () {
      return this.enabledCarsTypes.map(el => ({value: el, label: this.$t('car.' + el)}))
    },
    deviceOptions () {
      return this.pairedDevices.map(el => ({value: el.address, label: el.name}))
    },
  },
  mounted () {
    window.bluetoothSerial.list(
      devices => { this.pairedDevices = devices },
      error => this.$q.notify({message: this.$t('settings.errorListBluetooth') + error, type: 'negative'})
    )
  }
}
</script>

<style>
</style>
