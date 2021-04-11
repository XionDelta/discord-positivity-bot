// ------------ import modules
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config');

const { getQuote, getOnlineQuote, getRandomInt } = require('./utilities');

// ------------ constants
const prefix = `!!`; // command prefix

// ------------ messaging functions
const pingServers = async () => {
  client.guilds.cache.forEach((guild) => {
    console.log(`Server: ${guild.name} - ${guild.id}`);
    console.log(` > Text Channels: `, guild.channels.cache.map(channel => `${channel.name} - ${channel.id}`));

    if (process.env.DEV === `true` && guild.id === process.env.TEST_SERVER || process.env.DEV === undefined) {
      let positivityChannelId = getPrioritizedChannelId(guild.channels.cache, `positivity`);
      // console.log(positivityChannelId);
      randomizeSendMessage(positivityChannelId);
    }
  });
}

const getPrioritizedChannelId = (channels, priorityChannelName) => {
  let prioritizedChannelId;

  for (let channel of channels.values()) {
    if (channel.type === `text`) {

      if (channel.name === priorityChannelName) {
        prioritizedChannelId = channel.id;
        break;
      }
      if (channel.name === `general` && prioritizedChannelId === undefined) {
        prioritizedChannelId = channel.id;
      }

    }
  }
  return prioritizedChannelId !== undefined ? prioritizedChannelId : channels.first().id;
}

const randomizeSendMessage = (channelId, maxRandom) => {
  const max = maxRandom || config.MAX_RANDOM_SEND_CHANCE || 1;
  // defaults to always sending
  const randomInt = getRandomInt(0, max);
  // console.log(randomInt);
  if (randomInt === 0) {
    sendMessage(channelId);
  }
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

const pingDiscord = () => {
  // ------------ log in client
  client.login(process.env.AUTH_TOKEN);

  // ------------ event handlers
  client.on('ready', async () => {
    // List servers the client is connected to
    pingServers();
  });

  client.on(`message`, async msg => {
    if (msg.author.bot) return;

    if (!msg.content.startsWith(prefix)) return;

    const commandBody = msg.content.slice(prefix.length);
    const args = commandBody.split(` `);
    const command = args.shift().toLowerCase();

    if (command === `quote`) {
      console.log(`quote command`);
      msg.channel.send(await getOnlineQuote());
    }

    if (command === `inspire`) {
      console.log(`inspire command`);
      msg.channel.send(getQuote());
    }
  });

  exports.helloWorld = (req, res) => {
    let message = req.query.message || req.body.message || 'Hello World!';
    res.status(200).send(message);
  };
}

module.exports = {
  pingDiscord,
}