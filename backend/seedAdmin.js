const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if admin exists
    let admin = await User.findOne({ email: 'admin@lms.com' });
    
    if (admin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@lms.com');
      console.log('Password: adminpassword123');
      process.exit();
    }
    
    admin = new User({
      name: 'System Admin',
      email: 'admin@lms.com',
      password: 'adminpassword123',
      role: 'teacher',
      isActive: true
    });
    
    await admin.save();
    console.log('Admin user created successfully.');
    console.log('Email: admin@lms.com');
    console.log('Password: adminpassword123');
    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

seedAdmin();
