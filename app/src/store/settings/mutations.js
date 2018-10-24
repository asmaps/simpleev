import { LocalStorage } from 'quasar'
import Vue from 'vue'

export function update (state, settings) {
  for (let [k, v] of Object.entries(settings)) {
    Vue.set(state, k, v)
  }
  LocalStorage.set('settings', state)
}
