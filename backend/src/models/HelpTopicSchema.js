const mongoose = require('mongoose');

const HelpTopicSchema = new mongoose.Schema({
  id:    String,
  label: String,
  icon:  String,
  faqs:  [{ q: String, a: String }],
});

module.exports = mongoose.model('HelpTopic', HelpTopicSchema);