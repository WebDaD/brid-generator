/**
 * Module dependencies.
 */
console.log('Starting brid_generator Backend Server...')
console.log('Reading Requirements...')
var express = require('express')
var app = express()
var server = require('http').createServer(app)
var path = require('path')
var jsonfile = require('jsonfile')

var pack = require('./package.json')
var data_export = require('./lib/data_export.js')
var brid = require('./lib/brid.js')
console.log('Done')
console.log('Setting Port...')
var port = 0
if (typeof process.argv[2] !== 'undefined') {
	port = process.argv[2];
} else {
	port = pack.options.port;
}
console.log('Port set to '+port)

console.log('Reading in Data Files...')
var use_types = jsonfile.readFileSync(pack.options.use_types)
var object_types = jsonfile.readFileSync(pack.options.object_types)
var domains = jsonfile.readFileSync(pack.options.domains)
console.log('Found '+use_types.length+' use_types, '+object_types.length+' object_types, '+domains.length+ ' domains')

var de = new data_export()
var b = new brid(pack.options.database, domains, object_types, use_types)

require('./routes/part_lists.js')(app, use_types,object_types, domains, de)
require('./routes/brid.js')(app, use_types, object_types, domains, b, de)

console.log('Starting Server Endpoint...')
server.listen(port)
console.log('Startup Complete')

// catches ctrl+c event
process.on('SIGINT', exitHandler)
// catches uncaught exceptions
process.on('uncaughtException', function (err) {
	console.error(err)
	exitHandler(null, err)
})
// keep running
process.stdin.resume()


/** Handles exitEvents by destroying bibles first
* @param {object} options - Some Options
* @param {object} err - An Error Object
*/
function exitHandler (options, err) {
  console.log('Exiting...')
  process.exit()
}
