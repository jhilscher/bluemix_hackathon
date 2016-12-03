var dbService = require('../services/dbService');
var db = dbService.db;

var watsonService = require('../services/watsonService');



//var exphbs  = require('express-handlebars');
exports.analyzeComment = function(request, response){ 

    watsonService.analyze(request.body.text, function(res) {
        response.json(res);
    });
};


exports.insertComment = function(request, response){
    console.log("user: " + request.body.username);
    console.log("text: " + request.body.commenttext);

    // var id = request.body.id;
    var username = request.body.username;
    var commenttext = request.body.commenttext;

    var id;

    if (id === undefined) {
        // Generated random id
        id = '';
    }

    watsonService.analyze(commenttext, function(result) {
        db.insert({
                username: username,
                commenttext: commenttext,
                time: new Date(),
                metric : result

        }, id, function(err, doc) {
            if (err) {
                console.log(err);
                response.sendStatus(500);
            } else {
                response.sendStatus(200);
            }
            response.end();
        });
    });
};

exports.deleteComment = function(request, response) {
    var id = request.query.id;
    // var rev = request.query.rev; // Rev can be fetched from request. if
    // needed, send the rev from client
    console.log("Removing document of ID: " + id);
    console.log('Request Query: ' + JSON.stringify(request.query));

    if (!id){
        response.sendStatus(410);
        return;
    }

    db.get(id, {
        revs_info: true
    }, function(err, doc) {
        if (!err) {
            db.destroy(doc._id, doc._rev, function(err, res) {
                // Handle response
                if (err) {
                    console.log(err);
                    response.sendStatus(500);
                } else {
                    response.sendStatus(200);
                }
            });
        }
    });
};

exports.getComments = function(request, response){
    
    var docList = [];
    var i = 0;
    db.list(function(err, body) {

        if (!err) {
            var len = body.rows.length;
            var i = 0;
            console.log('total # of docs -> ' + len);
            
            if (len > 0) {
            body.rows.forEach(function(document) {

                db.get(document.id, {
                    revs_info: true
                }, function(err, doc) {
                    if (!err) {

                        i++;
                        docList.push({
                            id : doc._id,
                            username : doc.username,
                            commenttext : doc.commenttext,
                            time : doc.time,
                            metric: doc.metric
                        });    
                        
                        if (i >= len) {

                                //var template = exphbs.handlebars.compile('comment');
                                //var html = template(docList);

                                // response.render('echo', {

                                //         comments: docList,
                                //         partials: Promise.resolve({
                                //             echo: exphbs.handlebars.compile('<p>ECHO: {{message}}</p>')
                                //         })
                                //     });

                               //response.write(html);
                                 response.render('comment.html',  { 
                                     layout: '',
                                     comments: docList });
                                //response.end();
                               // response.render('comment.html', {'comments': docList});
                                console.log('ending response...');
                            }

                    } else {
                        console.log(err);
                        response.end();
                    }
                });

            });
            } else {
                response.render('comment.html',  { 
                                     layout: '',
                                     comments: [] });
            }

        } else {
            console.log(err);
            response.end();
        }
    });

};