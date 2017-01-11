var uuid = require('node-uuid')
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
  self.getBRID = getBRID
  // TODO: Load Data from folders/files
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
    console.log(self.brids)
    return self
  } else {
    // error
  }
}

function list (filter, callback) {
  var self = this
  var object = null
  if(filter.hasOwnProperty("use_type")) {
    object = self.brids[filter.domain][filter.object_type][filter.use_type]
  } else {
    if(filter.hasOwnProperty("object_type")) {
      object = self.brids[filter.domain][filter.object_type]
    } else {
      if(filter.hasOwnProperty("domain")) {
        object = self.brids[filter.domain]
      } else {
        object = self.brids
      }
    }
  }
  if(object !== null) {
    callback(null, object)
  } else {
    callback({status:404, message:'Object not found'})
  }
}
function get (brid, callback) {
  var self = this
  var object = self.brids[brid.domain][brid.object_type][brid.use_type][brid.uuid]
  if(object !== null) {
    callback(null, object)
  } else {
    callback({status:404, message:'Object not found'})
  }
}
function getBRID (metadata) {

}
module.exports = brid
