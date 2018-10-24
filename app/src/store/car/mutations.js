import Vue from 'vue'

export function updateValues (state, values) {
  for (let [k, v] of Object.entries(values)) {
    Vue.set(state.values, k, v)
  }
}
