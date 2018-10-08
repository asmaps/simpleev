import { LocalStorage } from 'quasar'

export function update (state, settings) {
  state = Object.assign(state, settings)
  LocalStorage.set('settings', state)
}
