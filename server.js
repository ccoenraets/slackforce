var express = require('express'),
    bodyParser = require('body-parser'),
    auth = require('./modules/auth'),
    contact = require('./modules/contact'),
    opportunity = require('./modules/opportunity'),
    _case = require('./modules/case'),
    app = express();

app.set('port', process.env.PORT || 5000);

app.use(bodyParser.urlencoded({extended: true}));

app.post('/pipeline', opportunity.execute);
app.post('/contact', contact.execute);
app.post('/case', _case.execute);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
    auth.login();
});
