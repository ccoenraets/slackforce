"use strict";

let auth = require("./slack-salesforce-auth"),
    force = require("./force");

exports.execute = (req, res) => {

    let slackUserId = req.body.user_id,
        oauthObj = auth.getOAuthObject(slackUserId);

    force.whoami(oauthObj)
        .then(data => {
            let userInfo = JSON.parse(data);
            let attachments = [];
            let fields = [];
            fields.push({title: "Name", value: userInfo.name, short:true});
            fields.push({title: "Salesforce User Name", value: userInfo.preferred_username, short:true});
            attachments.push({color: "#65CAE4", fields: fields});
            res.json({text: "Your User Information:", attachments: attachments});
        })
        .catch(error => {
            if (error.code == 401) {
                res.send(`Visit this URL to login to Salesforce: https://${req.hostname}/login/` + slackUserId);
            } else {
                res.send("An error as occurred");
            }
        });
};