const router = require('express').Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const User = mongoose.model('User');
const auth = require('../middleware/auth');

// Preload article objects on routes with ':article'
router.param('article', async (req, res, next, slug) => {
  try {
    const article = await Article.findOne({ slug }).populate('author');

    if (!article) return res.sendStatus(404);

    req.article = article;

    return next();
  } catch (err) {
    next(err);
  }
});

// CREATE AN ARTICLE
router.post('/', auth.required, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.id);

    if (!user) return res.sendStatus(401);

    let article = await new Article(req.body.article);

    article.author = user;

    article = await article.save();

    return res.status(201).json({ article: article.toJSONFor(user) });
  } catch (err) {
    next(err);
  }
});

// GET AN ARTICLE
router.get('/:article', auth.optional, async (req, res, next) => {
  try {
    const results = await Promise.all([
      req.payload && User.findById(req.payload.id),
      req.article.populate('author').execPopulate(),
    ]);

    const user = results[0];

    return res.json({ article: req.article.toJSONFor(user) });
  } catch (err) {
    next(err);
  }
});

// UPDATE AN ARTICLE
router.put('/:article', auth.required, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.id);

    if (!user) return res.sendStatus(401);

    if (req.article.author._id.toString() === req.payload.id.toString()) {
      const { title, description, body } = req.body.article;

      if (typeof title !== 'undefined') req.article.title = title;
      if (typeof description !== 'undefined') req.article.description = description;
      if (typeof body !== 'undefined') req.article.body = body;

      const article = await req.article.save();

      return res.json({ article: article.toJSONFor(user) });
    } else {
      return res.sendStatus(403);
    }
  } catch (err) {
    next(err);
  }
});

// DELETE AN ARTICLE
router.delete('/:article', auth.required, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.id);

    if (!user) return res.sendStatus(401);

    if (req.article.author._id.toString() === req.payload.id.toString()) {
      await req.article.deleteOne();
      return res.sendStatus(204);
    } else {
      return res.sendStatus(403);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
