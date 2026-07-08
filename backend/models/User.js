const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries by default
  },
  role: {
    type: String,
    enum: ['student', 'teacher'],
    default: 'student'
  },
  grade: {
    type: Number,
    min: [6, 'Grade must be between 6 and 11'],
    max: [11, 'Grade must be between 6 and 11'],
    validate: {
      validator: function(v) {
        // Only required for students
        return this.role === 'teacher' || (v >= 6 && v <= 11);
      },
      message: 'Grade is required for students and must be between 6-11'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { userId: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  return token;
};

// Update last login on successful login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = Date.now();
  return this.save();
};

// Create model
const User = mongoose.model('User', userSchema);

module.exports = User;