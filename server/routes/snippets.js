language: { type: String, required: true, default: 'javascript' },
  tags: [{ type: String, trim: true, lowercase: true }],
  isFavorite: { type: Boolean, default: false },
  copyCount: { type: Number, default: 0 },
}, { timestamps: true })