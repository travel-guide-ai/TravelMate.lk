import { useUser, useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export const useUserSync = () => {
  const { user: clerkUser, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const syncUser = async () => {
    if (!isLoaded || !clerkUser) return;

    setLoading(true);
    setError(null);

    try {
      // First try to get existing user
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${await getToken()}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        console.log('User found in MongoDB:', userData);
      } else if (response.status === 404) {
        // User doesn't exist, create them
        console.log('User not found in MongoDB, creating...');
        
        const createResponse = await fetch(`${API_BASE_URL}/test/create-clerk-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getToken()}`,
          },
          body: JSON.stringify({
            clerkId: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress,
            emailVerified: clerkUser.primaryEmailAddress?.verification?.status === 'verified',
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            username: clerkUser.username,
            phoneNumber: clerkUser.primaryPhoneNumber?.phoneNumber,
            avatar: clerkUser.imageUrl,
          }),
        });

        if (createResponse.ok) {
          const newUser = await createResponse.json();
          setUser(newUser);
          console.log('User successfully created in MongoDB:', newUser);
        } else {
          throw new Error('Failed to create user in MongoDB');
        }
      } else {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error syncing user:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
  };

  // Auto-sync on component mount
  useEffect(() => {
    if (isLoaded && clerkUser && !user && !loading) {
      syncUser();
    }
  }, [isLoaded, clerkUser]);

  return { 
    user, 
    loading, 
    error, 
    syncUser,
    updateUser 
  };
};