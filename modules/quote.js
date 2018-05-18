"use strict";

let auth = require("./slack-salesforce-auth"),
    force = require("./force"),
    QUOTE_TOKEN = process.env.SLACK_QUOTE_TOKEN;

exports.execute = (req, res) => {

    if (req.body.token != QUOTE_TOKEN) {
        console.log("Invalid token");
        res.send("Invalid token");
        return;
    }

    let slackUserId = req.body.user_id,
        oauthObj = auth.getOAuthObject(slackUserId),
        q = "SELECT Id, Name, zqu__Number__c, zqu__Status__c, CreatedBy.Name, CreatedBy.Id FROM zqu__Quote__c WHERE Name LIKE '%" + req.body.text + "%' OR zqu__Number__c LIKE '%" + req.body.text + "%' LIMIT 5";

    force.query(oauthObj, q)
        .then(data => {
            let quotess = JSON.parse(data).records;
            if (quotess && quotess.length > 0) {
                let attachments = [];
                quotess.forEach(function (quote) {
                    let fields = [];
                    fields.push({title: "Number", value: quote.zqu__Number__c, short:true});
                    fields.push({title: "Status", value: quote.zqu__Status__c, short:true});
                    attachments.push({
                        author_name: quote.CreatedBy.Name,
                        author_link: oauthObj.instance_url + "/" + quote.CreatedBy.Id,
                        title: quote.Name,
                        title_link: oauthObj.instance_url + "/" + quote.Id,
                        color: "#36a64f",
                        fields: fields
                    });
                });
                res.json({text: "Quotes matching '" + req.body.text + "':", attachments: attachments});
            } else {
                res.send("No records");
            }
        })
        .catch(error => {
            if (error.code == 401) {
                res.send(`Visit this URL to login to Salesforce: https://${req.hostname}/login/` + slackUserId);
            } else {
                res.send("An error as occurred");
            }
        });
};