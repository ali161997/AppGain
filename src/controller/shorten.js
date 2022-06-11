const express = require('express');
const router = express.Router();
const {
  getAllSlugs,
  createShortener,
  UpdateShortner,
} = require('../service/shorten');

router.get('/', getAllSlugs);

router.post('/', createShortener);

router.put('/:slug', UpdateShortner);

module.exports = router;
