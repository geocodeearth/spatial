const _ = require('lodash')
const Property = require('../../../../model/Property')

function mapper (place, doc) {
  // trip-specific properties
  const picked = _.pickBy(doc, (val, key) => {
    if (key === 'id') { return false }
    if (key === 'primaryname') { return false }
    if (key === 'navigationstring') { return false }
    if (key === 'latitude') { return false }
    if (key === 'longitude') { return false }
    return true
  })
  for (let key in picked) {
    let val = picked[key]
    if (typeof val.toString === 'function') { val = val.toString() }
    place.addProperty(new Property(`trip:${key}`, val))
  }
}

module.exports = mapper
