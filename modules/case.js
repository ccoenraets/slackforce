"use strict";

let auth = require("./slack-salesforce-auth"),
    force = require("./force"),
    CASE_TOKEN = process.env.SLACK_CASE_TOKEN;

exports.execute = (req, res) => {

    if (req.body.token != CASE_TOKEN) {
        res.send("Invalid token");
        return;
    }

    let slackUserId = req.body.user_id,
        oauthObj = auth.getOAuthObject(slackUserId),
        params = req.body.text.split(":"),
        subject = params[0],
        description = params[1];

    force.create(oauthObj, "Case",
        {
            subject: subject,
            description: description,
            origin: "Slack",
            status: "New"
        })
        .then(data => {
            let fields = [];
           
            fields.push({title: "Open in Salesforce:", value: oauthObj.instance_url + "/" + data.id, short:false});
         
 
        let message = {
                text: "",
                attachments: [
                    {
                          color: "#F2CF5B", fields: fields,
                    "actions": [
                {
           
  "name": "case_owner",
  "type": "select",
  "data_source": "users"
                    },
                         {
                    "name": "Assign Owner",
                    "text": "Assign Owner",
                    "type": "button",
                   
                    "value": "Assign owner"
                }
                      
                    
                ]
        }   
                ]
            };
           res.json(message);
        })
        .catch((error) => {
            if (error.code == 401) {
                res.send(`Visit this URL to login to Salesforce: https://${req.hostname}/login/`+ slackUserId);

            } else {
                res.send("An error as occurred");
            }
        });

};
