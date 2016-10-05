"use strict";

var SLACK_LOGIN_TOKEN = process.env.SLACK_LOGIN_TOKEN,
    SLACK_LOGOUT_TOKEN = process.env.SLACK_LOGOUT_TOKEN,
    SF_CLIENT_ID = process.env.SF_CLIENT_ID,
    SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET,
    SF_LOGIN_URL = process.env.SF_LOGIN_URL,
    request = require('request'),
    mappings = {};

exports.logout = (req,res) => {

    if (req.body.token != SLACK_LOGOUT_TOKEN) {
        res.send("Invalid token");
        return;
    }

    let slackUserId = req.body.user_id;
    delete mappings[slackUserId];

    res.send({text: "Logged out"});

};

exports.loginLink = (req, res) => {

    if (req.body.token != SLACK_LOGIN_TOKEN) {
        res.send("Invalid token");
        return;
    }

    res.send(`Visit this URL to login to Salesforce: https://${req.hostname}/login/` + req.body.user_id);

};

exports.oauthLogin = (req, res) => {
    res.redirect(`${SF_LOGIN_URL}/services/oauth2/authorize?response_type=code&client_id=${SF_CLIENT_ID}&redirect_uri=https://${req.hostname}/oauthcallback&state=${req.params.slackUserId}`);
};

exports.oauthCallback = (req, res) => {

    var slackUserId = req.query.state;

    let options = {
        url: `${SF_LOGIN_URL}/services/oauth2/token`,
        qs: {
            grant_type: "authorization_code",
            code: req.query.code,
            client_id: SF_CLIENT_ID,
            client_secret: SF_CLIENT_SECRET,
            redirect_uri: `https://${req.hostname}/oauthcallback`
        }
    };

    request.post(options, function (error, response, body) {
        if (error) {
            console.log(error);
            return res.send("error");
        }
        mappings[slackUserId] = JSON.parse(body);
        let html = `
            <html>
            <body style="text-align:center;padding-top:100px">
            <img src="images/linked.png"/>
            <div style="font-family:'Helvetica Neue';font-weight:300;color:#444">
                <h2 style="font-weight: normal">Authentication completed</h2>
                Your Slack User Id is now linked to your Salesforce User Id.<br/>
                You can now go back to Slack and execute authenticated Salesforce commands.
            </h2>
            </body>
            </html>
            `;
        res.send(html);
    });

};

exports.getOAuthObject = slackUserId => mappings[slackUserId];