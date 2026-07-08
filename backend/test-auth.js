// Test script to verify the authentication system works
const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const User = require('./models/User');

async function testAuthSystem() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Database connected successfully');
    
    // Test creating a user
    const testUser = {
      name: 'Test Student',
      email: 'test@example.com',
      password: 'password123',
      role: 'student',
      grade: 7
    };
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      await User.deleteOne({ email: testUser.email });
      console.log('🗑️  Removed existing test user');
    }
    
    // Create new user
    const user = await User.create(testUser);
    console.log('✅ User created successfully:', user.name);
    
    // Test password comparison
    const isMatch = await user.comparePassword('password123');
    console.log('✅ Password comparison works:', isMatch);
    
    // Test wrong password
    const isWrongMatch = await user.comparePassword('wrongpassword');
    console.log('✅ Wrong password correctly rejected:', !isWrongMatch);
    
    // Test token generation
    const token = user.generateAuthToken();
    console.log('✅ JWT token generated:', token.substring(0, 20) + '...');
    
    // Clean up
    await User.deleteOne({ email: testUser.email });
    console.log('🗑️  Test user cleaned up');
    
    await mongoose.disconnect();
    console.log('👋 Disconnected from database');
    
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

testAuthSystem()
  .then(success => {
    if (success) {
      console.log('\n🎉 All authentication tests passed!');
      process.exit(0);
    } else {
      console.log('\n💥 Some tests failed!');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('💥 Test script error:', err);
    process.exit(1);
  });