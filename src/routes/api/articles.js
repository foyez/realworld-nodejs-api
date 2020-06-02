const router = require('express').Router();
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const User = mongoose.model('User');
const Comment = mongoose.model('Comment');
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

// Preload comment objects on routes with ':comment'
router.param('comment', async (req, res, next, id) => {
  try {
    const comment = await Comment.findById(id);

    if (!comment) return res.sendStatus(404);

    req.comment = comment;

    return next();
  } catch (err) {
    next(err);
  }
});

// GET ARTICLES
router.get('/', auth.optional, async (req, res, next) => {
  const { author: qryAuthor, limit, offset, tag, favorited } = req.query;
  const LIMIT = parseInt(limit) || 20;
  const OFFSET = parseInt(offset) || 0;
  const query = {};

  try {
    let results = await Promise.all([
      qryAuthor ? User.findOne({ username: qryAuthor }) : null,
      favorited ? User.findOne({ username: favorited }) : null,
    ]);
    const [author, favoriter] = results;

    if (typeof tag !== 'undefined') query.tagList = { $in: [tag] };
    if (author) query.author = author._id;
    if (favoriter) query._id = { $in: favoriter.favorites };
    else if (favorited) query._id = { $in: [] };

    results = await Promise.all([
      Article.find(query)
        .limit(LIMIT)
        .skip(OFFSET)
        .sort({ createdAt: 'desc' })
        .populate('author')
        .exec(),
      Article.countDocuments(query).exec(),
      req.payload ? User.findById(req.payload.id) : null,
    ]);
    const [articles, articlesCount, user] = results;

    return res.json({
      articles: articles.map(article => article.toJSONFor(user)),
      articlesCount,
    });
  } catch (err) {
    next(err);
  }
});

// GET FEED
router.get('/feed', auth.required, async (req, res, next) => {
  const { limit, offset } = req.query;
  const LIMIT = parseInt(limit) || 20;
  const OFFSET = parseInt(offset) || 0;

  try {
    const user = await User.findById(req.payload.id);

    if (!user) return res.sendStatus(401);

    const results = await Promise.all([
      Article.find({ author: { $in: user.following } })
        .limit(LIMIT)
        .skip(OFFSET)
        .populate('author')
        .exec(),
      Article.countDocuments({ author: { $in: user.following } }),
    ]);
    const [articles, articlesCount] = results;

    return res.json({
      articles: articles.map(article => article.toJSONFor(user)),
      articlesCount,
    });
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
      req.payload ? User.findById(req.payload.id) : null,
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
      const { title, description, body, tagList } = req.body.article;

      if (typeof title !== 'undefined') req.article.title = title;
      if (typeof description !== 'undefined') req.article.description = description;
      if (typeof body !== 'undefined') req.article.body = body;
      if (typeof tagList !== 'undefined') req.article.tagList = tagList;

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

// FAVORITE AN ARTICLE
router.post('/:article/favorite', auth.required, async (req, res, next) => {
  const articleId = req.article._id;

  try {
    const user = await User.findById(req.payload.id);

    if (!user) return res.sendStatus(401);

    await user.favorite(articleId);
    const article = await req.article.updateFavoritesCount();

    return res.json({ article: article.toJSONFor(user) });
  } catch (err) {
    next(err);
  }
});

// UNFAVORITE AN ARTICLE
router.delete('/:article/favorite', auth.required, async (req, res, next) => {
  const articleId = req.article._id;

  try {
    const user = await User.findById(req.payload.id);

    if (!user) return res.sendStatus(401);

    await user.unfavorite(articleId);
    const article = await req.article.updateFavoritesCount();

    return res.json({ article: article.toJSONFor(user) });
  } catch (err) {
    next(err);
  }
});

// GET AN ARTICLE'S COMMENTS
router.get('/:article/comments', auth.optional, async (req, res, next) => {
  try {
    const user = await Promise.resolve(req.payload ? User.findById(req.payload.id) : null);
    const article = await req.article
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
        },
        options: {
          sort: {
            createdAt: 'desc',
          },
        },
      })
      .execPopulate();

    return res.json({
      comments: article.comments.map(comment => comment.toJSONFor(user)),
    });
  } catch (err) {
    next(err);
  }
});

// CREATE A NEW COMMENT
router.post('/:article/comments', auth.required, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.id);

    if (!user) return res.sendStatus(401);

    let comment = new Comment(req.body.comment);
    comment.article = req.article;
    comment.author = user;

    comment = await comment.save();
    req.article.comments.push(comment);
    await req.article.save();

    return res.status(201).json({ comment: comment.toJSONFor(user) });
  } catch (err) {
    next(err);
  }
});

// DELETE A COMMENT
router.delete('/:article/comments/:comment', auth.required, async (req, res, next) => {
  if (req.comment.author._id.toString() === req.payload.id.toString()) {
    try {
      req.article.comments.remove(req.comment._id);
      await req.article.save();
      await Comment.findOne({ _id: req.comment._id })
        .remove()
        .exec();

      return res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
