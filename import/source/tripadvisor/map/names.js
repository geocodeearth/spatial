const _ = require('lodash')
const Name = require('../../../../model/Name')

function mapper (place, doc) {
  // generic names
  place.addName(new Name('und', 'default', false, _.get(doc, 'primaryname', '').trim()))
}

module.exports = mapper
