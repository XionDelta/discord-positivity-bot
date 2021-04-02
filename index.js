/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */

const pingDiscord = () => {
  require('dotenv').config();
  const Discord = require('discord.js');
  const quotes = require('./quotes.json');
  const axios = require("axios").default;
  const client = new Discord.Client();

  // ------------ log in client

  client.login(process.env.AUTH_TOKEN);

  // ------------ utility functions 

  const getQuote = () => quotes[getRandomInt(0, quotes.length)];

  // TODO: Write unit tests for this
  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  // ------------ messaging functions

  const pingServers = async () => {
    console.log("Servers:")
    client.guilds.cache.forEach((guild) => {
      console.log(" - " + guild.name);
      let positivityChannelId;

      if (process.env.DEV === `true` && guild.name === `Sy's server` || process.env.DEV === undefined) {
        // List all channels
        guild.channels.cache.forEach(channel => {
          channel.type === `text` && console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
          if (channel.type === `text`) {
            if (channel.name === `general` && positivityChannelId === undefined) {
              positivityChannelId = channel.id;
            }
            if (channel.name === `positivity`) {
              positivityChannelId = channel.id;
            }
          }
        });
        sendMessage(positivityChannelId);
      }
    });
  }

  const sendMessage = async channelId => {
    try {
      const channel = await client.channels.fetch(channelId);
      const quote = getQuote();
      console.log(`sending to ${channelId}: ${quote}`);
      channel.send(quote);
    } catch (err) {
      console.log(err);
    }
  }

  // ------------ event handlers

  client.on('ready', async () => {
    const random = getRandomInt(0, 2);
    console.log(random);
    // List servers the client is connected to
    // if([1].includes(random)){
    pingServers();
    // }
  });
}

exports.pingDiscord = (event, context) => {
  pingDiscord();

  const message = event.data
    ? Buffer.from(event.data, 'base64').toString()
    : 'Ping triggered';
  console.log('Ping triggered');
};

// A bit of a hack to run a local version of the function
// better way would be separate the Discord code into another file and import into the two exec points
const executeDev = () => {
  require('dotenv').config();
  if (process.env.DEV === `true`) {
    pingDiscord();
  }
}

executeDev();