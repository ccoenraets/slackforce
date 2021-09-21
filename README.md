# Slackforce

A simple Node.js application that acts as a Slash Command message broker between Slack and Salesforce.

Watch [this video](https://youtu.be/xB-1SsUoBHk) to see the application in action.
 
Read [this blog post](https://medium.com/@ccoenraets/slack-and-salesforce-integration-part-2-a29584c85274) for more details. 

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
1.1 If you don't have a heroku account, you can sign up. You will be asked for a credit card, but not charged for just hobby development.
1. Click the button below to deploy this Slash Commands service on Heroku:

    [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

1. Fill in the config variables as described.

    - For **SF_CLIENT_ID**, enter the Consumer Key of your Salesforce Connected App
    - For **SF_CLIENT_SECRET**, enter the Consumer Secret of your Salesforce Connected App
    - For **SF_USER_NAME**, enter the the username of your Salesforce integration user
    - For **SF_PASSWORD**, enter the the username of your Salesforce integration user

1. Once your app is deployed, go back to the Connected App in Salesforce, and change the OAuth callback URL: Use the URL of your actuall Heroku app, followd by /oauthcallback. For example: https://mynewapp.herokuapp.com/oauthcallback

### Step 3: Create the Slash Commands in Slack

1. In a browser, go to the customization page for your Slack workspace. For example ```https://YOUR_TEAM_NAME.slack.com/customize/```. Replace ```YOUR_TEAM_NAME``` with your actual team name. Click the "hanburger" menu icon in the upper left, and open the Configure Apps menu. In the upper right, click on "Build".
1. click on **Create New App**, and choose 'from scratch'

1. choose a name 'SlackMySalesforce', and choose a workspace. click **Create App**.

1. On the Basic Information page for your app, open the **Add features and functionality** area.

1. Click **Slash Commands**, and click **Create New Command**

1. In the **Command** input field, type **/pipeline** and fill in the rest of the fields:

    - Command: /pipeline
    - URL: the URL of the app you deployed on Heroku followed by /pipeline. For example: ```https://your-heroku-app.herokuapp.com/pipeline```
    - Description
    - Add usage guidance text (check the preview of the Autocomplete Entry at the bottom)
    
    Click **Save**.
    
1. Repeat these steps to create another Slash command called **/account**, calling ```https://your-heroku-app.herokuapp.com/account```. 

1. Repeat these steps to create another Slash command called **/contact**, calling ```https://your-heroku-app.herokuapp.com/contact```. 

1. Repeat these steps to create another Slash command called **/case**, calling ```https://your-heroku-app.herokuapp.com/case```. 

1. Repeat these steps to create another Slash command called **/whoami**, calling ```https://your-heroku-app.herokuapp.com/whoami```. 

1. Back on the **Basic Information** page for the app, click on **Install your App**. You will have to do this each time you change your commands

1. Go back to slack, and try one of the /commands from above . The first time you may be asked to authenticate. Once complete, you should be off and running

Troubleshooting:
1. Don't forget to change the callback in the Connected App in your salesforce org.
1. You will not see anything at the home URL for your heroku app, when viewed from the browser. It will be a blank page
1. You will not be able to test your heroku app from your browser for the /account and other commands, since these only work for POST operations. you can do some limited testing using cURL: 'curl -X POST -H 'Content-type: application/json' --data '{"text":"Tycoo"}' http://127.0.0.1:5000/'  . However, some slack vars like the user id will not be available.
1. Check your heroku logs in realtime from a terminal window with 'heroku logs --tail'
1. Don't be afraid to use console.log in your code to check variables, which you will see in the heroku logs.