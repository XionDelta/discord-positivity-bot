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

const timeToMs = (hours = 0, minutes = 0, seconds = 0, ms = 0) => {
  let time = 0;
  time += ms;
  time += seconds * 1000;
  time += minutes * 1000 * 60;
  time += hours * 1000 * 60 * 24;
  return time;
}

// ------------ events

client.on('ready', async () => {
  const random = getRandomInt(0, 2);
  console.log(random);
  // List servers the client is connected to
  if([1].includes(random)){
    pingServers();
  }
});

const pingServers = async () => {
  console.log("Servers:")
  client.guilds.cache.forEach((guild) => {
    console.log(" - " + guild.name);
    let positivityChannelId;

    // List all channels
    guild.channels.cache.forEach(channel => {
      console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
      // console.log(` -- ${channel.name} -- ${Object.getOwnPropertyNames(channel)}`);
      // channel.permissionOverwrites.forEach(permissionOverwrite => {
      //   console.log(permissionOverwrite.allow >= 1024);
      // })
      // console.log(`permissionOverwrites: `, channel.permissionOverwrites);
      // console.log(channel.permissionOverwrites.some(permissionOverwrite => permissionOverwrite.allow >= 1024));
      // Object.getOwnPropertyNames(channel).forEach(key => {
      //   console.log(`${key}:`, channel[key]);
      // })
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

client.on(`message`, async msg => {
  // console.log(msg);
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

// setInterval(() => {
//   const random = getRandomInt(0, 60);
//   console.log(random);
//   if([25, 33, 57, 20, 1].includes(random)){
//     pingServers();
//   }
// }, timeToMs(0, 0, 1, 0));

