const _ = require('lodash')
const placetypes = require('../config/placetypes.json')
const Identity = require('../../../../model/Identity')
const Ontology = require('../../../../model/Ontology')
const Place = require('../../../../model/Place')

const map = {
  properties: require('./properties'),
  names: require('./names'),
  hierarchies: require('./hierarchies'),
  geometries: require('./geometries')
}

function mapper (doc) {
  const placetypeid = _.get(doc, 'placetypeid')
  const placetype = _.get(placetypes, placetypeid)

  let ontologyClass = 'venue'
  if (_.get(placetype, 'is_geographic', false) === true) {
    ontologyClass = 'geographic'
  } else if (_.get(placetype, 'is_virtual', false) === true) {
    ontologyClass = 'virtual'
  } else if (_.get(placetype, 'is_broad', false) === true) {
    ontologyClass = 'broad'
  }

  // skip non-geographic records
  // if (ontologyClass !== 'geographic') { return null }

  // instantiate a new place
  const place = new Place(
    new Identity('trip', _.get(doc, 'id')),
    new Ontology(ontologyClass, _.get(placetype, 'name', 'unknown'))
  )

  // run mappers
  map.properties(place, doc)
  map.names(place, doc)
  map.hierarchies(place, doc)
  map.geometries(place, doc)

  return place
}

module.exports = mapper
