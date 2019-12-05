require('dotenv').config();
const http = require("http");
const express = require("express"),
  bodyParser = require("body-parser"),
   axios = require('axios'),    
  map = require("lodash.map"),
  slackInteractiveMessages = require("@slack/interactive-messages"),
  _case = require("./case"),
      _user=require("./user"),
  SLACK_VERIFICATION_TOKEN = "tUENoQHFJXv2sfEA8cr6FRIK",
      SLACK_WEBHOOK_URL="https://hooks.slack.com/services/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",
  app = express();
const casenumber2='';
app.set("port", process.env.PORT || 0);
app.use(bodyParser.urlencoded({ extended: false }));
/*app.get("/", function(req,res){
  console.log("ASaghdghghaghdas");
  res.send("asasasasas Pooja");
})*/
app.post("/caseassign", _case.execute);


let slackMessages = slackInteractiveMessages.createMessageAdapter(SLACK_VERIFICATION_TOKEN);
  

function findAttachment(message, actionCallbackId) {
    return message.attachments.find(a => a.callback_id === actionCallbackId);
}
slackMessages.action("start:order", (payload, respond) => {
  console.log("index 6");
 
  console.log("qwert",payload,"End Qwert");
  
let casenumber=payload.actions[0].name;
  startOrder(casenumber)
        .then(respond)
        .catch(console.error);
  let casenumber1= casenumber.split();
  console.log('anything',casenumber1[0]);
 casenumber2=casenumber1[0];
   console.log('anything',casenumber2);
  console.log("payload.user.id" + payload.user.id);
  
})
function findSelectedOption(originalMessage, actionCallbackId, selectedValue) {
    const attachment = findAttachment(originalMessage, actionCallbackId);
    return attachment.actions[0].options.find(o => o.value === selectedValue);
}
slackMessages.action('order:select_type', (payload, respond) => {
  console.log("wrt",payload,payload.actions[0].selected_options,"wrt end");
  const updatedMessage = "Owner Is assigned";
    //const selectedType = findSelectedOption(payload.original_message, 'order:select_type', payload.actions[0].selected_options[0].value);
  console.log('selected value',payload.actions[0].selected_options[0].value);
  assignowner( payload.actions[0].selected_options[0].value,casenumber2)
 .then(() => {
      respond({ text: 'Owner Is changed Successfully' });
    })
  
    
  
        })
   
  let responseData;
let userId

function startOrder(casenumber)
  {
    console.log("here");
   return new Promise((resolve, reject) => {
      listOfTypes(casenumber).then(rData => {
          responseData = rData;
          console.log("Kuch Hua?", rData);
          resolve({
              text: 'Change Owner:'+casenumber,
              attachments: [{
                  color: '#5A352D',
                  callback_id: 'order:select_type',
                text:casenumber,
                   
                  actions: [{
                      pooja:casenumber,
                      name: 'select_type',
                      type: 'select',
                      options: responseData, 
                  }, ],
              }, ],
          });
        reject("An error occurred while creating a case2");
      })
  });
}
function listOfTypes(casenumber) {

    console.log('In this method');
    let test=[];
  let attachments= [];
    return new Promise((resolve, reject) => {
           _user.findusers('pooja')
      .then(data=>{
  //console.log('user.users',user.findusers);
         data.forEach(function (us) {
            let fields = [];
          //  user.users.forEach(users=> {
     // resp['records'][0]['_fields']['subject']
            fields.push({ title: "Id", value:us.getId(), short: true });
            fields.push({ title: "Name", value:us.get("Name"), short: true });
            test.push({ text:us.get("Name") , value: us.getId()+"#$#"+casenumber+"#$#"+us.get("Name"),case:casenumber });
          });
            resolve(test);
          
         reject("An error occurred while creating a case1");
         })
  
    });

     }
 

let ownerId
function assignowner(ownerId)
{
   let casenumber4=ownerId.split('#$#');
  console.log('owner',ownerId);
  let cownerId=casenumber4[0];
  let casenumber5=casenumber4[1];
  let caseownername= casenumber4[2];
  console.log('casenumber2',casenumber5);
  _user.changeowner([cownerId,casenumber5]);
  return axios.post(SLACK_WEBHOOK_URL, {
     
      attachments: [
        {
          color: '#5A352D',
          title: 'owner ('+caseownername+')'+' is assigned to the case: '+casenumber5
     },],
    }).then(() => Promise.resolve({
      text: `Your owner is sucessfully changed`,
    }));
}
        
//app.use(bodyParser.json());
app.use("/slack/actions", slackMessages.expressMiddleware());

console.log(slackMessages.expressMiddleware);
var keepAlive = require("node-keepalive");
//keepAlive({}, app);

app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
http.createServer(app).listen(app.get("port"), () => {
   setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

  console.log(`server listening on port ${app.get("port")}`);
});
var cronLink = require("node-cron-link");
cronLink("https://roomy-subway.glitch.me/keepalive", {time:2, kickStart: true});
cronLink("https://rogue-triceratops.glitch.me/keepalive", {time:2, kickStart: true});

