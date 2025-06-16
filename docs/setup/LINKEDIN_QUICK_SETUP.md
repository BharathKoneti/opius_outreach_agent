# LinkedIn Token Quick Setup

Quick reference for setting up LinkedIn OAuth tokens.

## 🚀 Quick Start (5 minutes)

### 1. Create LinkedIn App
1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Create App → Name: "Professional Outreach Tool" → Individual
3. Auth tab → Add redirect URL: `http://localhost:3001/api/social/oauth/linkedin/callback`
4. Products tab → Request "Sign In with LinkedIn using OpenID Connect"
5. Copy Client ID and Client Secret

### 2. Configure Environment
```bash
# .env file in packages/backend/
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:3001/api/social/oauth/linkedin/callback
```

### 3. Generate Tokens
```bash
# Start server
cd packages/backend && npm start

# Get auth URL
curl http://localhost:3001/api/social/oauth/linkedin/authorize

# Copy authUrl from response, open in browser, click "Allow"
```

### 4. Test Integration
```bash
# Create post
curl -X POST http://localhost:3001/api/social/linkedin/post \
  -H "Content-Type: application/json" \
  -d '{"content":"🚀 Test post from API!"}'

# Delete post (use postId from response)
curl -X DELETE http://localhost:3001/api/social/linkedin/post/urn:li:share:XXXXXXXXX
```

## ✅ Success Checklist
- [ ] LinkedIn app created with correct redirect URL
- [ ] OpenID Connect product approved
- [ ] Environment variables set
- [ ] Server running on port 3001
- [ ] OAuth completed (browser shows success)
- [ ] Post creation works
- [ ] Post deletion works
- [ ] Tokens persist after server restart

## 🔧 Key Technical Details

**OAuth Scopes**: `openid profile email w_member_social`
**Profile Endpoint**: `/v2/userinfo` (OpenID Connect)
**Profile ID Field**: `sub` (not `id`)
**Required Header**: `X-Restli-Protocol-Version: 2.0.0`

## 🚨 Common Issues
- **403 on profile**: Wrong scopes → Use OpenID Connect scopes
- **"LinkedIn not connected"**: Tokens expired → Redo OAuth
- **Delete fails**: URL encoding → System handles automatically

## 📁 Files Created
- `.tokens.json` - Persistent token storage (auto-created, gitignored)
- `packages/backend/src/utils/tokenStorage.ts` - Token management utilities

---
*For detailed setup instructions, see [LINKEDIN_TOKEN_SETUP_GUIDE.md](./LINKEDIN_TOKEN_SETUP_GUIDE.md)* 