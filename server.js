const express = require('express');
require('dotenv').config();
const router = require('./controller/shorten');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT;
app.use(express.json());
app.use('/shortlinks', router);
(async () => {
  try {
    await mongoose.connect(
      `mongodb://${process.env.DATABASE}/${process.env.dbName}`
    );
    app.listen(port, () =>
      console.log(`AppGain ShortenURL App Starts On port ${port}!`)
    );
  } catch (error) {
    console.error(error);
  }
})();
