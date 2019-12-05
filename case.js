"use strict";
console.log("here");
const nforce = require('nforce'),
       _users=require("./user"),
    SLACK_VERIFICATION_TOKEN = process.env.SLACK_VERIFICATION_TOKEN;

exports.execute = (req, res) => {
    console.log("Mein Hu IDHAR!");
    if (req.body.token != process.env.SLACK_VERIFICATION_TOKEN) {
          res.send("Invalid token");
          console.log("here1");
          return;
    }
  let params = req.body.text;
        console.log("params" + params);
        //let findcase = params => {
        console.log("params1");
        // return new Promise((resolve, reject) => {
      _users.findcase(params)
          .then(data => {
          let cases=data;
         
                       console.log("query", cases);
                        if(cases['records'].length>0)
                        { //let rec = resp['records'][0]['_fields']['subject'];
                        let fields = [];
                        fields.push({ title: "Subject", value: cases['records'][0]['_fields']['subject'], short: false });
                        fields.push({ title: "Description", value: cases['records'][0]['_fields']['description'], short: false });
                       fields.push({ title: "CaseNumber", value: cases['records'][0]['_fields']['casenumber'], short: false });
                        //fields.push({ title: "Open in Salesforce:", value: oauthObj.instance_url + "/" + data.id, short: false });
                        const message = {
                            text: "Case Found:"+params,
                            attachments: [{
                                color: "#F2CF5B",
                                callback_id: 'start:order',
                                fields: fields,
                                actions: [{
                                    name:params,
                                    text: 'change owner',
                                    type: 'button',
                                    value: 'start'
                                }, ],

                            }, ],


                        };
                        res.json(message);

                    }
        else{
           
                        let message = {
                        
                            text: "No case found :"+params
                          
                          
                        }
                         res.json(message);
                        }
        
      }
                );
            }
      

  
     
        

       
    