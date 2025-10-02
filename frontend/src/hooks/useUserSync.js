import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export const useUserSync = () => {
  const { user, isLoaded } = useUser();
  const [syncStatus, setSyncStatus] = useState(null);

  useEffect(() => {
    const syncUserToMongoDB = async () => {
      if (!isLoaded || !user) return;

      try {
        // Check if user exists in our MongoDB
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${await user.getToken()}`,
          },
        });

        if (response.status === 404) {
          // User doesn't exist in MongoDB, create them
          console.log('User not found in MongoDB, creating...');
          
          const createResponse = await fetch(`${API_BASE_URL}/test/create-clerk-user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await user.getToken()}`,
            },
            body: JSON.stringify({
              clerkId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              emailVerified: user.primaryEmailAddress?.verification?.status === 'verified',
              firstName: user.firstName,
              lastName: user.lastName,
              username: user.username,
              phoneNumber: user.primaryPhoneNumber?.phoneNumber,
              avatar: user.imageUrl,
            }),
          });

          if (createResponse.ok) {
            console.log('User successfully synced to MongoDB');
            setSyncStatus('synced');
          } else {
            console.error('Failed to sync user to MongoDB');
            setSyncStatus('error');
          }
        } else if (response.ok) {
          console.log('User already exists in MongoDB');
          setSyncStatus('exists');
        }
      } catch (error) {
        console.error('Error syncing user:', error);
        setSyncStatus('error');
      }
    };

    syncUserToMongoDB();
  }, [user, isLoaded]);

  return { syncStatus };
};