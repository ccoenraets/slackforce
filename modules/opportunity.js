var org = require('./auth').org,

    OPPORTUNITY_TOKEN = process.env.SLACK_OPPORTUNITY_TOKEN;

function execute(req, res) {

    if (req.body.token != OPPORTUNITY_TOKEN) {
        res.send("Invalid token");
        return;
    }

    var limit = req.body.text;
    if (!limit || limit=="") limit = 5;

    var q = "SELECT Id, Name, Amount, Probability, StageName, CloseDate FROM Opportunity where isClosed=false ORDER BY amount DESC LIMIT " + limit;
    org.query({query: q}, function(err, resp) {
        if (err) {
            console.error(err);
            res.send("An error as occurred");
            return;
        }
        if (resp.records && resp.records.length>0) {
            var opportunities = resp.records;
            var attachments = [];
            opportunities.forEach(function(opportunity) {
                var fields = [];
                fields.push({title: "Opportunity", value: opportunity.get("Name"), short:true});
                fields.push({title: "Link", value: "https://login.salesforce.com/" + opportunity.getId(), short:true});
                fields.push({title: "Stage", value: opportunity.get("StageName"), short:true});
                fields.push({title: "Close Date", value: opportunity.get("CloseDate"), short:true});
                fields.push({title: "Amount", value: new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(opportunity.get("Amount")), short:true});
                fields.push({title: "Probability", value: opportunity.get("Probability") + "%", short:true});
                attachments.push({color: "#FCB95B", fields: fields});
            });
            res.json({
                response_type: "in_channel",
                text: "Top " + limit + " opportunities in the pipeline:",
                attachments: attachments
            });
        } else {
            res.send("No records");
        }
    });
}

exports.execute = execute;
