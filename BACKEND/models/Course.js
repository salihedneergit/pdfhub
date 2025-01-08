const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pdfs: [{ type: String, required: true }], 
});

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  folders: [folderSchema],
  createdAt: { type: Date, default: Date.now },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
