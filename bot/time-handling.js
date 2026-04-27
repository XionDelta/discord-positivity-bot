// this is where the logical decision making based on the time triggered will sit

const isOnTheHour = () => new Date().getMinutes === 0;

exports = {
  isOnTheHour,
}