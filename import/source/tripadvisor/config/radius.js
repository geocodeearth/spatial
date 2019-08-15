// function returns the preferred buffer radius for a placetype
const _ = require('lodash')

function radius (place) {
  const _class = _.get(place, 'ontology.class', '').trim().toUpperCase()
  const _type = _.get(place, 'ontology.type', '').trim().toUpperCase()

  // non-geographic places
  if (_class !== 'GEOGRAPHIC') {
    return 0.0001
  }

  switch (_type) {
    case 'COUNTRY': return 10
    case 'REGION': return 0.2
    case 'DISTRICT': return 0.1
    case 'CITY': return 0.05
  }

  return 0.01
}

module.exports = radius
