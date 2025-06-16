# 🔴 **REDDIT API SETUP GUIDE**
*Complete OAuth 2.0 Integration for Reddit Posting*

---

## ✅ **SETUP STATUS**: COMPLETED

Your Reddit application has been successfully created! Here are your credentials:

---

## 🔐 **YOUR REDDIT API CREDENTIALS**

```env
REDDIT_CLIENT_ID=pyYu-4DQ1D59TTzmqUolcQ
REDDIT_CLIENT_SECRET=dwvqsibYGAa5U6jVAFV2ZXigzecqHw
REDDIT_REDIRECT_URI=http://localhost:3001/api/social/oauth/reddit/callback
```

**⚠️ IMPORTANT**: Add these to your `.env` file immediately!

---

## 📋 **APPLICATION DETAILS**

| Setting | Value |
|---------|-------|
| **App Name** | Opius Outreach Agent |
| **App Type** | Web App |
| **Client ID** | `pyYu-4DQ1D59TTzmqUolcQ` |
| **Client Secret** | `dwvqsibYGAa5U6jVAFV2ZXigzecqHw` |
| **About URL** | `http://localhost:5173` |
| **Redirect URI** | `http://localhost:3001/api/social/oauth/reddit/callback` |
| **Scopes** | `identity submit read` |

---

## 🚀 **QUICK TEST WORKFLOW**

### **1. Add Credentials to Environment**
```bash
# Add to your .env file:
echo "REDDIT_CLIENT_ID=pyYu-4DQ1D59TTzmqUolcQ" >> .env
echo "REDDIT_CLIENT_SECRET=dwvqsibYGAa5U6jVAFV2ZXigzecqHw" >> .env
echo "REDDIT_REDIRECT_URI=http://localhost:3001/api/social/oauth/reddit/callback" >> .env
```

### **2. Start Your Backend**
```bash
cd packages/backend
npm start
```

### **3. Test OAuth Authorization**
```bash
curl http://localhost:3001/api/social/oauth/reddit/authorize
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "authUrl": "https://www.reddit.com/api/v1/authorize?client_id=pyYu-4DQ1D59TTzmqUolcQ&response_type=code&state=...",
    "platform": "reddit",
    "state": "..."
  }
}
```

### **4. Complete OAuth Flow**
1. Open the `authUrl` in your browser
2. Authorize the application
3. You'll be redirected to your callback URL
4. Check server logs for "Reddit tokens saved successfully"

### **5. Test Reddit Posting**
```bash
curl -X POST http://localhost:3001/api/social/reddit/post \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello from Opius Outreach Agent! 🚀\n\nTesting our Reddit API integration.",
    "subreddit": "test"
  }'
```

---

## 🎯 **REDDIT API ENDPOINTS**

### **OAuth Endpoints**
- `GET /api/social/oauth/reddit/authorize` - Get authorization URL
- `GET /api/social/oauth/reddit/callback` - OAuth callback (used by Reddit)

### **Posting Endpoints**
- `POST /api/social/reddit/post` - Create a Reddit post
- `DELETE /api/social/reddit/post/:postId` - Delete a Reddit post

### **Request Examples**

**Create Post:**
```json
{
  "content": "Your post content here with markdown support",
  "subreddit": "test"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reddit post created successfully!",
  "data": {
    "postId": "t3_abc123",
    "url": "https://www.reddit.com/r/test/comments/abc123/...",
    "content": "Your post content...",
    "subreddit": "test",
    "platform": "reddit",
    "createdAt": "2025-01-16T12:00:00.000Z"
  }
}
```

---

## 🔧 **REDDIT API SPECIFICS**

### **Required Headers**
```
Authorization: Bearer {access_token}
Content-Type: application/x-www-form-urlencoded
User-Agent: Opius Outreach Agent v1.0
```

### **OAuth Scopes**
- `identity` - Get user profile information
- `submit` - Submit posts to subreddits
- `read` - Read posts and comments

### **Post Types Supported**
- **Self Posts** (text posts) - What we're using
- **Link Posts** - Can be added later
- **Image Posts** - Future enhancement

---

## 📈 **RATE LIMITS**

Reddit has strict rate limits:
- **OAuth Requests**: 60 per minute
- **API Requests**: 60 per minute per OAuth client
- **Posting**: Varies by subreddit and user karma

---

## 🛠️ **INTEGRATION STATUS**

### ✅ **Completed**
- [x] Reddit application created
- [x] OAuth 2.0 flow implemented
- [x] Token storage & refresh
- [x] Post creation endpoint
- [x] Post deletion endpoint
- [x] Error handling
- [x] Rate limit considerations

### 🚧 **Future Enhancements**
- [ ] Subreddit validation
- [ ] Image/link post support
- [ ] Comment management
- [ ] User karma checking
- [ ] Bulk posting with delays

---

## 🔍 **TROUBLESHOOTING**

### **Common Issues**

**Invalid Client Error:**
- Verify Client ID and Secret are correct
- Check redirect URI matches exactly

**Insufficient Permissions:**
- Ensure user has permission to post in target subreddit
- Check if subreddit requires minimum karma

**Rate Limit Exceeded:**
- Implement exponential backoff
- Add delays between requests
- Monitor API usage

---

## 📚 **REDDIT API DOCUMENTATION**

- **OAuth Guide**: https://github.com/reddit-archive/reddit/wiki/OAuth2
- **API Reference**: https://www.reddit.com/dev/api/
- **Rate Limits**: https://github.com/reddit-archive/reddit/wiki/API

---

## 🎯 **NEXT STEPS**

1. **Test the complete workflow** with real Reddit posting
2. **Add subreddit validation** before posting
3. **Implement content moderation** checks
4. **Set up monitoring** for API usage
5. **Move to production** with real subreddits

---

**🎉 Reddit Integration Complete!** Your outreach agent can now post to Reddit automatically.

**Next Platform**: All social platforms are now integrated! 🚀 