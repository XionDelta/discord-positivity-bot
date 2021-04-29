# Positivity Discord bot

# General
## Overview
This bot will post a positive message into a channel on every server it is linked to. 

## Usage
Use this link to invite the bot to your server: https://discord.com/api/oauth2/authorize?client_id=826581883969208379&permissions=3072&scope=bot

Ensure there is a `#general` or `#positivity` channel for the messages to be posted into.

# Technical notes
## Operation
*This bot is not designed to be run by someone else, but is entirely possible to do so if you have a Discord developer portal bot and your own Discord server to test on.*

It has a 1 in 5 chance each hour to send a message to each server. The random chance is wrapped around the sending of the message, so each execution could send a message to any or none of the servers.

It will prioritize the `#positivity` channel if it exists, but will otherwise post into the `#general` channel. It currently can't handle a situation where neither of these channels exist.

## Running locally
Use this command to install required packages
```
npm install
```

The command will start the bot
```
npm start
```

You will need an `.env` file with the following in it:
```
AUTH_TOKEN={DISCORD_BOT_AUTH_TOKEN}
TEST_SERVER={YOUR_DISCORD_SERVER}
DEV=true
```

The `AUTH_TOKEN` is needed to connect the code to the Discord bot in the developer portal. `DEV` is needed to ensure it only pings the `TEST_SERVER` when it's run. If the `DEV` variable is `undefined` (missing) it will *ping all servers it's on*. 

## Deployment
The following command will manually deploy the local source into GCP
```
gcloud functions deploy positivity-bot --project {project} --trigger-topic trigger-positivity-message --runtime nodejs14 --region {region} --entry-point pingDiscord
```
This is automatically triggered by cloud build on merge into main.