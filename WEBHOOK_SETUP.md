# Clerk Webhook Setup Instructions

## Step 1: Get Your Webhook Secret from Clerk Dashboard

1. Go to https://dashboard.clerk.com/
2. Select your application
3. Go to "Webhooks" in the sidebar
4. Click "Add Endpoint" or "Create Webhook"
5. Set the endpoint URL to: `http://localhost:5000/api/v1/webhooks/clerk`
6. Select the following events:
   - `user.created`
   - `user.updated` 
   - `user.deleted`
7. Copy the "Signing Secret" (starts with `whsec_`)

## Step 2: Update Your .env File

Replace the placeholder in your backend/.env file:
```
CLERK_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_SECRET_HERE
```

## Step 3: For Production Deployment

For production, you'll need to:
1. Deploy your backend to a service like Railway, Render, or Heroku
2. Update the webhook URL in Clerk dashboard to your production URL
3. Ensure your webhook endpoint is publicly accessible

## Step 4: Test the Webhook

After setting up:
1. Register a new user on your frontend
2. Check your backend logs for webhook events
3. Verify the user appears in your MongoDB collection

## Troubleshooting

If users still don't appear in MongoDB:
1. Check backend logs for webhook errors
2. Verify the webhook secret is correct
3. Ensure the webhook URL is accessible from Clerk's servers
4. Check that the events are selected in Clerk dashboard

## Current Status
✅ MongoDB connection working
✅ User model working  
✅ Webhook endpoint created
❌ Webhook secret needs to be configured
❌ Webhook URL needs to be registered in Clerk dashboard