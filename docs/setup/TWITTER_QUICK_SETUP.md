# Twitter/X API Quick Setup

Quick reference for setting up Twitter/X OAuth tokens.

## 🚀 Quick Start (5 minutes)

### 1. Create Twitter App
1. Go to [Twitter Developer Portal](https://developer.x.com/)
2. Sign up for Free Account → Create Project → Create App
3. App Settings → User authentication settings:
   - **Permissions**: Read and write
   - **Type**: Web App, Automated App or Bot
   - **Callback URI**: `http://localhost:3001/api/social/oauth/twitter/callback`
   - **Website URL**: Any valid URL
4. Copy Client ID and Client Secret from Keys and tokens tab

### 2. Configure Environment
```bash
# .env file in packages/backend/
TWITTER_CLIENT_ID=your_client_id
TWITTER_CLIENT_SECRET=your_client_secret
TWITTER_REDIRECT_URI=http://localhost:3001/api/social/oauth/twitter/callback
```

### 3. Generate Tokens
```bash
# Start server
cd packages/backend && npm start

# Get auth URL
curl http://localhost:3001/api/social/oauth/twitter/authorize

# Open authUrl in browser, authorize app
# Tokens are automatically saved after OAuth flow
```

### 4. Test Integration
```bash
# Create tweet
curl -X POST http://localhost:3001/api/social/twitter/post \
  -H "Content-Type: application/json" \
  -d '{"content":"🚀 Hello Twitter! Posted via API #TwitterAPI"}'

# Delete tweet (use postId from response)
curl -X DELETE http://localhost:3001/api/social/twitter/post/TWEET_ID
```

## 📋 API Endpoints

### OAuth
- `GET /api/social/oauth/twitter/authorize` - Get authorization URL
- `GET /api/social/oauth/twitter/callback` - OAuth callback

### Posting
- `POST /api/social/twitter/post` - Create tweet
- `DELETE /api/social/twitter/post/:postId` - Delete tweet

## 🔧 Required Scopes
- `tweet.read` - Read tweets
- `tweet.write` - Create/delete tweets  
- `users.read` - Read user profile
- `offline.access` - Refresh tokens

## ⚡ Rate Limits
- **Create tweets**: 200 per 15 minutes
- **Delete tweets**: 50 per 15 minutes
- **Combined**: 300 per 3 hours

## 🆘 Common Issues

**"Twitter credentials not configured"**
→ Check TWITTER_CLIENT_ID and TWITTER_CLIENT_SECRET in .env

**"Invalid state parameter"**
→ OAuth flow expired (10 min), get new auth URL

**"Failed to exchange code for token"**
→ Verify callback URI matches exactly in Twitter app settings

**403 Forbidden**
→ Ensure app has "Read and write" permissions

## 📚 Full Documentation
[Complete Twitter Setup Guide](./TWITTER_TOKEN_SETUP_GUIDE.md) 