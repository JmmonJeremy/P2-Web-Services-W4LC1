// google auth 
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true, },
  githubId: { type: String, unique: true, sparse: true, },
  email: { type: String, unique: true, required: true, },
  displayName: { type: String, required: true, },
  firstName: { type: String, required: true, default: "Unknown"},
  lastName: { type: String, required: true, default: "Not Given"},
  image: { type: String, required: true, default: "default-image-url"}, 
  bio: { type: String, },
  location: { type: String, },
  company: { type: String, },
  website: { type: String, },
  createdAt: { type: Date, default: Date.now, },
})

module.exports = mongoose.model('User', UserSchema)