var express = require('express.io');                                // require express-socket.io module
var path = require('path');                                         // path: contains the URL to your root
var app = express().http().io();                                    // instantiate your app with http and io

    // var cookieParser = require('cookie-parser');                 // handles session for express
    // var bodyParser = require('body-parser');             

app.configure(function() {                                          // configuring app

    app.use(express.cookieParser());                                // handles session   
    // app.use(express.session( { secret: 'ninja' }));              // handles session

    app.use(express.json());                                        // handles POST data                          
    app.use(express.urlencoded({ extended: true }));                // handles POST data 

    //app.use(favicon(__dirname + '/public/favicon.ico'));          // uncomment after placing your favicon in /public

    app.use(express.static(path.join(__dirname, 'public')));        // Look into public folder for any files referenced
    app.set('views', path.join(__dirname, 'server/views'));         // goes to  for your views
    app.set('view engine', 'ejs');                                  // use ejs to compile the view
    
});

var mongoose = require('./config/mongoose');                        // require mongoose module, which speaks between node and mongoDB
var routes = require('./config/serverRoutes')(app);                 // pass app into any routes/links for routing gets and posts       
var ioRoutes = require('./server/controllers/ioController')(app)    // pass app into any routes/links for routing socket io

app.set('port', process.env.PORT || 6789);                          // If port is not set, set it to 6789                        
app.listen(app.get('port'), function() {                            // Listen to the port that has been set
    console.log('\n*************************************************************************');
    console.log('**********        Express.io server listening on port ' + app.get('port') + '     **********');                               
    console.log('*************************************************************************\n');
});
