// ------------ import modules
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config');

const {
  getQuote,
  getOnlineQuote,
  getRandomInt,
  leadingZero,
} = require('./utilities');

// ------------ constants
const prefix = `!!`; // command prefix

// ------------ messaging functions
const pingServers = async () => {
  showTime();
  // List servers the client is connected to
  client.guilds.cache.forEach(pingServer);
}

const pingServer = async server => {
  logServerDetails(server);

  if (shouldSendMessage) {
    let positivityChannelId = getPrioritizedChannelId(server.channels.cache, `positivity`);
    // console.log(positivityChannelId);
    sendMessageWithRandomChance(positivityChannelId);
  }
}

const showTime = () => {
  const now = new Date();
  console.log(`Trigger time: ${leadingZero(now.getHours())}:${leadingZero(now.getMinutes())}`);
}

const logServerDetails = async server => {
  console.log(`Server: ${server.name} - ${server.id}`);
  console.log(` > Text Channels: `, server.channels.cache.map(channel => `${channel.name} - ${channel.id}`));
}

const shouldSendMessage = () => (process.env.DEV === `true` && server.id === process.env.TEST_SERVER) || process.env.DEV === undefined

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

const sendMessageWithRandomChance = (channelId, maxRandom) => {
  const max = maxRandom || config.RANDOM_MAX_VALUE_FOR_SEND_CHANCE || 1;
  // defaults to always sending if no configuration
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
}

module.exports = {
  pingDiscord,
}