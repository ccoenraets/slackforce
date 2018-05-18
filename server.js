"use strict";

let express = require('express'),
    bodyParser = require('body-parser'),
    auth = require('./modules/slack-salesforce-auth'),
    account = require('./modules/account'),
    contact = require('./modules/contact'),
    quote = require('./modules/quote'),
    actions = require('./modules/actions'),
    app = express();

    app.enable('trust proxy');
    app.set('port', process.env.PORT || 5000);
    app.use('/', express.static(__dirname + '/www')); // serving company logos after successful authentication
    app.use(bodyParser.urlencoded({extended: true}));

    app.post('/actions', actions.handle);
    app.post('/account', account.execute);
    app.post('/contact', contact.execute);
    app.post('/quote', quote.execute);
    app.post('/login', auth.loginLink);
    app.post('/logout', auth.logout);
    app.get('/login/:slackUserId', auth.oauthLogin);
    app.get('/oauthcallback', auth.oauthCallback);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});