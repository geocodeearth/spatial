$('document').ready(function () {
  function getCenter (map) {
    // use map center
    var latlng = _.extend({}, map.getCenter())

    // handle weird leflet behaviour
    if (latlng.lng_neg && latlng.lng > 0) { latlng.lng = -latlng.lng }
    if (latlng.lat_neg && latlng.lat > 0) { latlng.lat = -latlng.lat }

    // unwrap longitude
    while (latlng.lng > +180) { latlng.lng -= 360 }
    while (latlng.lng < -180) { latlng.lng += 360 }

    return _.pick(latlng, ['lat', 'lng'])
  }

  function getMapLayer (map, name) {
    let layer
    map.eachLayer(function (l) {
      if (l.name === name) { layer = l }
    })
    return layer
  }

  function clearLayers (map) {
    getMapLayer(map, 'geojson').clearLayers()
    getMapLayer(map, 'labels').clearLayers()
  }

  function updateMap (map, res) {
    let geojson = getMapLayer(map, 'geojson')
    geojson.clearLayers()

    let simplify = 0
    let simplification = parseFloat($('#simplification').val())

    var minp = 0
    var maxp = 100
    var minv = Math.log(0.000001)
    var maxv = Math.log(1)

    if (!isNaN(simplification) && simplification > 0) {
      // calculate logarithmic scale
      var scale = (maxv - minv) / (maxp - minp)
      var log = Math.exp(minv + scale * (simplification - minp))
      simplify = log
    }

    let display = simplify.toFixed(12).replace(/0+$/, '')
    if (display.endsWith('.')) { display += '0' }
    $('#simplification-info').val(display)

    res.forEach(function (place) {
      api.name(place, {}, function (err2, res2) {
        if (err2) { console.error(err2) } else {
          var chosenName = 'unknown'
          if (res2.length > 0) { chosenName = res2[0].name }

          api.geometry(place, { simplify: simplify }, function (err3, res3) {
            if (err3) { console.error(err3) } else {
              geojson.addData({
                type: 'Feature',
                properties: _.extend({}, place, { name: chosenName }, { role: res3[0].role }),
                geometry: res3[0].geom
              })
            }
          })
        }
      })
    })
  }

  function updateSidebar (map, res) {
    let tbody = $('#sidebar-results tbody')
    tbody.empty()

    res.forEach(function (place) {
      var tr = $('<tr></tr>')
      tr.append('<td><a data-source="' + place.source + '" data-id="' + place.id + '"  data-show-source="1"></a></td>')
      tr.append('<td>' + place.class + '</td>')
      tr.append('<td>' + place.type + '</td>')
      tbody.append(tr)
    })
  }

  function pointInPolygon (map) {
    var latlng = getCenter(map)
    console.info('pip', latlng)

    let labels = getMapLayer(map, 'labels')
    labels.clearLayers()

    api.pip({ lon: latlng.lng, lat: latlng.lat }, function (err, res) {
      if (err) { console.error(err) } else {
        updateMap(map, res)
        updateSidebar(map, res)
      }
    })
  }

  var map = document.querySelector('#map')._leaflet_map
  map.on('movestart', function (e) { clearLayers(map) })
  map.on('moveend', function (e) { pointInPolygon(map) })
  map.on('resize', function (e) { pointInPolygon(map) })
  $('#simplification').change(function () { pointInPolygon(map) })

  function onEachFeature (feature, layer) {
    if (feature.geometry.type.indexOf('Polygon') !== -1) {
      var tmpLayer = new L.geoJson()
      tmpLayer.addData(feature)

      var label = L.marker(tmpLayer.getBounds().getCenter(), {
        icon: L.divIcon({
          className: 'geom-marker',
          iconSize: [200, 28],
          html: feature.properties.name
        })
      }).addTo(labels)
    }
  }

  // create a layer to store geojson geometries
  var geojson = new L.geoJson([], _.extend({ onEachFeature: onEachFeature }, mapStyle.pip))
  geojson.addTo(map)
  geojson.name = 'geojson'

  // create a layer for labels
  var labels = new L.geoJson([])
  labels.addTo(map)
  labels.name = 'labels'

  pointInPolygon(map)
})
