/**
 * @overview 	Route List Parts File
 * @module part_lists
 * @author Dominik Sigmund
 * @version 1.0
 * @description	Exports use_type Related Routes
 * @memberof brid_generator
 */


/** Exports Routes
* @param {object} app - Express app
* @param {object} use_types - json Object containing use_types
* @param {object} object_types - json Object containing object_types
* @param {object} domains - json Object containing domains
* @param {object} data_export - lib object having function sendData(req, res, json) which exports the json data
*/
module.exports = function (app, use_types, object_types, domains, data_export) {
  app.get('/use_types.:rep'+data_export.reFormats(),data_export.sendData(use_types, 'use_types'))
  app.get('/object_types.:rep'+data_export.reFormats(),data_export.sendData(object_types, 'object_types'))
  app.get('/domains.:rep'+data_export.reFormats(),data_export.sendData(domains, 'domains'))
}
