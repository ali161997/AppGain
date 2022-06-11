const mongoose = require('mongoose');
require('../model/shorten');
const Shortner = mongoose.model('Shortner');
const { generateRandomShortenLink } = require('../helper/shorten');
const { StatusCodes } = require('http-status-codes');
exports.getAllSlugs = async (req, res) => {
  try {
    // ** if need only Slugs append ".select('slug -_id')"
    const data = await Shortner.find({});
    res.status(StatusCodes.OK).send(data);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST);
  }
};

exports.createShortener = async (req, res) => {
  try {
    if (!req.body.slug) {
      req.body.slug = generateRandomShortenLink();
      let found = await Shortner.find({ slug: req.body.slug }).exec();
      while (found.length > 0) {
        req.body.slug = generateRandomShortenLink();
        found = await Shortner.find({ slug: req.body.slug }).exec();
      }
    }
    const shortener = new Shortner(req.body);
    const ShortenSaved = await shortener.save();
    res.status(StatusCodes.CREATED).send(ShortenSaved);
  } catch (error) {
    if (error.code && error.code === 11000) {
      message = 'duplicate Slug Error';
      res.status(StatusCodes.NOT_ACCEPTABLE).send({ message });
    } else {
      res.status(StatusCodes.BAD_REQUEST).send({ message: error.message });
    }
  }
};
exports.UpdateShortner = async (req, res) => {
  try {
    const slug = req.params.slug;
    if (!slug) throw new Error('No Slug Found');
    if (req.body.slug) throw new Error('Slug Is Immutable');
    const result = await Shortner.findOneAndUpdate({ slug }, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    res.status(StatusCodes.NOT_ACCEPTABLE).send(error.message);
  }
};
