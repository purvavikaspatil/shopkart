const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const BlogPost = require('../models/BlogPostSchema');
const HelpTopic = require('../models/HelpTopicSchema');
const Ticket = require('../models/TicketSchema');
const { BLOG_POSTS, HELP_TOPICS, TESTIMONIALS } = require('../utils/inMemoryStore');

exports.getPosts = asyncHandler(async (req, res) => {
  const { category } = req.query;

  if (mongoose.connection.readyState === 1) {
    try {
      const filter = category ? { category } : {};
      const posts = await BlogPost.find(filter).sort({ publishedAt: -1 });
      if (posts && posts.length > 0) return res.json(posts);
    } catch (e) {}
  }

  let posts = [...BLOG_POSTS];
  if (category) posts = posts.filter((p) => p.category === category);
  res.json(posts);
});

exports.getPostBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      const post = await BlogPost.findOne({ slug });
      if (post) return res.json(post);
    } catch (e) {}
  }

  const found = BLOG_POSTS.find((p) => p.slug === slug);
  if (!found) throw new ApiError('Post not found.', 404, 'POST_NOT_FOUND');
  res.json(found);
});

exports.getBlogCategories = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const categories = await BlogPost.distinct('category');
      if (categories && categories.length > 0) return res.json(categories);
    } catch (e) {}
  }
  const categories = Array.from(new Set(BLOG_POSTS.map((p) => p.category))).filter(Boolean);
  res.json(categories);
});

exports.getHelpTopics = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const topics = await HelpTopic.find();
      if (topics && topics.length > 0) return res.json(topics);
    } catch (e) {}
  }
  res.json(HELP_TOPICS);
});

exports.searchHelp = asyncHandler(async (req, res) => {
  const { q = '' } = req.query;
  if (!q.trim()) return res.json([]);
  const term = q.toLowerCase();

  const matches = HELP_TOPICS.flatMap((topic) =>
    topic.faqs
      .filter((f) => f.q.toLowerCase().includes(term) || f.a.toLowerCase().includes(term))
      .map((f) => ({ topic: topic.label, ...f }))
  );

  res.json(matches);
});

exports.getPopularQuestions = asyncHandler(async (req, res) => {
  const all = HELP_TOPICS.flatMap((t) => t.faqs.map((f) => ({ topic: t.label, ...f })));
  res.json(all.slice(0, 8));
});

exports.getTestimonials = asyncHandler(async (req, res) => {
  res.json(TESTIMONIALS);
});

exports.submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (mongoose.connection.readyState === 1) {
    try {
      const ticket = await Ticket.create({ name, email, subject, message });
      return res.status(201).json({ success: true, ticketId: ticket._id });
    } catch (e) {}
  }
  res.status(201).json({ success: true, ticketId: `tkt-${Date.now()}` });
});

exports.subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new ApiError('Enter a valid email address.', 400, 'INVALID_EMAIL');
  }
  res.json({ success: true, message: 'Subscribed successfully.' });
});
