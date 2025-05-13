const showTime = time => {
  console.log(`Trigger time: ${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}`);
}

const logServerDetails = async server => {
  console.log(`Server: ${server.name} - ${server.id}`);
  console.log(` > Text Channels: `, server.channels.cache.map(channel => `${channel.name} - ${channel.id}`));
}

module.exports = {
  showTime,
  logServerDetails,
}