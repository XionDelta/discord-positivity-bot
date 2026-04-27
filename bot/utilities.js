// ------------ import modules
const quotes = require('./data/quotes.json');

const getQuote = () => quotes[getRandomInt(0, quotes.length)];

const getOnlineQuoteRandom = async () => getOnlineQuote(`https://zenquotes.io/api/random`);
const getOnlineQuoteToday = async () => getOnlineQuote(`https://zenquotes.io/api/today`);

const getOnlineQuote = async url => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const { a, q } = data[0];
    return `${q} -${a}`;
  } catch (err) {
    console.error(err);
    return ``;
  }
}

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

module.exports = {
  getQuote,
  getOnlineQuoteRandom,
  getOnlineQuoteToday,
  getRandomInt,
}