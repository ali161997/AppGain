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
    req.body.slug = !req.body.slug ? await generateNewSlug() : req.body.slug;
    const shortener = new Shortner(req.body);
    const ShortenSaved = await shortener.save();
    res.status(StatusCodes.CREATED).send(ShortenSaved);
  } catch (error) {
    if (error.code && error.code === 11000) {
      res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .send({ message: 'duplicate Slug Error' });
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
    !result
      ? res
          .status(StatusCodes.NOT_FOUND)
          .send({ message: ` ${slug} Not Found` })
      : res.status(StatusCodes.OK).send(result);
  } catch (error) {
    res.status(StatusCodes.NOT_ACCEPTABLE).send(error.message);
  }
};
async function generateNewSlug() {
  let slug = generateRandomShortenLink();
  let found = await Shortner.find({ slug }).exec();
  while (found.length > 0) {
    slug = generateRandomShortenLink();
    found = await Shortner.find({ slug }).exec();
  }
  return slug;
}
