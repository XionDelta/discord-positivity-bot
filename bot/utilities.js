// ------------ import modules
const quotes = require('./quotes.json');
const axios = require("axios").default;

// ------------ constants
const options = {
  method: `GET`,
  url: `https://zenquotes.io/api/random`,
};

const getQuote = () => quotes[getRandomInt(0, quotes.length)];

const getOnlineQuote = async () => {
  try {
    const response = await axios.request(options);
    const { a, q } = response.data[0];
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
  getOnlineQuote,
  getRandomInt
}