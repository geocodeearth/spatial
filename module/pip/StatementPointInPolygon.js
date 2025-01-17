const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementPointInPolygon extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      this.statement = db.prepare(`
        SELECT place.*
        FROM ${dbname}.point_in_polygon AS pip
        LEFT JOIN place USING (source, id)
        WHERE search_frame = MakePoint( @lon, @lat, 4326 )
        AND INTERSECTS( pip.geom, MakePoint( @lon, @lat, 4326 ) )
        AND place.source IS NOT NULL
        LIMIT @limit
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementPointInPolygon
