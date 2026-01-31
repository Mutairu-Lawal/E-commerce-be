const e = require('express');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, 'Please fill a valid email address'],
    },
    hash_password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
