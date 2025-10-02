import User from '../models/User.js';

export const createTestUser = async (req, res) => {
  try {
    const testUser = new User({
      clerkId: 'test_user_' + Date.now(),
      email: 'test@example.com',
      emailVerified: true,
      profile: {
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser',
      },
      settings: {
        emailNotifications: true,
        pushNotifications: true,
        privacy: 'public',
      },
      lastActive: new Date(),
    });

    await testUser.save();
    
    res.status(201).json({
      success: true,
      message: 'Test user created successfully',
      user: testUser
    });
  } catch (error) {
    console.error('Error creating test user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating test user',
      error: error.message
    });
  }
};

export const createClerkUser = async (req, res) => {
  try {
    const {
      clerkId,
      email,
      emailVerified,
      firstName,
      lastName,
      username,
      phoneNumber,
      avatar
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ clerkId });
    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: 'User already exists',
        user: existingUser
      });
    }

    const newUser = new User({
      clerkId,
      email,
      emailVerified: emailVerified || false,
      profile: {
        firstName: firstName || '',
        lastName: lastName || '',
        username: username || '',
        phoneNumber: phoneNumber || '',
        avatar: avatar || '',
      },
      settings: {
        emailNotifications: true,
        pushNotifications: true,
        privacy: 'public',
      },
      lastActive: new Date(),
    });

    await newUser.save();
    
    console.log('Clerk user synced to MongoDB:', {
      clerkId,
      email,
      mongoId: newUser._id
    });
    
    res.status(201).json({
      success: true,
      message: 'User synced to MongoDB successfully',
      user: newUser
    });
  } catch (error) {
    console.error('Error creating Clerk user:', error);
    res.status(500).json({
      success: false,
      message: 'Error syncing user to MongoDB',
      error: error.message
    });
  }
};

export const testWebhook = async (req, res) => {
  try {
    console.log('Webhook test received:', req.body);
    res.status(200).json({
      success: true,
      message: 'Webhook test successful',
      received: req.body
    });
  } catch (error) {
    console.error('Webhook test error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook test failed'
    });
  }
};