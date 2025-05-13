// ------------ import modules
require('dotenv').config();
const { Discord, Client, GatewayIntentBits } = require('discord.js');
const config = require('./config');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.DirectMessages,
	],
});

const {
  getQuote,
} = require('./utilities');

const {
  showTime,
} = require('./functions/logging');

const {
  sendMessageToUserWithRoleWithRandomChance,
} = require('./functions/dms');

// ------------ constants
const prefix = `!!`; // command prefix

// ------------ messaging functions
const pingServers = async () => {
  const now = new Date();
  showTime(now);
  // Ping servers the bot is connected to
  client.guilds.cache.forEach(server => pingServer(server, now));
}

const pingServer = async (server, time) => {
  // logServerDetails(server);

  if (shouldSendMessage(server.id, time)) {
    // let positivityChannelId = getPrioritizedChannelId(server.channels.cache, `positivity`);
    // console.log(positivityChannelId);
    sendMessageToUserWithRoleWithRandomChance(server, "positivity");
  }

  if (shouldSendDailyMessage(server.id, time)) {
    let positivityChannelId = getPrioritizedChannelId(server.channels.cache, `positivity`);
    // console.log(positivityChannelId);
    sendTodayMessageToChannel(positivityChannelId);
  }
}

const isOnTheHour = time => time.getMinutes() === 0;
const isDev = serverId => process.env.DEV === `true` && serverId === process.env.TEST_SERVER;
const shouldSendMessage = (serverId, time) => isDev(serverId) || (!process.env.DEV && isOnTheHour(time));
const shouldSendDailyMessage = (serverId, time) => shouldSendMessage(serverId, time) && time.getHours() === 7;

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
    console.log(`Ready, ${client.readyAt}`);
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