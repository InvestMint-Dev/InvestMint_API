// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed password,
  auth0_id: { value: Date.now(), type: String, sparse: true }, // Use sparse if null values are allowed
  securityQuestion1: {type: String, required: true},
  securityAnswer1: {type: String, required: true},
  securityQuestion2: {type: String, required: true},
  securityAnswer2: {type: String, required: true},
  companyInformation: { type: mongoose.Schema.Types.ObjectId, ref: 'CompanyInformation' }, // Reference to CompanyInformation
  investingQuestionnaire: { type: mongoose.Schema.Types.ObjectId, ref: 'InvestingQuestionnaire' }, // Reference to CompanyInformation
  passwordResetToken: {type: String},
  passwordResetExpires: {type: Date},  
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
