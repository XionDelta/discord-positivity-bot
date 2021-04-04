// ------------ import modules
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

const { getQuote, getOnlineQuote, getRandomInt } = require('./utilities');

// ------------ constants
const prefix = `!!`; // command prefix

// ------------ messaging functions
const pingServers = async () => {
  console.log(`Servers:`)
  client.guilds.cache.forEach((guild) => {
    console.log(` - ${guild.name} - ${guild.id}`);
    let positivityChannelId;

    if (process.env.DEV === `true` && guild.id === `819962399888637983` || process.env.DEV === undefined) {
      // List all channels
      guild.channels.cache.forEach(channel => {
        channel.type === `text` && console.log(`  > ${channel.name} (${channel.type}) - ${channel.id}`)
        if (channel.type === `text`) {
          if (channel.name === `general` && positivityChannelId === undefined) {
            positivityChannelId = channel.id;
          }
          if (channel.name === `positivity`) {
            positivityChannelId = channel.id;
          }
        }
      });
      randomizeSendMessage(positivityChannelId);
    }
  });
}

const randomizeSendMessage = channelId => {
  const randomInt = getRandomInt(0, 2);
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