const FTSQuery = require('./FTSQuery')

module.exports.tests = {}

module.exports.tests.constructor = (test) => {
  test('constructor: empty', (t) => {
    let q = new FTSQuery()
    t.equals(q.text, '')
    t.deepEquals(q.settings, {})
    t.end()
  })
  test('constructor: text only', (t) => {
    let q = new FTSQuery('text')
    t.equals(q.text, 'text')
    t.deepEquals(q.settings, {})
    t.end()
  })
  test('constructor: settings only', (t) => {
    let q = new FTSQuery(undefined, { foo: 'foo' })
    t.equals(q.text, '')
    t.deepEquals(q.settings, { foo: 'foo' })
    t.end()
  })
  test('constructor: text and settings', (t) => {
    let q = new FTSQuery('text', { foo: 'foo' })
    t.equals(q.text, 'text')
    t.deepEquals(q.settings, { foo: 'foo' })
    t.end()
  })
}

module.exports.tests.toString = (test) => {
  test('toString - empty', (t) => {
    let q = new FTSQuery()
    t.equals(q.toString(), '')
    t.end()
  })
  test('toString - empty', (t) => {
    let q = new FTSQuery('\n\t \t\n')
    t.equals(q.toString(), '')
    t.end()
  })
  test('toString - quoted', (t) => {
    let q = new FTSQuery('example query')
    t.equals(q.toString(), '^ "example query"')
    t.end()
  })
  test('toString - no wildcards', (t) => {
    let q = new FTSQuery('example query', { wildcard: { start: false, end: false } })
    t.equals(q.toString(), '^ "example query"')
    t.end()
  })
  test('toString - both wildcards', (t) => {
    let q = new FTSQuery('example query', { wildcard: { start: true, end: true } })
    t.equals(q.toString(), '"example query" *')
    t.end()
  })
  test('toString - wildcard start only', (t) => {
    let q = new FTSQuery('example query', { wildcard: { start: true, end: false } })
    t.equals(q.toString(), '"example query"')
    t.end()
  })
  test('toString - wildcard end only', (t) => {
    let q = new FTSQuery('example query', { wildcard: { start: false, end: true } })
    t.equals(q.toString(), '^ "example query" *')
    t.end()
  })
}

module.exports.all = (tape) => {
  function test (name, testFunction) {
    return tape(`FTSQuery: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test)
  }
}
