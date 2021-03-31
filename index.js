require('dotenv').config();
const Discord = require('discord.js');
const quotes = require('./quotes.json');
const axios = require("axios").default;
const client = new Discord.Client();

// ------------ log in client
client.login(process.env.AUTH_TOKEN);

// ------------ consts

const options = {
  method: `GET`,
  url: `https://zenquotes.io/api/random`,
};

const prefix = `!!`;

// ------------ utility functions 

const getQuote = () => quotes[getRandomInt(0, quotes.length)];

const getOnlineQuote = async () => {
  try {
    const response = await axios.request(options);
    // console.log(repsonse.data);
    const { a, q } = response.data[0];
    return `"${q}" - ${a}`;
  } catch (err) {
    console.error(err);
  }

  return ``;
}

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

    // List all channels
    guild.channels.cache.forEach(channel => {
      console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
      if (channel.type === `text`) {
        if (channel.name === `general` && positivityChannelId === undefined) {
          positivityChannelId = channel.id;
        }
        if (channel.name === `positivity`) {
          positivityChannelId = channel.id;
        }
      }
    })
    sendMessage(positivityChannelId);
  });
}

const sendMessage = async channelId => {
  try {
    const channel = await client.channels.fetch(channelId);
    channel.send(getQuote());
  } catch (err) {
    console.log(err);
  }
}

// ------------ event handlers

client.on('ready', async () => {
  const random = getRandomInt(0, 2);
  console.log(random);
  // List servers the client is connected to
  if([1].includes(random)){
    pingServers();
  }
});

client.on(`message`, async msg => {
  if (msg.author.bot) return;

  if (!msg.content.startsWith(prefix)) return;

  const commandBody = msg.content.slice(prefix.length);
  const args = commandBody.split(` `);
  const command = args.shift().toLowerCase();

  if (command === "quote") {
    console.log(`quote`);
    msg.channel.send(await getOnlineQuote());
  }

  if (command === "inspire") {
    console.log(`quote`);
    msg.channel.send(getQuote());
  }
});
