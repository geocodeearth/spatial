const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableShard = require('./TableShard')
const ShardGeoColumn = require('./ShardGeoColumn')
const ShardGeoIndex = require('./ShardGeoIndex')

module.exports.tests = {}

module.exports.tests.create_drop = (test, common) => {
  test('create & drop', (t) => {
    let db = common.tempSpatialDatabase()
    let introspect = new SqliteIntrospect(db)

    // create table
    let table = new TableShard()
    table.create(db)

    let introspectIndex = () => {
      return introspect.geometryColumns('shard')
        .filter(c => c.f_geometry_column === 'geom')
        .filter(c => c.spatial_index_enabled === 1)
    }

    // column does not exist
    t.false(introspectIndex().length, 'prior state')

    // create column
    let column = new ShardGeoColumn()
    column.create(db)

    // create index
    let index = new ShardGeoIndex()
    index.create(db)

    // column exists
    t.true(introspectIndex().length, 'create')

    // drop index
    index.drop(db)

    // index should not exist
    // @todo: why is spatial_index_enabled still set to 1?
    // t.deepEqual(introspectIndex(), [], 'drop')

    t.end()
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`ShardGeoIndex: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
