const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  auth0_id: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  isAuthenticated: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
