/**
 * Module dependencies.
 */
var express = require('express')
var app = express()
var server = require('http').createServer(app)
var path = require('path')
var pack = require('./package.json')
var uuid = require('node-uuid')
var port = 0
if (typeof process.argv[2] !== 'undefined') {
	port = process.argv[2];
} else {
	port = pack.options.port;
}
var domain = pack.options.domain
var segment = pack.options.segment

app.get('/brid', function (req, res) {
	var brid = "brid://"+domain+"/"+segment+"/"+uuid.v4().replace(/-/g, "")
	res.status(200).send(brid).end()
})
app.get('/brid/:domain', function (req, res) {
	var brid = "brid://"+req.params.domain+"/"+segment+"/"+uuid.v4().replace(/-/g, "")
	res.status(200).send(brid).end()
})
app.get('/brid/:domain/:segment', function (req, res) {
	var brid = "brid://"+req.params.domain+"/"+req.params.segment+"/"+uuid.v4().replace(/-/g, "")
	res.status(200).send(brid).end()
})

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

function createBRID(){

	return brid + uuid
}
