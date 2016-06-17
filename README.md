# Slackforce

A simple Node.js application that acts as a Slash Command message broker between Slack and Salesforce.

Watch [this video](https://youtu.be/xB-1SsUoBHk) to see the application in action.
 
Read [this blog post](http://coenraets.org/blog/2016/01/slack-salesforce-integration-part-2/) for more details. 

Follow the instructions below to deploy your own instance of the application:

### Step 1: Create a Connected App

If you haven't already done so, follow the steps below to create a Salesforce connected app:

1. In Salesforce Setup, type **Apps** in the quick find box, and click the **Apps** link

1. In the **Connected Apps** section, click **New**, and define the Connected App as follows:

    - Connected App Name: MyConnectedApp (or any name you want)
    - API Name: MyConnectedApp
    - Contact Email: enter your email address
    - Enabled OAuth Settings: Checked
    - Callback URL: https://myapp.herokuapp.com/oauthcallback (You'll change this later)
    - Selected OAuth Scopes: Full Access (full)
    - Click **Save**

### Step 2: Deploy the Slash Commands

1. Make sure you are logged in to the [Heroku Dashboard](https://dashboard.heroku.com/)
1. Click the button below to deploy the Slash Commands on Heroku:

    [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

1. Fill in the config variables as described.

    - For **SF_CLIENT_ID**, enter the Consumer Key of your Salesforce Connected App
    - For **SF_CLIENT_SECRET**, enter the Consumer Secret of your Salesforce Connected App
    - For **SF_USER_NAME**, enter the the username of your Salesforce integration user
    - For **SF_PASSWORD**, enter the the username of your Salesforce integration user
    - Leave **SLACK_ACCOUNT_TOKEN** blank for now.
    - Leave **SLACK_CONTACT_TOKEN** blank for now.
    - Leave **SLACK_OPPORTUNITY_TOKEN** blank for now.
    - Leave **SLACK_CASE_TOKEN** blank for now.
    - Leave **SLACK_WHOAMI_TOKEN** blank for now.

1. Once your app is deployed, go back to the Connected App in Salesforce, and change the OAuth callback URL: Use the URL of your actuall Heroku app, followd by /oauthcallback. For example: https://mynewapp.herokuapp.com/oauthcallback

### Step 3: Create the Slash Commands in Slack

1. In a browser, go to the custom integration page for your Slack team. For example ```https://YOUR_TEAM_NAME.slack.com/apps/manage/custom-integration```. Replace ```YOUR_TEAM_NAME``` with your actual team name.

1. Click **Slash Commands**, and click **Add Configuration**

1. In the **Choose a Command** input field, type **/pipeline** and click **Add Slash Command Integration**

1. In the **Integration Settings** section: 

    - Command: /pipeline
    - URL: the URL of the app you deployed on Heroku followed by /pipeline. For example: ```https://your-heroku-app.herokuapp.com/pipeline```
    - Method: POST
    - Copy the token, open another browser tab, login to the Heroku Dashboard, and set the Heroku **SLACK_OPPORTUNITY_TOKEN** config variable to the value of that token (**Setting>Reveal Config Vars**)
    - Customize Name: Salesforce Opportunities
    
    Click **Save Integration**.
    
1. Repeat these steps to create another Slash command called **/account**, calling ```https://your-heroku-app.herokuapp.com/account```. In the Heroku dashboard, set the **SLACK_ACCOUNT_TOKEN** config var to the value of the token that was generated in Slack.    

1. Repeat these steps to create another Slash command called **/contact**, calling ```https://your-heroku-app.herokuapp.com/contact```. In the Heroku dashboard, set the **SLACK_CONTACT_TOKEN** config var to the value of the token that was generated in Slack.    

1. Repeat these steps to create another Slash command called **/case**, calling ```https://your-heroku-app.herokuapp.com/case```. In the Heroku dashboard, set the **SLACK_CASE_TOKEN** config var to the value of the token that was generated in Slack.    

1. Repeat these steps to create another Slash command called **/whoami**, calling ```https://your-heroku-app.herokuapp.com/whoami```. In the Heroku dashboard, set the **SLACK_WHOAMI_TOKEN** config var to the value of the token that was generated in Slack.    
