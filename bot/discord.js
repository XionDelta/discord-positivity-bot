// ------------ import modules
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

const { getQuote, getOnlineQuote, getRandomInt } = require('./utilities');

const pingDiscord = () => {
  // ------------ log in client
  client.login(process.env.AUTH_TOKEN);

  // ------------ constants
  const prefix = `!!`; // command prefix

  // ------------ messaging functions
  const pingServers = async () => {
    console.log(`Servers:`)
    client.guilds.cache.forEach((guild) => {
      console.log(` - ` + guild.name);
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