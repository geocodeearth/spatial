const Place = require('../../../../model/Place')
const map = require('./place')

module.exports.tests = {}

module.exports.tests.mapper = (test) => {
  test('mapper: properties empty', (t) => {
    let place = map({})
    t.equal(place, null)
    t.end()
  })
  test('mapper: maps identity & ontology', (t) => {
    let place = map({
      properties: {
        '@type': 'relation',
        '@id': '100',
        'place': 'village'
      }
    })
    t.true(place instanceof Place)
    t.equal(place.identity.source, 'osm')
    t.equal(place.identity.id, 'relation:100')
    t.equal(place.ontology.class, 'admin')
    t.equal(place.ontology.type, 'village')
    t.end()
  })
  test('mapper: ontology type -  trim & lowercase', (t) => {
    let place = map({
      properties: {
        '@type': 'relation',
        '@id': '100',
        'place': ' \tViLLage\n'
      }
    })
    t.true(place instanceof Place)
    t.equal(place.identity.source, 'osm')
    t.equal(place.identity.id, 'relation:100')
    t.equal(place.ontology.class, 'admin')
    t.equal(place.ontology.type, 'village')
    t.end()
  })
  test('mapper: ontology type - replace spaces with underscores', (t) => {
    let place = map({
      properties: {
        '@type': 'relation',
        '@id': '100',
        'place': ' \tViLLage  SquAre\n'
      }
    })
    t.true(place instanceof Place)
    t.equal(place.identity.source, 'osm')
    t.equal(place.identity.id, 'relation:100')
    t.equal(place.ontology.class, 'admin')
    t.equal(place.ontology.type, 'village_square')
    t.end()
  })
  test('mapper: maps identity & unknown ontology', (t) => {
    let place = map({
      properties: {
        '@type': 'relation',
        '@id': '100'
      }
    })
    t.true(place instanceof Place)
    t.equal(place.identity.source, 'osm')
    t.equal(place.identity.id, 'relation:100')
    t.equal(place.ontology.class, 'admin')
    t.equal(place.ontology.type, 'unknown')
    t.end()
  })
  test('mapper: derive ontology type from "landuse" tag', (t) => {
    let place = map({
      properties: {
        '@type': 'relation',
        '@id': '100',
        'landuse': 'example_landuse_tag'
      }
    })
    t.true(place instanceof Place)
    t.equal(place.identity.source, 'osm')
    t.equal(place.identity.id, 'relation:100')
    t.equal(place.ontology.class, 'admin')
    t.equal(place.ontology.type, 'example_landuse_tag')
    t.end()
  })
  test('mapper: derive ontology type from "boundary" tag', (t) => {
    let place = map({
      properties: {
        '@type': 'relation',
        '@id': '100',
        'boundary': 'example_boundary_tag'
      }
    })
    t.true(place instanceof Place)
    t.equal(place.identity.source, 'osm')
    t.equal(place.identity.id, 'relation:100')
    t.equal(place.ontology.class, 'admin')
    t.equal(place.ontology.type, 'example_boundary_tag')
    t.end()
  })
  test('mapper: prefer "place" over other tags', (t) => {
    let place = map({
      properties: {
        '@type': 'relation',
        '@id': '100',
        'place': 'example_place_tag',
        'landuse': 'example_landuse_tag',
        'boundary': 'example_boundary_tag'
      }
    })
    t.true(place instanceof Place)
    t.equal(place.identity.source, 'osm')
    t.equal(place.identity.id, 'relation:100')
    t.equal(place.ontology.class, 'admin')
    t.equal(place.ontology.type, 'example_place_tag')
    t.end()
  })
  test('mapper: prefer "landuse" over "boundary"', (t) => {
    let place = map({
      properties: {
        '@type': 'relation',
        '@id': '100',
        'landuse': 'example_landuse_tag',
        'boundary': 'example_boundary_tag'
      }
    })
    t.true(place instanceof Place)
    t.equal(place.identity.source, 'osm')
    t.equal(place.identity.id, 'relation:100')
    t.equal(place.ontology.class, 'admin')
    t.equal(place.ontology.type, 'example_landuse_tag')
    t.end()
  })
  test('mapper: maps geometry', (t) => {
    let place = map({
      properties: {
        '@type': 'relation',
        '@id': '100',
        'place': 'village'
      },
      geometry: require('../../../../test/fixture/geojson.triangle')
    })
    t.true(place instanceof Place)
    t.equal(place.geometry.length, 1)
    t.equal(place.geometry[0].geometry.constructor.name.toUpperCase(), 'POLYGON')
    t.equal(place.geometry[0].role, 'boundary')
    t.end()
  })
}

module.exports.all = (tape) => {
  function test (name, testFunction) {
    return tape(`place: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test)
  }
}