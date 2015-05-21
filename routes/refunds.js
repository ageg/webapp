require('../models/refunds.js');
var mongoose = require("mongoose");
var Request = mongoose.model('Request');

module.exports.refunds = function (req, res) {
	// TODO: pick up data from session/Mongo, then seed it to form
	res.render("refunds");
};

module.exports.parsePOST = function(req, res) {
  var infos = req.body;
  var request = new Request({
    // TODO: Sanity Checks
    cip: infos.cip,
    prenom: infos.prenom,
    nom: infos.nom,
    email: infos.email,
    request_id: infos.request_id,
    category: infos.category,
    total: infos.total,
    notes: infos.notes
  });
  console.log(request);
  // TODO: Actual work
  request.save(function(err){
    if (err) throw err;
    res.redirect('/');
  });
}