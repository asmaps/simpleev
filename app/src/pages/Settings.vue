<template>
  <q-page padding>
    <q-field :label="$t('settings.device')">
      <q-select v-model="device"
                dark
                :options="deviceOptions">
      </q-select>
    </q-field>
    <q-field :label="$t('settings.carType')">
      <q-select v-model="carType"
                dark
                :options="carTypeOptions">
      </q-select>
    </q-field>
    <q-field :label="$t('settings.keepAwake')">
      <q-btn-toggle v-model="keepAwake"
                    dark
                    :options="[
                    {label: $t('yes'), value: true},
                    {label: $t('no'), value: false},
                    ]" />
    </q-field>
    <q-field :label="$t('settings.trackLocation')">
      <q-btn-toggle v-model="trackLocation"
                    dark
                    :options="[
                    {label: $t('yes'), value: true},
                    {label: $t('no'), value: false},
                    ]" />
    </q-field>
    <q-field :label="$t('settings.syncEVNotify')">
      <q-btn-toggle v-model="syncEVNotify"
                    dark
                    :options="[
                    {label: $t('yes'), value: true},
                    {label: $t('no'), value: false},
                    ]" />
    </q-field>
    <q-slide-transition>
      <div v-if="syncEVNotify">
        <q-field :label="$t('settings.evnotifyAkey')">
          <q-input v-model="evnotifyAkey" dark>
          </q-input>
        </q-field>
        <q-field :label="$t('settings.evnotifyToken')">
          <q-input v-model="evnotifyToken" dark>
          </q-input>
        </q-field>
      </div>
    </q-slide-transition>
    <div v-if="false"><pre>{{ JSON.stringify(settings, null, 2) }}</pre></div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      enabledCarsTypes: ['ampera-e', 'ioniq-bev', 'debug'],
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
    syncEVNotify: {
      get () {
        return this.settings.syncEVNotify || false
      },
      set (val) {
        this.$store.commit('settings/update', {syncEVNotify: val})
      }
    },
    evnotifyAkey: {
      get () {
        return this.settings.evnotifyAkey || ''
      },
      set (val) {
        this.$store.commit('settings/update', {evnotifyAkey: val})
      }
    },
    evnotifyToken: {
      get () {
        return this.settings.evnotifyToken || ''
      },
      set (val) {
        this.$store.commit('settings/update', {evnotifyToken: val})
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
    if (window.bluetoothSerial) {
      window.bluetoothSerial.list(
        devices => {
          this.pairedDevices = devices
        },
        error => this.$q.notify({message: this.$t('settings.errorListBluetooth') + error, type: 'negative'})
      )
    }
  }
}
</script>

<style>
</style>
