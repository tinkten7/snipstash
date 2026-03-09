const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  code: { type: String, required: true },
  language: { type: String, required: true, default: 'javascript' },
  tags: [{ type: String, trim: true, lowercase: true }],
  isFavorite: { type: Boolean, default: false },
  copyCount: { type: Number, default: 0 },
}, { timestamps: true });

// Weighted text search: title most important, then tags, description, code least
snippetSchema.index(
  { title: 'text', tags: 'text', description: 'text', code: 'text' },
  { weights: { title: 10, tags: 8, description: 5, code: 1 }, name: 'snippet_search', language_override: 'searchLang' }
);

snippetSchema.index({ userId: 1, createdAt: -1 });
snippetSchema.index({ userId: 1, tags: 1 });

module.exports = mongoose.model('Snippet', snippetSchema);
