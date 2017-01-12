var uuidV4 = require('uuid/v4')
var fs = require('fs')
var path = require('path')
var jsonfile = require('jsonfile')

function brid (database, domains, object_types, use_types) {
  var self = {}
  self.database = database
  self.domains = domains
  self.object_types = object_types
  self.use_types = use_types
  self.list = list
  self.get = get
  self.search = search
  self.getBRID = getBRID
  self.brids = {}
  if (fs.existsSync(self.database)) { // check if database folder exists
    for (var i = 0, len = self.domains.length; i < len; i++) { // loop domains
      var domain = self.domains[i].domain
      var path_domain = path.join(self.database, domain)
      if (!fs.existsSync(path_domain)) { // if domain folder does not exist, create it
        fs.mkdir(path_domain, 777)
      }
      self.brids[domain] = {}
      for (var j = 0, len = self.object_types.length; j < len; j++) { // loop object_types
        var object_type = self.object_types[j].key
        var path_object_type = path.join(path_domain, object_type)
        if (!fs.existsSync(path_object_type)) { // if object_type folder does not exist, create it
          fs.mkdir(path_object_type, 777)
        }
        self.brids[domain][object_type] = {}
        for (var k = 0, len = self.use_types.length; k < len; k++) { // loop use_types
          var use_type = self.use_types[k].key
          var path_use_type = path.join(path_object_type, use_type)
          if (!fs.existsSync(path_use_type)) { // if use_type folder does not exist, create it
            fs.mkdir(path_use_type, 777)
          }
          self.brids[domain][object_type][use_type] = {}
          var files = fs.readdirSync(path_use_type)
          if (files.length > 0) {
            for (var l = 0, len = files.length; l < len; l++) { // loop files (uuids) in folder
              var file = files[l]
              var uuid = file.replace('.json', '')
              self.brids[domain][object_type][use_type][uuid] = jsonfile.readFileSync(path.join(path_use_type, file))
            }
          }
        }
      }
    }
    return self
  } else {
    // error
  }
}

