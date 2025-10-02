import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

export const requireAuth = ClerkExpressRequireAuth({
  // This will automatically verify the session token from Clerk
  onError: (error) => {
    console.error('Authentication error:', error);
    return {
      status: 401,
      message: 'Unauthorized access'
    };
  }
});

// Custom middleware to check if user exists in our database
export const ensureUserExists = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    
    // Import here to avoid circular dependency
    const { getUserByClerkId } = await import('../services/userService.js');
    
    const user = await getUserByClerkId(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found. Please contact support.'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Error checking user existence:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};