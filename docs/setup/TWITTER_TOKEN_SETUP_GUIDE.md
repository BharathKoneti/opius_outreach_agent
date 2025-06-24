# Twitter/X API Token Setup Guide

This guide walks you through the complete process of setting up Twitter/X OAuth tokens for the outreach agent system.

## Prerequisites

- Twitter/X Developer Account
- Node.js and npm installed
- Access to the outreach agent codebase

## Step 1: Create Twitter/X Developer Account

### 1.1 Access Twitter Developer Portal
1. Go to [Twitter Developer Portal](https://developer.x.com/)
2. Sign in with your Twitter/X account
3. Click "Sign up for Free Account"

### 1.2 Complete Application Process
1. **Use Case**: Describe your use case (minimum 250 characters)
2. **Account Type**: Choose "Free" tier for basic usage
3. **Verification**: Complete email verification if required

## Step 2: Create Twitter App

### 2.1 Create Project and App
1. In the Developer Portal, click "Create Project"
2. **Project Name**: `Outreach Agent` (or your preferred name)
3. **Use Case**: Select "Making a bot" or "Exploring the API"
4. **Project Description**: Describe your outreach automation project
5. **App Name**: `Professional Outreach Tool` (must be unique)

### 2.2 Configure App Settings
1. Navigate to your App settings
2. Click "Edit" in **User authentication settings**

#### App Permissions
- Select **Read and write** (required for posting tweets)

#### Type of App
- Select **Web App, Automated App or Bot** (enables OAuth 2.0)

#### App Info
- **Callback URI**: `http://localhost:3001/api/social/oauth/twitter/callback`
- **Website URL**: Your website URL (can be any valid URL)
- **Terms of Service**: Optional
- **Privacy Policy**: Optional

3. Click **Save** to generate credentials

### 2.3 Get API Credentials
1. Go to **Keys and tokens** tab
2. Copy the following credentials:
   - **Client ID** (OAuth 2.0)
   - **Client Secret** (OAuth 2.0)
   - **API Key** (for reference)
   - **API Key Secret** (for reference)

## Step 3: Configure Environment Variables

Create or update your `.env` file in `packages/backend/`:

```bash
# Twitter/X API Configuration
TWITTER_CLIENT_ID=your_client_id_here
TWITTER_CLIENT_SECRET=your_client_secret_here
TWITTER_REDIRECT_URI=http://localhost:3001/api/social/oauth/twitter/callback

# Existing LinkedIn configuration...
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:3001/api/social/oauth/linkedin/callback
```

## Step 4: Start the Server

```bash
cd packages/backend
npm start
```

The server should start on port 3001.

## Step 5: Generate Twitter OAuth Tokens

### 5.1 Get Authorization URL
```bash
curl http://localhost:3001/api/social/oauth/twitter/authorize
```

**Response:**
```json
{
  "success": true,
  "data": {
    "authUrl": "https://x.com/i/oauth2/authorize?response_type=code&client_id=...",
    "platform": "twitter",
    "state": "abc123"
  }
}
```

### 5.2 Complete OAuth Flow
1. **Copy the `authUrl`** from the response
2. **Open the URL** in your browser
3. **Sign in** to your Twitter/X account if prompted
4. **Review permissions**:
   - Read Tweets, including from protected accounts
   - Write Tweets for you
   - See accounts you follow, mute, and block
   - Stay connected to your account until you revoke access
5. **Click "Authorize app"**
6. You'll be redirected to the callback URL with a success response

### 5.3 Verify Token Storage
Check the server logs for:
```
Twitter tokens saved successfully
```

## Step 6: Test Twitter Integration

### 6.1 Create a Tweet
```bash
curl -X POST http://localhost:3001/api/social/twitter/post \
  -H "Content-Type: application/json" \
  -d '{"content":"🚀 Testing Twitter API integration! This tweet was created programmatically using the X API v2. #TwitterAPI #OAuth2 #TechTest"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Twitter post created successfully!",
  "data": {
    "postId": "1234567890123456789",
    "content": "🚀 Testing Twitter API integration! This tweet was created programmatically using the X API v2. #TwitterAPI #OAuth2 #TechTest",
    "platform": "twitter",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### 6.2 Delete a Tweet
```bash
curl -X DELETE http://localhost:3001/api/social/twitter/post/1234567890123456789
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Twitter post deleted successfully!",
  "data": {
    "postId": "1234567890123456789",
    "deleted": true,
    "deletedAt": "2024-01-01T12:01:00.000Z"
  }
}
```

## API Reference

### OAuth Endpoints

#### GET /api/social/oauth/twitter/authorize
Get Twitter OAuth authorization URL.

**Response:**
```json
{
  "success": true,
  "data": {
    "authUrl": "https://x.com/i/oauth2/authorize?...",
    "platform": "twitter",
    "state": "random_state"
  }
}
```

#### GET /api/social/oauth/twitter/callback
OAuth callback endpoint (handled automatically by browser redirect).

### Twitter API Endpoints

#### POST /api/social/twitter/post
Create a new tweet.

**Request Body:**
```json
{
  "content": "Your tweet content here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Twitter post created successfully!",
  "data": {
    "postId": "1234567890123456789",
    "content": "Your tweet content here",
    "platform": "twitter",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### DELETE /api/social/twitter/post/:postId
Delete a tweet by ID.

**Response:**
```json
{
  "success": true,
  "message": "Twitter post deleted successfully!",
  "data": {
    "postId": "1234567890123456789",
    "deleted": true,
    "deletedAt": "2024-01-01T12:01:00.000Z"
  }
}
```

## Troubleshooting

### Common Issues

#### "Twitter credentials not configured"
- **Solution**: Verify `TWITTER_CLIENT_ID` and `TWITTER_CLIENT_SECRET` are set in `.env`
- **Check**: Restart the server after updating environment variables

#### "Invalid state parameter or expired PKCE challenge"
- **Solution**: The OAuth flow timed out (10 minutes). Generate a new authorization URL
- **Prevention**: Complete the OAuth flow within 10 minutes

#### "Failed to exchange code for token"
- **Solution**: Check that your callback URI in Twitter app settings matches exactly: `http://localhost:3001/api/social/oauth/twitter/callback`
- **Note**: Twitter requires exact match validation for callback URIs

#### "Twitter not connected. Please authenticate first."
- **Solution**: Complete the OAuth flow to generate tokens
- **Check**: Verify tokens are saved by checking server logs

#### 403 Forbidden on API calls
- **Solution**: Verify your Twitter app has "Read and write" permissions
- **Check**: Ensure you're using OAuth 2.0 credentials (Client ID/Secret), not API Key/Secret

#### Token expired errors
- **Solution**: Tokens automatically refresh if `offline.access` scope was granted
- **Manual**: Re-run the OAuth flow if refresh fails

### Rate Limits

Twitter API v2 rate limits:
- **POST /2/tweets**: 200 requests per 15 minutes
- **DELETE /2/tweets/:id**: 50 requests per 15 minutes
- **Combined limit**: 300 requests per 3 hours (includes retweets)

### Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Regenerate tokens** if compromised
4. **Monitor API usage** to stay within rate limits
5. **Use HTTPS** in production environments

## Advanced Configuration

### Production Environment Variables
```bash
# Production Twitter Configuration
TWITTER_CLIENT_ID=your_production_client_id
TWITTER_CLIENT_SECRET=your_production_client_secret
TWITTER_REDIRECT_URI=https://yourdomain.com/api/social/oauth/twitter/callback

# Optional: Custom token storage
TOKEN_ENCRYPTION_KEY=your_32_character_encryption_key
```

### Custom Scopes
The default scopes are: `tweet.read tweet.write users.read offline.access`

Available scopes:
- `tweet.read` - Read tweets and user timeline
- `tweet.write` - Create and delete tweets
- `users.read` - Read user profile information
- `offline.access` - Refresh tokens without user interaction
- `follows.read` - Read following/followers lists
- `follows.write` - Follow/unfollow users
- `like.read` - Read liked tweets
- `like.write` - Like/unlike tweets

## Next Steps

1. **Test the complete workflow** with tweet creation and deletion
2. **Set up monitoring** for token expiration and refresh
3. **Implement error handling** for your specific use cases
4. **Consider rate limiting** in your application logic
5. **Move to Reddit integration** (Phase 3 of the roadmap)

## Support

- **Twitter API Documentation**: https://docs.x.com/
- **Developer Community**: https://twittercommunity.com/
- **API Status**: https://api.twitterstat.us/

---

**Next Platform**: [Reddit Setup Guide](./REDDIT_TOKEN_SETUP_GUIDE.md) (Coming Soon) 