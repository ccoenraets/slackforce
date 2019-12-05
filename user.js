"use strict";
console.log("here");
const nforce = require('nforce'),
  _case = require("./case"),    
    SLACK_VERIFICATION_TOKEN =  process.env.SLACK_VERIFICATION_TOKEN,
    SF_CLIENT_ID = process.env.SF_CLIENT_ID,
    // 
    SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET,
    // 
    SF_USER_NAME = process.env.SF_USER_NAME,
    //
    SF_PASSWORD = process.env.SF_PASSWORD;
//
    let org = nforce.createConnection({
      clientId: SF_CLIENT_ID,
      clientSecret: SF_CLIENT_SECRET,
      redirectUri:'https://localhost:3000/oauth/_callback',
      mode:'single',
      environment: 'sandbox',
      autoRefresh: true
    });

    let login = () => {
     
        org.authenticate({ username:process.env.SF_USER_NAME, password:process.env.SF_PASSWORD }, function(err, resp)  {
            console.log("auth");
          let oauth;
            if (err) {
                console.error("Authentication error");
                console.error(err);
            } else {
                console.log("Authentication successful");
             oauth=resp;
         
            }
        });

    }
let findcase=casenumber=>{
  return new Promise((resolve, reject) => {
   let q = "SELECT Id, description, CaseNumber,Subject FROM Case WHERE CaseNumber ='" + casenumber + "'";
             console.log('query',q);
                org.query({ query: q }, (err, resp) => {
                    if (err) {
                        console.log("error", err);
                    } else {
                  resolve(resp);
                    }
                       });
            });

        } 

         let findusers =name => {
           
            console.log("user");
            return new Promise((resolve, reject) => {
                let q = "SELECT Id, Name FROM User WHERE IsActive = true";
                org.query({ query: q }, (err, resp) => {
                    if (err) {
                        reject("An error as occurred");
                      console.log("error");
                    } else {
                        resolve(resp.records);
                       console.log("query", resp);
                    }
                });
            });

        } 

   
 let userId, casenumber;
 let  changeowner= (userId,casenumber)=> {
           
            console.log("user1",casenumber);

            return new Promise((resolve, reject) => {
                let q = "SELECT Id,description,Subject FROM Case WHERE CaseNumber='" + userId[1] + "'";
              console.log('q',q);
               org.query({ query: q }, (err, resp) => {
                    if (err) {
                        console.log("error", err);
                    } else {
                       console.log("query", resp['records'][0]['_fields']['id']);
                       let acc = resp.records[0];
                      acc.set('ownerId', userId[0]);


                   org.update({ sobject: acc}, function(err, resp){
      if(!err) console.log('It worked!');
    })
                    }     
               });
             
        })
 }
                               
    
    
   login();
setInterval(login,2800000);
exports.org = org;
exports.findusers = findusers;    
exports.changeowner=changeowner;
exports.findcase=findcase;