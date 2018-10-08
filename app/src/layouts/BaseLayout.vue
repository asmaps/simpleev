<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header reveal>
      <q-toolbar
        color="primary"
        class="group"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="$router.push({name: 'dashboard'})"
          aria-label="Dashboard"
        >
          <q-icon name="fas fa-home" />
        </q-btn>

        <q-toolbar-title>
          {{ $t('title.' + $route.name) }}<span slot="subtitle">Simple EV</span>
        </q-toolbar-title>

        <car-module-loader />
        <location-tracker v-if="settings.trackLocation" />
        <q-btn
          flat
          dense
          round
          @click="$router.push({name: 'settings'})"
          aria-label="Settings"
        >
          <q-icon name="fas fa-cog" />
        </q-btn>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      v-if="false"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>{{ $t('nav.navigation') }}</q-list-header>
        <q-item :to="{name: 'dashboard'}" exact>
          <q-item-side icon="fas fa-home" />
          <q-item-main :label="$t('nav.home')" />
        </q-item>
        <q-item :to="{name: 'settings'}">
          <q-item-side icon="fas fa-cogs" />
          <q-item-main :label="$t('nav.settings')" />
        </q-item>
        <q-list-header>{{ $t('nav.externalLinks') }}</q-list-header>
        <q-item @click.native="openURL('https://github.com/asmaps/simpleev/')">
          <q-item-side icon="fas fa-code" />
          <q-item-main :label="$t('nav.github')" sublabel="github.com/asmaps/simpleev" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import CarModuleLoader from 'components/CarModuleLoader'
import LocationTracker from 'components/LocationTracker'
import { mapState } from 'vuex'

export default {
  components: {
    CarModuleLoader,
    LocationTracker,
  },
  data () {
    return {
      leftDrawerOpen: false,
    }
  },
  computed: mapState({
    settings: state => state.settings,
  }),
  watch: {
    'settings.keepAwake': {
      handler (val) {
        if (val) {
          window.plugins.insomnia.keepAwake()
        } else {
          window.plugins.insomnia.allowSleepAgain()
        }
      },
      immediate: true,
    },
  },
  created () {
    if (this.$q.fullscreen.isCapable && !this.$q.fullscreen.isActive) {
      this.$q.fullscreen.request()
    }
  },
  beforeDestroy () {
    window.plugins.insomnia.allowSleepAgain()
  },
  methods: {
    openURL
  }
}
</script>

<style>
</style>
