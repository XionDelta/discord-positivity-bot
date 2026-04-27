const config = require('../config');
const {
  getQuote,
  getRandomInt,
} = require('../utilities');

const sendMessageToUserWithRoleWithRandomChance = (server, roleName, maxRandom) => {
  const max = maxRandom || config.RANDOM_MAX_VALUE_FOR_SEND_CHANCE || 1;
  // defaults to always sending if no configuration
  const randomInt = getRandomInt(0, max);
  // console.log(randomInt);
  if (randomInt === 0) {
    sendMessageToUsersWithRole(server, roleName);
  }
}

const sendMessageToUsersWithRole = async (server, roleName) => {
  let res = await server.members.fetch();
  const quote = getQuote(); // await getOnlineQuoteToday();
  res.forEach((member) => {
      // console.log(member.user.username);
      if (member.roles.cache.some(role => role.name === roleName)) {
        // console.dir(member.roles.cache.some(role => role.name === "positivity"));
        member.user.send(quote);
      }
  });
}

module.exports = {
  sendMessageToUserWithRoleWithRandomChance,
}