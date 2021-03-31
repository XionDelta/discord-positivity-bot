require('dotenv').config();
const Discord = require('discord.js');
const quotes = require('./quotes.json');

const client = new Discord.Client();
client.login(process.env.AUTH_TOKEN);

var axios = require("axios").default;

var options = {
  method: `GET`,
  url: `https://zenquotes.io/api/random`,
};

const prefix = `!!`;

const channels = [];
let generalChannelId;

client.on('ready', async () => {
  // List servers the client is connected to
  console.log("Servers:")
  client.guilds.cache.forEach((guild) => {
    console.log(" - " + guild.name);

    // List all channels
    guild.channels.cache.forEach((channel) => {
      console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
      channels.push(channel);
      if (channel.name === `general`) {
        generalChannelId = channel.id;
      }
    })
  });
  
  try {
    const generalChannel = await client.channels.fetch(generalChannelId);
    generalChannel.send(getQuote());
  } catch (err) {
    console.log(err);
  }
});

client.on(`message`, async msg => {
  // console.log(msg);
  if (msg.author.bot) return;

  if (!msg.content.startsWith(prefix)) return;

  const commandBody = msg.content.slice(prefix.length);
  const args = commandBody.split(` `);
  const command = args.shift().toLowerCase();

  if (command === "quote") {
    console.log(`quote`);
    msg.channel.send(getQuote());
  }
});

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
