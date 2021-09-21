# Slackforce

A simple Node.js application that acts as a Slash Command message broker between Slack and Salesforce.

Watch [this video](https://youtu.be/xB-1SsUoBHk) to see the application in action. Read [this blog post](https://medium.com/@ccoenraets/slack-and-salesforce-integration-part-2-a29584c85274) for more details. 

Follow the instructions below to deploy your own instance of the application:

### Step 1: Create a Connected App

A **Connected App** is a secure API endpoint on a salesforce org. In this case, it will enable an oAuth connection specifically for this slack app, complete with client ID and client secret. If you haven't already done so, follow the steps below to create a Salesforce connected app:

1. In Salesforce Setup, type **App Manager** in the quick find box, and click the **App Manager** link

1. Click the  **New Connected App** button on the far right, and define the Connected App as follows:

    - Connected App Name: SlackMySalesforce (or any name you want)
    - API Name: SlackMySalesforce
    - Contact Email: enter your email address
    - Enable OAuth Settings: Checked
    - Callback URL: https://myapp.herokuapp.com/oauthcallback (You'll change this later)
    - Selected OAuth Scopes: Full Access (full)
    - Click **Save**

### Step 2: Deploy this Slash Commands repo right to Heroku

1. Make sure you are logged in to the [Heroku Dashboard](https://dashboard.heroku.com/). This will eventually be where you can see a list of all your heroku apps. If you don't have a heroku account, you can sign up. You will be asked for a credit card, but not charged for just hobby development.

1. Click the button below to deploy this Slash Commands service on Heroku:

    [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

1. Fill in the config variables as described. If you need to get to these later, these can be found by clicking on your App Name in the heroku dashboard, and then clicking on the subtab Settings, then the "Reveal Config Vars" button. Click the pencil to edit each one.

    - For **SF_CLIENT_ID**, enter the Consumer Key of your Salesforce Connected App
    - For **SF_CLIENT_SECRET**, enter the Consumer Secret of your Salesforce Connected App
    - For **SF_USER_NAME**, enter the the username of your Salesforce integration user
    - For **SF_PASSWORD**, enter the the username of your Salesforce integration user

1. Once your app is deployed, go back to the Connected App in Salesforce, and change the OAuth callback URL: Use the URL of your actuall Heroku app, followd by /oauthcallback. For example: https://mynewapp.herokuapp.com/oauthcallback

### Step 3: Create the Slack App & Enable Slack Commands

1. In a browser, go to the customization page for your Slack workspace. For example ```https://YOUR_TEAM_NAME.slack.com/customize/```. Replace ```YOUR_TEAM_NAME``` with your actual team/workspace name. Click the "hanburger" menu icon in the upper left, and open the Configure Apps menu. In the upper right, click on "Build".

1. Click on **Create New App**, and choose 'from scratch'.

1. Choose a name: 'SlackMySalesforce', and choose your workspace. Click **Create App**.

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

1. Go back to slack, and try one of the /commands from above. The first time you may be asked to authenticate. Once complete, you should be off and running.

Troubleshooting:
1. After step 2.4, don't forget to update the callback in the Connected App in your salesforce org.
1. You will not see anything at the home URL for your heroku app, when viewed from the browser. It will be a blank page. That is normal.
1. You will not be able to test your heroku app from your browser for the /account and other commands, since these only work for POST operations. You CAN do some limited testing using cURL: 'curl -X POST -H 'Content-type: application/json' --data '{"text":"Tycoo"}' http://127.0.0.1:5000/'  . However, some slack vars like the user id will not be available.
1. Check your heroku logs in realtime from a terminal window with 'heroku logs --tail' command
1. Don't be afraid to use console.log() in your code to check variables, which you will see in the heroku logs.