const User = require('../models/User');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, grade } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Create new user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      ...(role === 'student' && { grade }) // Only include grade for students
    });
    
    // Generate token
    const token = user.generateAuthToken();
    
    // Remove password from output
    const userObject = user.toObject();
    delete userObject.password;
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userObject,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if email and password provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    // Find user by email (include password for comparison)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = user.generateAuthToken();
    
    // Remove password from output
    const userObject = user.toObject();
    delete userObject.password;
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userObject,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Logout user (client-side token removal)
exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await req.user;
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
};