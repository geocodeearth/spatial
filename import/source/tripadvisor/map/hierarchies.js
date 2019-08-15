// 1:9999:World|4:10000:Europe|187427:10001:Spain|187511:10009:La Rioja|187513:10004:Logrono
// 4:10000:Europe|187768:10001:Italy|187811:10009:Friuli Venezia Giulia|2339869:10020:Province of Pordenone|1400479:10015:Budoia

const _ = require('lodash')
const Identity = require('../../../../model/Identity')
const Hierarchy = require('../../../../model/Hierarchy')

function mapper (place, doc) {
  const placeid = _.get(place, 'identity.id')
  let parents = _.get(doc, 'navigationstring', '').split('|').map(p => p.split(':'))
  if (!parents.length) { return }

  // remove invalid parents and self
  parents = parents.filter(p => (p.length === 3) && p[0] !== placeid)
  if (!parents.length) { return }

  place.addHierarchy(
    new Hierarchy(
      place.identity,
      new Identity(
        place.identity.source,
        parents[parents.length - 1][0] // get last parent (most granular)
      ),
      `trip:nav`
    )
  )
}

module.exports = mapper
