const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableShard = require('./TableShard')
const IndexCovering = require('./IndexCovering')

module.exports.tests = {}

module.exports.tests.create_drop = (test, common) => {
  test('create & drop', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // create table
    let table = new TableShard()
    table.create(db)

    // index does not exist
    t.false(introspect.indices('shard').length, 'prior state')

    // create index
    let index = new IndexCovering()
    index.create(db)

    // index exists
    t.true(introspect.indices('shard').length, 'create')

    // drop index
    index.drop(db)

    // index does not exist
    t.false(introspect.indices('shard').length, 'drop')

    t.end()
  })
}

module.exports.tests.definition = (test, common) => {
  test('definition', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // create table
    let table = new TableShard()
    table.create(db)

    // create index
    let index = new IndexCovering()
    index.create(db)

    // test indices
    let indices = introspect.indices('shard')

    // shard_idx_covering
    t.deepEqual(indices[0], {
      seq: 0,
      name: 'shard_idx_covering',
      unique: 1,
      origin: 'c',
      partial: 0
    }, 'shard_idx_covering')

    t.end()
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`IndexCovering: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
