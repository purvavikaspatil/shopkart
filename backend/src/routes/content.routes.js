const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/content.controller');

router.get('/posts', ctrl.getPosts);
router.get('/posts/:slug', ctrl.getPostBySlug);
router.get('/blog-categories', ctrl.getBlogCategories);

router.get('/help-topics', ctrl.getHelpTopics);
router.get('/help/search', ctrl.searchHelp);
router.get('/popular-questions', ctrl.getPopularQuestions);

router.get('/testimonials', ctrl.getTestimonials);

router.post('/contact', ctrl.submitContact);
router.post('/newsletter', ctrl.subscribeNewsletter);

module.exports = router;