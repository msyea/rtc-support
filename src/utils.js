const encodeToken = obj => {
  let str = btoa(JSON.stringify(obj))
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
const decodeToken = str => {
  str = str.replace(/\-/g, '+').replace(/_/g, '/') + '=='.substring(0, (3 * str.length) % 4);
  return JSON.parse(atob(str))
}

module.exports = {
  encodeToken,
  decodeToken
}