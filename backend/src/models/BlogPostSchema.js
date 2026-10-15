const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  slug:         { type: String, required: true, unique: true },
  category:     String,
  author:       String,
  readMinutes:  Number,
  excerpt:      String,
  body:         [String],   // array of paragraphs, matches editorial.js
  coverImage:   String,
  tags:         [String],
  publishedAt:  Date,
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);