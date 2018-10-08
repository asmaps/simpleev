function parseSigned (data) {
  let bits = data.length * 4
  return ((parseInt(data, 16) + 2 ** (bits - 1)) % 2 ** bits) - 2 ** (bits - 1)
}

export default ({ Vue }) => {
  Vue.prototype.$utils = {
    parseSigned,
  }
}
