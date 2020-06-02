const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    body: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
  },
  { timestamps: true },
);

CommentSchema.methods.toJSONFor = function(user) {
  return {
    id: this._id,
    body: this.body,
    author: this.author.toProfileJSONFor(user),
    createdAt: this.createdAt,
  };
};

mongoose.model('Comment', CommentSchema);
