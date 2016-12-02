/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    comment = require('./routes/comment'),
    user = require('./routes/user'),
    dbService = require('./services/dbService'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    moment = require('moment');

var app = express();



var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();
var exphbs  = require('express-handlebars');

var hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.html',
    partialsDir: ['views/partials/', 'views/templates/'],
    helpers: {
        dateFormat: function(context, block) {
            var f = block.hash.format || "DD.MM.YYYY HH:mm:ss";
            return moment(context).format(f);
        }
    }
});

// hbs.registerHelper('dateFormat', function(context, block) {
//     var f = block.hash.format || "MMM DD, YYYY hh:mm:ss A";
//     return moment(context).format(f);
// });

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');
//app.engine('html', require('ejs').renderFile);

app.engine('html', hbs.engine);
app.set('view engine', 'html');




app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

var db = dbService.db;

/* Routing */

app.get('/', routes.index);

app.post('/api/insertComment', comment.insertComment);

app.get('/api/getComments', comment.getComments);

app.delete('/api/deleteComment', comment.deleteComment);

app.post('/api/analyzeComment', comment.analyzeComment)

http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});
