/* global console: false */

export default (tag, value) => {
  // eslint-disable-next-line no-console
  console.log(`${tag} %s\n`, value)
  return value
}
