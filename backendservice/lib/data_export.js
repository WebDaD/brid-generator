/**
 * @overview 	Get a JSON and export Data. Used as middleware
 * @module data_export
 * @author Dominik Sigmund
 * @version 1.0
 * @description	Exports Data in various formats
 * @memberof brid_generator
 * @requires xml2json
 * @requires json2csv
 */

function data_export () {
  var self = {}
  self.xml2json = require('js2xmlparser')
  self.json2csv = require('json2csv')
  self.sendData = sendData
  self.send = send
  self.sendError = sendError
  self.formats = ['json', 'xml', 'csv']
  self.reFormats = reFormats
  return self
}

function sendData (jsonArray, name) {
  var self = this
  return function (req, res, next) {
    switch (req.params.rep) {
      case 'json':
        res.setHeader('Content-Type', 'application/json')
        res.send(jsonArray)
        break
      case 'xml':
        res.setHeader('Content-Type', 'application/xml')
        res.send(self.xml2json.parse(name, jsonArray))
        break
      case 'csv':
        res.setHeader('Content-Type', 'text/csv')
        res.send(self.json2csv({data: jsonArray}))
        break
      default:
        res.setHeader('Content-Type', 'application/json')
        res.send(jsonArray)
        break
    }
  }
}
function send (req, res, jsonArray, name) {
  var self = this
  switch (req.params.rep) {
    case 'json':
      res.setHeader('Content-Type', 'application/json')
      res.send(jsonArray)
      break
    case 'xml':
      res.setHeader('Content-Type', 'application/xml')
      res.send(self.xml2json.parse(name, jsonArray))
      break
    case 'csv':
      res.setHeader('Content-Type', 'text/csv')
      res.send(self.json2csv({data: jsonArray}))
      break
    default:
      res.setHeader('Content-Type', 'application/json')
      res.send(jsonArray)
      break
  }
}
function sendError (error) {
  res.setStatus(500)
  send(error, 'Error')
}
function reFormats () {
  var self = this
  var r = '('
  for (var i = 0, len = self.formats.length; i < len; i++) {
    r += self.formats[i] + '|'
  }
  r = r.replace(/\|\s*$/, '')
  r += ')'
  return r
}

module.exports = data_export
