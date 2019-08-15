const Place = require('../../../../model/Place')
const Identity = require('../../../../model/Identity')
const Ontology = require('../../../../model/Ontology')
const map = require('./hierarchies')

module.exports.tests = {}

const fixture = {
  municipality: {
    identity: new Identity('trip', '1400479'),
    ontology: new Ontology('geographic', 'municipality')
  },
  province: {
    identity: new Identity('trip', '2339869'),
    ontology: new Ontology('geographic', 'province')
  }
}

module.exports.tests.mapper = (test) => {
  test('mapper: properties empty', (t) => {
    let p = new Place(fixture.municipality.identity, fixture.municipality.ontology)
    map(p, {})

    t.equals(p.hierarchy.length, 0)
    t.end()
  })
  test('mapper: navigationstring empty', (t) => {
    let p = new Place(fixture.municipality.identity, fixture.municipality.ontology)
    map(p, { 'navigationstring': '' })

    t.equals(p.hierarchy.length, 0)
    t.end()
  })
  test('mapper: navigationstring contains self-reference', (t) => {
    let p = new Place(fixture.municipality.identity, fixture.municipality.ontology)
    map(p, {
      'navigationstring': '4:10000:Europe|187768:10001:Italy|187811:10009:Friuli Venezia Giulia|2339869:10020:Province of Pordenone|1400479:10015:Budoia'
    })

    t.equals(p.hierarchy.length, 1)
    t.equals(p.hierarchy[0].child, fixture.municipality.identity)
    t.equals(p.hierarchy[0].parent.source, fixture.province.identity.source)
    t.equals(p.hierarchy[0].parent.id, '2339869')
    t.equals(p.hierarchy[0].branch, 'trip:nav')
    t.end()
  })
  test('mapper: navigationstring no self-reference', (t) => {
    let p = new Place(fixture.municipality.identity, fixture.municipality.ontology)
    map(p, {
      'navigationstring': '4:10000:Europe|187768:10001:Italy|187811:10009:Friuli Venezia Giulia|2339869:10020:Province of Pordenone'
    })

    t.equals(p.hierarchy.length, 1)
    t.equals(p.hierarchy[0].child, fixture.municipality.identity)
    t.equals(p.hierarchy[0].parent.source, fixture.province.identity.source)
    t.equals(p.hierarchy[0].parent.id, '2339869')
    t.equals(p.hierarchy[0].branch, 'trip:nav')
    t.end()
  })
  test('mapper: navigationstring only self-reference', (t) => {
    let p = new Place(fixture.municipality.identity, fixture.municipality.ontology)
    map(p, {
      'navigationstring': '1400479:10015:Budoia'
    })

    t.equals(p.hierarchy.length, 0)
    t.end()
  })
}

module.exports.all = (tape) => {
  function test (hierarchy, testFunction) {
    return tape(`hierarchies: ${hierarchy}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test)
  }
}
