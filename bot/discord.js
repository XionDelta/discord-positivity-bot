// ------------ import modules
require('dotenv').config();
const { Discord, Client, GatewayIntentBits } = require('discord.js');
const config = require('./config');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.DirectMessages,
	],
});

const {
  getQuote,
  getOnlineQuoteToday,
  getRandomInt,
  leadingZero,
} = require('./utilities');

// ------------ constants
const prefix = `!!`; // command prefix

// ------------ messaging functions
const pingServers = async () => {
  const now = new Date();
  showTime(now);
  // List servers the client is connected to
  client.guilds.cache.forEach(server => pingServer(server, now));
}

const pingServer = async (server, time) => {
  logServerDetails(server);

  if (shouldSendMessage(server.id, time)) {
    let positivityChannelId = getPrioritizedChannelId(server.channels.cache, `positivity`);
    // console.log(positivityChannelId);
    sendMessageWithRandomChance(positivityChannelId);
  }

  if (shouldSendDailyMessage(server.id, time)) {
    let positivityChannelId = getPrioritizedChannelId(server.channels.cache, `positivity`);
    // console.log(positivityChannelId);
    sendTodayMessage(positivityChannelId);
  }

}

const showTime = time => {
  console.log(`Trigger time: ${leadingZero(time.getHours())}:${leadingZero(time.getMinutes())}`);
}

const logServerDetails = async server => {
  console.log(`Server: ${server.name} - ${server.id}`);
  console.log(` > Text Channels: `, server.channels.cache.map(channel => `${channel.name} - ${channel.id}`));
}

const isOnTheHour = time => time.getMinutes() === 0;
const isDev = serverId => process.env.DEV === `true` && serverId === process.env.TEST_SERVER;
const shouldSendMessage = (serverId, time) => isDev(serverId) || (!process.env.DEV && isOnTheHour(time));

const shouldSendDailyMessage = (serverId, time) => shouldSendMessage(serverId, time) && time.getHours() === 7;

const getPrioritizedChannelId = (channels, priorityChannelName) => {
  let prioritizedChannelId;

  for (let channel of channels.values()) {
    if (channel.type === 0) { // text I guess?
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

const sendTodayMessage = async channelId => {
  try {
    const channel = await client.channels.fetch(channelId);
    const quote = getOnlineQuoteToday();
    console.log(`sending to ${channelId}: ${quote}`);
    channel.send(quote);
  } catch (err) {
    console.log(err);
  }
}

const pingDiscord = async () => {
  // ------------ log in client
  // console.log(client.readyAt)
  if (!client.readyAt) {
   await client.login(process.env.AUTH_TOKEN);
  } else {
    pingServers();
  }

  // ------------ event handlers
  client.on('ready', async () => {
    console.log(`ready, ${client.readyAt}`);
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

    if (command === `uptime`) {
      console.log(`uptime command`);
      msg.channel.send(`Ready at: ${client.readyAt}, uptime: ${client.uptime}`);
    }
  });
}

module.exports = {
  pingDiscord,
}