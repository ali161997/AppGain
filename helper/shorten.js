const randomstring = require('randomstring');
exports.generateRandomShortenLink = () => {
  return randomstring.generate({
    length: 5,
    charset: 'alphanumeric',
  });
};