function list (filter, callback) {
  var self = this
  var object = null
  if (filter.hasOwnProperty('use_type')) {
    object = self.brids[filter.domain][filter.object_type][filter.use_type]
  } else {
    if (filter.hasOwnProperty('object_type')) {
      object = self.brids[filter.domain][filter.object_type]
    } else {
      if (filter.hasOwnProperty('domain')) {
        object = self.brids[filter.domain]
      } else {
        object = self.brids
      }
    }
  }
  if (object !== null) {
    callback(null, object)
  } else {
    callback({status: 404, message: 'Object not found'})
  }
}
function get (brid, callback) {
  var self = this
  var object = self.brids[brid.domain][brid.object_type][brid.use_type][brid.uuid]
  if (object !== null) {
    callback(null, object)
  } else {
    callback({status: 404, message: 'Object not found'})
  }
}
function search (filter, callback) { // filter = object with quey parms
  var result = []
  var self = this
  Object.keys(self.brids).forEach(function (domain) {
    Object.keys(self.brids[domain]).forEach(function (ot) {
      Object.keys(self.brids[domain][ot]).forEach(function (ut) {
        Object.keys(self.brids[domain][ot][ut]).forEach(function (uuid) {
          var brid = self.brids[domain][ot][ut][uuid]
          var matches = 0
          var keys = 0
          Object.keys(filter).forEach(function (key) {
            keys++
            brid["ansprechpartner_function"] = brid.ansprechpartner.function
            brid["ansprechpartner_vorname"] = brid.ansprechpartner.vorname
            brid["ansprechpartner_nachname"] = brid.ansprechpartner.nachname
            if (brid.hasOwnProperty(key) && brid[key] == filter[key]) {
              matches++
            }
          })
          if (matches == keys) {
            delete brid.ansprechpartner_function
            delete brid.ansprechpartner_vorname
            delete brid.ansprechpartner_nachname
            result.push(brid)
          }
        })
      })
    })
  })

  if (result.length > 0) {
    callback(null, result)
  } else {
    callback({status: 404, message: 'No Objects matched the given filter'})
  }
}
function getBRID (metadata, callback) { // callback -> status and brid (status 201 for new, 302 for existing) //metadata is key value pair
  var self = this
  if (metadata.hasOwnProperty('domain') &&
      metadata.hasOwnProperty('object_type') &&
      metadata.hasOwnProperty('use_type') &&
      metadata.hasOwnProperty('title') &&
      metadata.hasOwnProperty('ansprechpartner_function') &&
      metadata.hasOwnProperty('ansprechpartner_vorname') &&
      metadata.hasOwnProperty('ansprechpartner_nachname') &&
      metadata.hasOwnProperty('produktionsnummer') &&
      metadata.hasOwnProperty('kostenstelle') &&
      metadata.hasOwnProperty('kostentraeger') &&
      metadata.hasOwnProperty('ressort') &&
      metadata.hasOwnProperty('organisationseinheit') &&
      metadata.hasOwnProperty('system') &&
      metadata.hasOwnProperty('id_internal')
    ) {
    if (self.domains.filter(function (e) { e.domain == metadata.domain }).length < 1) {
      return callback({status: 400, message: metadata.domain + ' is not in List of Domains!'})
    }
    if (self.object_types.filter(function (e) { e.key == metadata.object_type }).length < 1) {
      return callback({status: 400, message: metadata.object_type + ' is not in List of object_types!'})
    }
    if (self.use_types.filter(function (e) { e.key == metadata.use_type }).length < 1) {
      return callback({status: 400, message: metadata.use_type + ' is not in List of use_types!'})
    }
    self.search(metadata, function (error, search_results) {
      var newBrid = null
      var status = 200
      if (error) {
        newBrid = addBRIDObject(metadata)
        status = 201
      } else {
        newBrid = addInstanceToObject(search_results[0].uuid, metadata)
        status = 302
      }
      saveBRIDObjectToDatabase(newBrid, function (error) {
        if (error) {
          return callback({status: 501, message: error})
        } else {
          return callback(null, {brid: newBrid.brid, status: status})
        }
      })
    })
  } else {
    return callback({status: 400, message: 'Missing Fields!'})
  }
}
function addBRIDObject (metadata) { // returns brid-object, save to self.brids
  var self = this
  var uuid = uuidV4().replace(/-/g, "")
  var brid = {}
  brid.brid = 'brid://'+metadata.domain+'/'+metadata.object_type+'/'+metadata.use_type+'/'+uuid
  brid.domain = metadata.domain
  brid.object_type = metadata.object_type
  brid.use_type = metadata.use_type
  brid.uuid = uuid
  brid.title = metadata.title
  brid.ansprechpartner = {}
  brid.ansprechpartner.function = metadata.ansprechpartner_function
  brid.ansprechpartner.vorname = metadata.ansprechpartner_vorname
  brid.ansprechpartner.nachname = metadata.ansprechpartner_nachname
  brid.produktionsnummer = metadata.produktionsnummer
  brid.kostenstelle = metadata.kostenstelle
  brid.kostentraeger = metadata.kostentraeger
  brid.ressort = metadata.ressort
  brid.organisationseinheit = metadata.organisationseinheit
  brid.instanzen = []
  brid.instanzen.push({id:metadata.id_internal, system:metadata.system, description:''})
  brid.anmerkung = metadata.hasOwnProperty('anmerkung') ? metadata.anmerkung : ''
  self.brids[brid.domain][brid.object_type][brid.use_type][brid.uuid] = brid
  return brid
}
function addInstanceToObject (uuid, metadata) { // returns brid-object, save to self.brids
  var self = this
  self.brids[metadata.domain][metadata.object_type][metadata.use_type][uuid].instanzen.push({id:metadata.id_internal, system:metadata.system, description:''})
  return self.brids[metadata.domain][metadata.object_type][metadata.use_type][uuid]
}
function saveBRIDObjectToDatabase (brid, callback) { // error only callback
  var self = this
  jsonfile.writeFile(path.join(self.database, brid.domain, brid.object_type, brid.use_type, brid.uuid) + '.json', brid, callback)
}
module.exports = brid
