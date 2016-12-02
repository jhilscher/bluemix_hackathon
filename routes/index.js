
/*
 * GET home page.
 */
var comment = require('../routes/comment');

exports.index = function(req, res){

  
  res.render('index.html', { title: 'Cloudant Boiler Plate'});
};