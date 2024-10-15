// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  auth0_id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed password
  name: { type: String },
  companyInformation: { type: mongoose.Schema.Types.ObjectId, ref: 'CompanyInformation' }, // Reference to CompanyInformation
});

// Hash password before saving user
userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
