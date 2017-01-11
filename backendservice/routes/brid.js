/**
 * @overview 	Routes BRID File
 * @module brid
 * @author Dominik Sigmund
 * @version 1.0
 * @description	Exports brid Related Routes
 * @memberof brid_generator
 */

/** Exports Routes
* @param {object} app - Express app
* @param {object} use_types - json Object containing use_types
* @param {object} object_types - json Object containing object_types
* @param {object} domains - json Object containing domains
* @param {object} brid - lib/brid Object containing brid-related stuff
* @param {object} data_export - lib object having function sendData(req, res, json) which exports the json data
*/
module.exports = function (app, use_types, object_types, domains, brid, data_export) {
  app.get('/brid.:rep' + data_export.reFormats(), function (req, res) {
  	brid.list({}, function (error, brids) {
    if (error) {
      data_export.sendError(error)
    } else {
      data_export.send(req, res, brids, 'brids')
    }
  })
  })
  app.get('/brid/:brid_domain.:rep' + data_export.reFormats(), function (req, res) {
    brid.list({domain: req.params.brid_domain}, function (error, brids) {
      if (error) {
        data_export.sendError(error)
      } else {
        data_export.send(req, res, brids, 'brids')
      }
    })
  })
  app.get('/brid/:brid_domain/:brid_object_type.:rep' + data_export.reFormats(), function (req, res) {
    brid.list({domain: req.params.brid_domain, object_type: req.params.brid_object_type}, function (error, brids) {
      if (error) {
        data_export.sendError(error)
      } else {
        data_export.send(req, res, brids, 'brids')
      }
    })
  })
  app.get('/brid/:brid_domain/:brid_object_type/:brid_use_type.:rep' + data_export.reFormats(), function (req, res) {
    brid.list({domain: req.params.brid_domain, object_type: req.params.brid_object_type, use_type: req.params.brid_use_type}, function (error, brids) {
      if (error) {
        data_export.sendError(error)
      } else {
        data_export.send(req, res, brids, 'brids')
      }
    })
  })
  app.get('/brid/:brid_domain/:brid_object_type/:brid_use_type/:brid_uuid.:rep' + data_export.reFormats(), function (req, res) {
    brid.get({domain: req.params.brid_domain, object_type: req.params.brid_object_type, use_type: req.params.brid_use_type, uuid:req.params.brid_uuid}, function (error, data) {
      if (error) {
        data_export.sendError(error)
      } else {
        data_export.send(req, res, data, brid)
      }
    })
  })
  app.post('/brid.:rep' + data_export.reFormats(), function (req, res) {
    // TODO create / get a brid (on get add reference), body has data
  })
}
