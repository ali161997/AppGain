// const imports = require('../usedModules');
const mongoose = require('mongoose');
const dns = require('dns');
const util = require('util');
const URL = require('url').URL;

const MobileSchema = new mongoose.Schema({
  primary: {
    type: String,
    validate: {
      validator: validURl,
      message: (props) => `${props.value} is not a valid URL`,
    },
  },
  fallback: {
    type: String,
    validate: {
      validator: async () => validURl,
      message: (props) => `${props.value} is not a valid URL`,
    },
  },
});
const ShortnerSchema = new mongoose.Schema({
  slug: {
    unique: true,
    type: String,
    immutable: true,
    minlength: [3, 'Slug Length Should be More Than 2 Characters'],
    maxlength: [8, 'Slug Length Should be Less Than 8 Characters'],
    required: [true, 'Slug Required'],
  },
  ios: {
    type: MobileSchema,
  },
  android: {
    type: MobileSchema,
  },
  web: {
    type: String,
    validate: {
      validator: validURl,
      message: (props) => `${props.value} is not a valid URL`,
    },
  },
});
async function validURl(url) {
  try {
    new URL(url);
    const lookup = util.promisify(dns.lookup);
    const originalUrl = new URL(url);
    await lookup(originalUrl.hostname);
    console.log('in try lookup');
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = mongoose.model('Shortner', ShortnerSchema);
