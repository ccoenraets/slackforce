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
                      "url":"https://poojahqg-dev-ed.my.salesforce.com/5000o00002etFxpAAE";
                    "value": "Assign owner"
                },
                        {
  "type": "interactive_message",
  "actions": [
    {
      "name": "recommend",
      "value": "recommend",
      "type": "button"
    }
  ],
  "callback_id": "comic_1234_xyz",
  "team": {
    "id": "T47563693",
    "domain": "watermelonsugar"
  },
  "channel": {
    "id": "C065W1189",
    "name": "forgotten-works"
  },
  "user": {
    "id": "U045VRZFT",
    "name": "brautigan"
  },
  "action_ts": "1458170917.164398",
 // "message_ts": "1458170866.000004",
  //"attachment_id": "1",
  //"token": "xAB3yVzGS4BQ3O9FACTa8Ho4",
  //"original_message": {"text":"New comic book alert!","attachments":[{"title":"The Further Adventures of Slackbot","fields":[{"title":"Volume","value":"1","short":true},{"title":"Issue","value":"3","short":true}],"author_name":"Stanford S. Strickland","author_icon":"https://api.slack.comhttps://a.slack-edge.com/80588/img/api/homepage_custom_integrations-2x.png","image_url":"http://i.imgur.com},
  "response_url": "https://hooks.slack.com/services/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",
  
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
