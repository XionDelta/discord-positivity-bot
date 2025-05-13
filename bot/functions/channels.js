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

const sendMessageToChannelWithRandomChance = (channelId, maxRandom) => {
  const max = maxRandom || config.RANDOM_MAX_VALUE_FOR_SEND_CHANCE || 1;
  // defaults to always sending if no configuration
  const randomInt = getRandomInt(0, max);
  // console.log(randomInt);
  if (randomInt === 0) {
    sendMessageToChannel(channelId);
  }
}

const sendMessageToChannel = async channelId => {
  try {
    const channel = await client.channels.fetch(channelId);
    const quote = getQuote();
    console.log(`sending to ${channelId}: ${quote}`);
    channel.send(quote);
  } catch (err) {
    console.log(err);
  }
}

const sendTodayMessageToChannel = async channelId => {
  try {
    const channel = await client.channels.fetch(channelId);
    const quote = getOnlineQuoteToday();
    console.log(`sending to ${channelId}: ${quote}`);
    channel.send(quote);
  } catch (err) {
    console.log(err);
  }
}