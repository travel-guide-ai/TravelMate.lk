import { Webhook } from 'svix';
import User from '../models/User.js';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export const clerkWebhookHandler = async (req, res) => {
  if (!webhookSecret) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
  }

  // Get the headers
  const headerPayload = req.headers;
  const svix_id = headerPayload['svix-id'];
  const svix_timestamp = headerPayload['svix-timestamp'];
  const svix_signature = headerPayload['svix-signature'];

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({
      success: false,
      message: 'Error occured -- no svix headers',
    });
  }

  // Get the body - handle both raw buffer and parsed JSON
  let body;
  if (Buffer.isBuffer(req.body)) {
    body = req.body.toString();
  } else {
    body = JSON.stringify(req.body);
  }

  // Create a new Svix instance with your secret.
  const wh = new Webhook(webhookSecret);

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return res.status(400).json({
      success: false,
      message: 'Error occured',
    });
  }

  // Parse the event data if it's a string
  let eventData;
  if (typeof evt.data === 'string') {
    eventData = JSON.parse(evt.data);
  } else {
    eventData = evt.data;
  }

  // Handle the webhook
  const { id } = eventData;
  const eventType = evt.type;

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(eventData);
        break;
      case 'user.updated':
        await handleUserUpdated(eventData);
        break;
      case 'user.deleted':
        await handleUserDeleted(eventData);
        break;
      default:
        console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
        console.log('Webhook body:', body);
    }

    return res.status(200).json({
      success: true,
      message: 'Webhook received',
    });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const handleUserCreated = async (userData) => {
  const {
    id,
    email_addresses,
    first_name,
    last_name,
    username,
    phone_numbers,
    image_url,
  } = userData;

  try {
    const primaryEmail = email_addresses.find(email => email.id === userData.primary_email_address_id);
    
    const newUser = new User({
      clerkId: id,
      email: primaryEmail?.email_address,
      emailVerified: primaryEmail?.verification?.status === 'verified',
      profile: {
        firstName: first_name,
        lastName: last_name,
        username: username,
        phoneNumber: phone_numbers?.[0]?.phone_number,
        avatar: image_url,
      },
      settings: {
        emailNotifications: true,
        pushNotifications: true,
        privacy: 'public',
      },
      lastActive: new Date(),
    });

    await newUser.save();
    console.log('User created successfully:', newUser._id);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

const handleUserUpdated = async (userData) => {
  const {
    id,
    email_addresses,
    first_name,
    last_name,
    username,
    phone_numbers,
    image_url,
  } = userData;

  try {
    const primaryEmail = email_addresses.find(email => email.id === userData.primary_email_address_id);
    
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: id },
      {
        email: primaryEmail?.email_address,
        emailVerified: primaryEmail?.verification?.status === 'verified',
        'profile.firstName': first_name,
        'profile.lastName': last_name,
        'profile.username': username,
        'profile.phoneNumber': phone_numbers?.[0]?.phone_number,
        'profile.avatar': image_url,
        lastActive: new Date(),
      },
      { new: true }
    );

    console.log('User updated successfully:', updatedUser?._id);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

const handleUserDeleted = async (userData) => {
  const { id } = userData;

  try {
    const deletedUser = await User.findOneAndDelete({ clerkId: id });
    console.log('User deleted successfully:', deletedUser?._id);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};