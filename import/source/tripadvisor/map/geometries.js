const _ = require('lodash')
const wkx = require('wkx')
const format = require('../../../format')
const Geometry = require('../../../../model/Geometry')
const radius = require('../config/radius')

const turf = {
  point: require('turf-point'),
  buffer: require('@turf/buffer')
}

function mapper (place, doc) {
  let lon = parseFloat(_.get(doc, 'longitude'))
  let lat = parseFloat(_.get(doc, 'latitude'))

  if (_.isNumber(lat) && !isNaN(lat) && _.isNumber(lon) && !isNaN(lon)) {
    // add a explicit centroid geometry so that one
    // does not need to be calculated.
    place.addGeometry(new Geometry(
      wkx.Geometry.parse(`POINT(${lon} ${lat})`),
      'centroid'
    ))

    // select a buffer radius based on ontology
    const rad = radius(place)

    // buffer POINT to a create a POLYGON
    var point = turf.point([lon, lat])
    var buffered = turf.buffer(point, rad, { units: 'degrees', steps: 8 })
    place.addGeometry(new Geometry(
      format.from('geometry', 'geojson', buffered.geometry),
      'buffer'
    ))
  }
}

module.exports = mapper
