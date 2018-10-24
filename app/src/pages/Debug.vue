<template>
  <q-page padding>
    <div class="row gutter-xs justify-between">
      <div v-for="[k, v] of Object.entries(values)" :key="k" class="text-no-wrap">
        <div class="text-no-wrap text-center">
          <strong>{{ k }}</strong><br>
          <span v-if="Number.isFinite(v)">{{ v.toFixed(2) }}</span>
          <span v-else>{{ v }}</span>
        </div>
      </div>
    </div>
    <q-input v-model="mandata"
             dark
             :after="[{icon: 'fas fa-paper-plane', handler: triggerManSend}]"/>
    <div class="scroll">
      <div v-for="(line, idx) of lines" :key="idx">
        {{ line.dir}}: {{ line.val }}
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
      // this.mandata = ''
    },
  }
}
</script>
