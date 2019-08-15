const Place = require('../../../../model/Place')
const Geometry = require('../../../../model/Geometry')
const map = require('./geometries')

module.exports.tests = {}

module.exports.tests.mapper = (test) => {
  test('mapper: geometry empty', (t) => {
    let p = new Place()
    map(p, {})

    t.equals(p.geometry.length, 0)
    t.end()
  })
  test('mapper: centroid', (t) => {
    let p = new Place()
    map(p, {
      'longitude': 1.1,
      'latitude': 2.2
    })
    t.equals(p.geometry.length, 2)
    t.true(p.geometry[0] instanceof Geometry)
    t.equal(p.geometry[0].geometry.constructor.name.toUpperCase(), 'POINT')
    t.equal(p.geometry[0].role, 'centroid')
    t.true(p.geometry[1] instanceof Geometry)
    t.equal(p.geometry[1].geometry.constructor.name.toUpperCase(), 'POLYGON')
    t.equal(p.geometry[1].role, 'buffer')
    t.end()
  })
}

module.exports.all = (tape) => {
  function test (name, testFunction) {
    return tape(`geometries: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test)
  }
}
