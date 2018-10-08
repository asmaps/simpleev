import { LocalStorage } from 'quasar'

let settings = LocalStorage.get.item('settings') || {}

export default settings
