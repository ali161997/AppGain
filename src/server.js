const express = require('express');
require('dotenv').config();
const router = require('../src/controller/shorten');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT;
app.use(express.json());
app.use('/shortlinks', router);
app.get('*', (req, res) => {
  res.send({ message: 'Welcom to Appgain Shortner App' });
});
(async () => {
  try {
    //localDB->`mongodb://${process.env.DATABASE}/${process.env.dbName}`
    await mongoose.connect(process.env.DATABASE);
    app.listen(port, () =>
      console.log(`AppGain ShortenURL App Starts On port ${port}!`)
    );
  } catch (error) {
    console.error(error);
  }
})();
