var nforce = require('nforce'),
    org = require('./auth').org,

    CASE_TOKEN = process.env.SLACK_CASE_TOKEN;

function execute(req, res) {

    if (req.body.token != CASE_TOKEN) {
        res.send("Invalid token");
        return;
    }

    var params = req.body.text.split(":");
    var subject = params[0];
    var description = params[1];

    var c = nforce.createSObject('Case');
    c.set('subject', subject);
    c.set('description', description);
    c.set('origin', 'Slack');
    c.set('status', 'New');

    org.insert({ sobject: c}, function(err, resp) {
        if (err) {
            console.error(err);
            res.send("An error occurred while creating a case");
        } else {
            var fields = [];
            fields.push({title: "Subject", value: subject, short:false});
            fields.push({title: "Description", value: description, short:false});
            fields.push({title: "Link", value: 'https://login.salesforce.com/' + resp.id, short:false});
            var message = {
                response_type: "in_channel",
                text: "A new case has been created:",
                attachments: [
                    {color: "#F2CF5B", fields: fields}
                ]
            };
            res.json(message);
        }
    });
}

exports.execute = execute;
