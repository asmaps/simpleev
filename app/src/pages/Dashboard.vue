<template>
  <q-page padding>
    <div class="group">
    <span v-for="[k, v] of Object.entries(values)" :key="k" v-if="Number.isFinite(v)">
      <strong>{{ k }}</strong>: {{ v.toFixed(1) }}
    </span>
    </div>
    <q-input v-model="mandata" :after="[{icon: 'fas fa-paper-plane', handler: triggerManSend}]"/>
    <div v-for="(line, idx) of lines" :key="idx">
      {{ line.dir}}: {{ line.val }}
    </div>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  data () {
    return {
      lines: [],
      mandata: '',
    }
  },
  computed: {
    values () {
      return this.$store.state.car.values
    }
  },
  created () {
    this.$root.$on('analyzedData', data => this.lines.unshift({dir: 'anal', val: data}))
    this.$root.$on('interpretedData', data => this.lines.unshift({dir: 'means', val: data}))
    this.$root.$on('recvData', data => this.lines.unshift({dir: 'recv', val: data}))
    this.$root.$on('sendData', data => this.lines.unshift({dir: 'send', val: data}))
  },
  methods: {
    triggerManSend () {
      this.$root.$emit('manSendData', this.mandata)
      this.mandata = ''
    },
  }
}
</script>
