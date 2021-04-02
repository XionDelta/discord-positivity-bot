/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.pingDiscord = (event, context) => {
  require('./bot/discord').pingDiscord();

  const message = event.data
    ? Buffer.from(event.data, 'base64').toString()
    : 'Ping triggered';
  console.log('Ping triggered');
};

// A bit of a hack to run a local version of the function
const executeDev = () => {
  require('dotenv').config();
 
  if (process.env.DEV === `true`) {
    require('./bot/discord').pingDiscord();
  }
}

executeDev();