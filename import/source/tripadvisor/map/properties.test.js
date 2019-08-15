const Place = require('../../../../model/Place')
const map = require('./properties')

module.exports.tests = {}

module.exports.tests.mapper = (test) => {
  test('mapper: properties empty', (t) => {
    let p = new Place()
    map(p, {})

    t.equals(p.property.length, 0)
    t.end()
  })
  test('mapper: placetypeid', (t) => {
    let p = new Place()
    map(p, { 'placetypeid': '10015' })

    t.equals(p.property.length, 1)
    t.equals(p.property[0].key, 'trip:placetypeid', 'trip:placetypeid')
    t.equals(p.property[0].value, '10015', 'trip:placetypeid')
    t.end()
  })
  test('mapper: excluded properties', (t) => {
    let p = new Place()
    map(p, {
      'id': '9556686',
      'primaryname': 'Hotel Ambica',
      'placetypeid': '10023',
      'navigationstring': '1:9999:World|2:10000:Asia|293860:10001:India|297619:10003:Jammu and Kashmir|1830829:10009:Jammu|12375003:10013:Jammu District|297620:10004:Jammu City',
      'street1': 'Below Gumet',
      'neighborhoodid': '0',
      'latitude': '32.706920',
      'longitude': '74.853830'
    })

    t.equals(p.property.length, 3)
    t.equals(p.property[0].key, 'trip:placetypeid', 'trip:placetypeid')
    t.equals(p.property[0].value, '10023', 'trip:placetypeid')
    t.equals(p.property[1].key, 'trip:street1', 'trip:street1')
    t.equals(p.property[1].value, 'Below Gumet', 'trip:street1')
    t.equals(p.property[2].key, 'trip:neighborhoodid', 'trip:neighborhoodid')
    t.equals(p.property[2].value, '0', 'trip:neighborhoodid')
    t.end()
  })
}

module.exports.all = (tape) => {
  function test (name, testFunction) {
    return tape(`properties: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test)
  }
}
