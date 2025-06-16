# LinkedIn Token Setup Guide

This guide walks you through the complete process of setting up LinkedIn OAuth tokens for the outreach agent system.

## Prerequisites

- LinkedIn Developer Account
- Node.js and npm installed
- Access to the outreach agent codebase

## Step 1: Create LinkedIn App

### 1.1 Access LinkedIn Developer Portal
1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Sign in with your LinkedIn account
3. Click "Create App"

### 1.2 Configure App Settings
1. **App Name**: `Professional Outreach Tool` (or your preferred name)
2. **LinkedIn Page**: Select "INDIVIDUAL" if you don't have a company page
3. **App Logo**: Upload a logo (optional but recommended)
4. **Legal Agreement**: Accept the terms

### 1.3 Configure OAuth Settings
1. Navigate to the "Auth" tab in your app
2. Add **Redirect URLs**:
   ```
   http://localhost:3001/api/social/oauth/linkedin/callback
   ```
3. Note down your credentials:
   - **Client ID**: `86l3jntx82nze4` (example)
   - **Client Secret**: `WPL_AP1.phXFuvZtf4Fv0QeP.gbAYug==` (example)

### 1.4 Add Required Products
1. Go to the "Products" tab
2. Request access to: **"Sign In with LinkedIn using OpenID Connect"**
3. Wait for approval (usually instant for OpenID Connect)

## Step 2: Environment Configuration

### 2.1 Update Environment Variables
Create or update your `.env` file in the backend directory:

```bash
# LinkedIn OAuth Configuration
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
LINKEDIN_REDIRECT_URI=http://localhost:3001/api/social/oauth/linkedin/callback
```

### 2.2 Verify Token Storage Setup
Ensure your backend has the token storage utility configured:

```typescript
// packages/backend/src/utils/tokenStorage.ts should exist
// with functions: saveLinkedInTokens, getLinkedInTokens, clearLinkedInTokens
```

## Step 3: Start the Backend Server

### 3.1 Navigate to Backend Directory
```bash
cd packages/backend
```

### 3.2 Install Dependencies
```bash
npm install
```

### 3.3 Start the Server
```bash
npm start
```

The server should start on `http://localhost:3001`

## Step 4: Manual Token Generation

### 4.1 Get Authorization URL
```bash
curl http://localhost:3001/api/social/oauth/linkedin/authorize
```

This returns a JSON response with the authorization URL:
```json
{
  "success": true,
  "data": {
    "authUrl": "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=...",
    "platform": "linkedin",
    "state": "random_state_string"
  }
}
```

### 4.2 Complete OAuth Flow
1. Copy the `authUrl` from the response
2. Open it in your browser
3. Sign in to LinkedIn if prompted
4. Review the permissions:
   - ✅ Use your name and photo
   - ✅ Create, modify, and delete posts, comments, and reactions on your behalf
   - ✅ Use the primary email address associated with your LinkedIn account
5. Click **"Allow"**

### 4.3 Verify Token Storage
After completing OAuth, you should see a success page and the server logs should show:
```
LinkedIn tokens saved successfully
```

The tokens are now stored in `.tokens.json` file (automatically created).

## Step 5: Test the Integration

### 5.1 Test Post Creation
```bash
curl -X POST http://localhost:3001/api/social/linkedin/post \
  -H "Content-Type: application/json" \
  -d '{"content":"🚀 Testing LinkedIn API integration! This post was created programmatically. #LinkedInAPI #TechTest"}'
```

Expected response:
```json
{
  "success": true,
  "message": "LinkedIn post created successfully!",
  "data": {
    "postId": "urn:li:share:1234567890123456789",
    "content": "🚀 Testing LinkedIn API integration!...",
    "platform": "linkedin",
    "createdAt": "2025-06-16T00:48:15.803Z"
  }
}
```

### 5.2 Test Post Deletion
```bash
curl -X DELETE http://localhost:3001/api/social/linkedin/post/urn:li:share:1234567890123456789
```

Expected response:
```json
{
  "success": true,
  "message": "LinkedIn post deleted successfully!",
  "data": {
    "postId": "urn:li:share:1234567890123456789",
    "deletedAt": "2025-06-16T00:48:22.054Z"
  }
}
```

## Step 6: Verify Persistent Authentication

### 6.1 Restart Server
Stop and restart your backend server:
```bash
# Stop with Ctrl+C, then restart
npm start
```

### 6.2 Test Without Re-authentication
Try creating another post without going through OAuth again:
```bash
curl -X POST http://localhost:3001/api/social/linkedin/post \
  -H "Content-Type: application/json" \
  -d '{"content":"✅ Persistent authentication working! No re-auth needed. #Success"}'
```

If this works without requiring re-authentication, your persistent token storage is working correctly.

## Troubleshooting

### Common Issues

#### 1. "LinkedIn not connected" Error
- **Cause**: Tokens not found or expired
- **Solution**: Repeat the OAuth flow (Step 4.2)

#### 2. 403 Forbidden on Profile Access
- **Cause**: Incorrect OAuth scopes
- **Solution**: Ensure you're using the correct scopes: `openid profile email w_member_social`

#### 3. "Syntax exception in path variables" on Delete
- **Cause**: Post ID not properly URL encoded
- **Solution**: The system automatically handles this, but ensure you're using the exact post ID returned from creation

#### 4. App Not Approved for Required Products
- **Cause**: LinkedIn app doesn't have necessary permissions
- **Solution**: Request "Sign In with LinkedIn using OpenID Connect" product in your app settings

### Token Expiration
- Tokens expire after 60 days
- The system automatically checks expiration with a 5-minute buffer
- When expired, you'll need to repeat the OAuth flow

### Security Notes
- Never commit `.tokens.json` to version control
- The file is automatically added to `.gitignore`
- Store production credentials securely using environment variables

## API Endpoints Reference

### OAuth Endpoints
- `GET /api/social/oauth/linkedin/authorize` - Get authorization URL
- `GET /api/social/oauth/linkedin/callback` - OAuth callback (used by LinkedIn)

### LinkedIn API Endpoints
- `POST /api/social/linkedin/post` - Create a LinkedIn post
- `DELETE /api/social/linkedin/post/:postId` - Delete a LinkedIn post

### Required Headers for LinkedIn API
```
Authorization: Bearer {access_token}
Content-Type: application/json
X-Restli-Protocol-Version: 2.0.0
```

## OAuth Scopes Explained

| Scope | Purpose | Required For |
|-------|---------|--------------|
| `openid` | OpenID Connect authentication | Getting user profile ID |
| `profile` | Access to basic profile info | Getting user name and profile data |
| `email` | Access to email address | User identification |
| `w_member_social` | Write access to social content | Creating and deleting posts |

## Success Indicators

✅ **OAuth Complete**: Browser shows success page  
✅ **Tokens Saved**: Server logs "LinkedIn tokens saved successfully"  
✅ **Post Creation**: API returns post ID  
✅ **Post Deletion**: API confirms deletion  
✅ **Persistent Auth**: Works after server restart  

Your LinkedIn integration is now fully configured and ready for use! 