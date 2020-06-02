const router = require('express').Router();
const mongoose = require('mongoose');
const Article = mongoose.model('Article');

// GET A LIST OF TAGS
router.get('/', async (req, res, next) => {
  try {
    const tags = await Article.find().distinct('tagList');

    return res.json({ tags });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
