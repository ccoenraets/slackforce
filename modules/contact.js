"use strict";

let auth = require("./slack-salesforce-auth"),
    force = require("./force"),
    CONTACT_TOKEN = process.env.SLACK_CONTACT_TOKEN;

exports.execute = (req, res) => {

    if (req.body.token != CONTACT_TOKEN) {
        res.send("Invalid token");
        return;
    }

    let slackUserId = req.body.user_id,
        oauthObj = auth.getOAuthObject(slackUserId),
        q = "SELECT Id, Name, Phone, MobilePhone, Email FROM Contact WHERE Name LIKE '%" + req.body.text + "%' LIMIT 5";

    force.query(oauthObj, q)
        .then(data => {
            let contacts = JSON.parse(data).records;
            if (contacts && contacts.length>0) {
                let attachments = [];
                contacts.forEach(function(contact) {
                    let fields = [];
                    fields.push({title: "Name", value: contact.Name, short:true});
                    fields.push({title: "Phone", value: contact.Phone, short:true});
                    fields.push({title: "Mobile", value: contact.MobilePhone, short:true});
                    fields.push({title: "Email", value: contact.Email, short:true});
                    fields.push({title: "Open in Salesforce:", value: oauthObj.instance_url + "/" + contact.Id, short:false});
                    attachments.push({color: "#A094ED", fields: fields});
                });
                res.json({text: "Contacts matching '" + req.body.text + "':", attachments: attachments});
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