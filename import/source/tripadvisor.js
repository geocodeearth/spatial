const file = require('../file')

module.exports = {
  ingress: file,
  format: 'csv',
  mapper: require('./tripadvisor/map/place')
}
