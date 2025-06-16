# API Documentation

This document describes the REST API endpoints for the Outreach Agent system.

## Base URL

```
http://localhost:3001/api
```

## Authentication

The system uses OAuth 2.0 for LinkedIn integration. Tokens are automatically managed and stored persistently.

## Endpoints

### Health Check

#### GET /health
Check if the API server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-06-16T00:00:00.000Z"
}
```

### LinkedIn OAuth

#### GET /social/oauth/linkedin/authorize
Get LinkedIn OAuth authorization URL.

**Response:**
```json
{
  "success": true,
  "data": {
    "authUrl": "https://www.linkedin.com/oauth/v2/authorization?...",
    "platform": "linkedin",
    "state": "random_state_string"
  }
}
```

#### GET /social/oauth/linkedin/callback
OAuth callback endpoint (used by LinkedIn, not called directly).

**Query Parameters:**
- `code` - Authorization code from LinkedIn
- `state` - State parameter for security

**Response:**
```json
{
  "success": true,
  "message": "LinkedIn connected successfully!",
  "data": {
    "id": "user_profile_id",
    "scope": "email,openid,profile,w_member_social",
    "hasAccessToken": true,
    "expiresAt": "2025-08-15T00:00:00.000Z"
  }
}
```

### LinkedIn Posts

#### POST /social/linkedin/post
Create a new LinkedIn post.

**Request Body:**
```json
{
  "content": "Your post content here with #hashtags"
}
```

**Response:**
```json
{
  "success": true,
  "message": "LinkedIn post created successfully!",
  "data": {
    "postId": "urn:li:share:1234567890123456789",
    "content": "Your post content here with #hashtags",
    "platform": "linkedin",
    "createdAt": "2025-06-16T00:48:15.803Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "LinkedIn not connected. Please authenticate first."
}
```

#### DELETE /social/linkedin/post/:postId
Delete a LinkedIn post.

**URL Parameters:**
- `postId` - The LinkedIn post ID (e.g., `urn:li:share:1234567890123456789`)

**Response:**
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

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description",
  "details": {
    "additional": "error details if available"
  }
}
```

### Common HTTP Status Codes

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (authentication required)
- `404` - Not Found
- `500` - Internal Server Error

## LinkedIn API Integration Details

### OAuth Scopes
- `openid` - OpenID Connect authentication
- `profile` - Access to basic profile information
- `email` - Access to email address
- `w_member_social` - Permission to create and delete posts

### Required Headers for LinkedIn API
```
Authorization: Bearer {access_token}
Content-Type: application/json
X-Restli-Protocol-Version: 2.0.0
```

### LinkedIn Endpoints Used
- **Profile Info**: `GET https://api.linkedin.com/v2/userinfo`
- **Create Posts**: `POST https://api.linkedin.com/v2/ugcPosts`
- **Delete Posts**: `DELETE https://api.linkedin.com/v2/ugcPosts/{encoded_post_id}`

## Rate Limits

LinkedIn API has the following rate limits:
- **Profile API**: 500 requests per person per day
- **UGC Posts API**: 100 posts per person per day

## Examples

### Complete Workflow Example

```bash
# 1. Get authorization URL
curl http://localhost:3001/api/social/oauth/linkedin/authorize

# 2. Open authUrl in browser and complete OAuth

# 3. Create a post
curl -X POST http://localhost:3001/api/social/linkedin/post \
  -H "Content-Type: application/json" \
  -d '{"content":"🚀 Hello LinkedIn! #API #Test"}'

# 4. Delete the post (use postId from step 3)
curl -X DELETE http://localhost:3001/api/social/linkedin/post/urn:li:share:1234567890123456789
```

### JavaScript/Node.js Example

```javascript
// Create a post
const response = await fetch('http://localhost:3001/api/social/linkedin/post', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    content: '🚀 Posted via API! #LinkedIn #Automation'
  })
});

const result = await response.json();
console.log('Post created:', result.data.postId);

// Delete the post
const deleteResponse = await fetch(`http://localhost:3001/api/social/linkedin/post/${result.data.postId}`, {
  method: 'DELETE'
});

const deleteResult = await deleteResponse.json();
console.log('Post deleted:', deleteResult.success);
```

## Token Management

- Tokens are stored persistently in `.tokens.json`
- Tokens expire after 60 days
- System automatically checks token expiration with 5-minute buffer
- When tokens expire, re-authentication is required

## Security Considerations

- Never expose access tokens in client-side code
- Store credentials in environment variables
- The `.tokens.json` file is automatically gitignored
- Use HTTPS in production environments
- Implement proper CORS policies for production 