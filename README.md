# 🤖 Outreach Agent

A comprehensive multi-platform social media outreach tool that allows you to compose, schedule, and publish content across LinkedIn, Twitter/X, Reddit, and Hacker News from a single interface.

## ✨ Features

### 🎯 Multi-Platform Publishing
- **LinkedIn**: ✅ **FULLY IMPLEMENTED** - Professional content and networking with OAuth 2.0, post creation/deletion
- **Twitter/X**: 🚧 Coming next - Quick updates and trending topics  
- **Reddit**: 🚧 Planned - Community engagement and discussions
- **Hacker News**: 🚧 Planned - Tech news and developer community

### 📝 Content Management
- ✅ **LinkedIn Post Creation** - Create and delete posts via API
- 🚧 Rich text editor with real-time preview (planned)
- 🚧 Drag & drop file upload (images and videos) (planned)
- 🚧 Character count with platform-specific limits (planned)
- 🚧 Content scheduling and automation (planned)
- 🚧 Draft saving and management (planned)

### 🔐 Security & Authentication
- ✅ **LinkedIn OAuth 2.0** - Complete OpenID Connect integration
- ✅ **Persistent Token Storage** - File-based with 60-day expiration
- ✅ **Secure Credential Management** - Environment variables
- 🚧 JWT-based user authentication (planned)
- 🚧 Rate limiting and API quota management (planned)

### 📊 Analytics & Insights
- 🚧 Post performance tracking (planned)
- 🚧 Engagement metrics (planned)
- 🚧 Platform-specific analytics (planned)
- 🚧 Scheduled post management (planned)

## 🏗️ Architecture

This project uses a modern monorepo structure with:

### Backend (`packages/backend`)
- **Node.js + Express** - API server ✅
- **TypeScript** - Type safety ✅
- **OAuth 2.0** - LinkedIn authentication ✅
- **File-based Storage** - Persistent token management ✅
- 🚧 PostgreSQL + Prisma - Database ORM (planned)
- 🚧 JWT + Passport.js - User authentication (planned)
- 🚧 Bull Queue + Redis - Job processing (planned)
- 🚧 Winston - Logging (planned)

### Frontend (`packages/frontend`)
- **React 18 + TypeScript** - UI framework ✅
- **Vite** - Build tool and dev server ✅
- 🚧 Tailwind CSS - Styling (planned)
- 🚧 React Query - Data fetching (planned)
- 🚧 React Router - Navigation (planned)
- 🚧 Tiptap - Rich text editor (planned)

### Shared (`packages/shared`)
- **TypeScript** - Common types ✅
- 🚧 Zod - Schema validation (planned)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- LinkedIn Developer Account

### 5-Minute LinkedIn Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd opius_outreach_agent
   npm install
   ```

2. **Setup LinkedIn App**
   - Follow [LinkedIn Quick Setup](./docs/setup/LINKEDIN_QUICK_SETUP.md)
   - Configure environment variables in `packages/backend/.env`

3. **Start Backend**
   ```bash
   cd packages/backend
   npm start
   ```

4. **Generate LinkedIn Tokens**
   ```bash
   # Get authorization URL
   curl http://localhost:3001/api/social/oauth/linkedin/authorize
   
   # Open authUrl in browser, complete OAuth flow
   ```

5. **Test LinkedIn Integration**
   ```bash
   # Create a post
   curl -X POST http://localhost:3001/api/social/linkedin/post \
     -H "Content-Type: application/json" \
     -d '{"content":"🚀 Hello LinkedIn! Posted via API #LinkedInAPI"}'
   ```

## 📚 Documentation

### 🚀 Setup & Installation
- **[📖 Complete Documentation](./docs/README.md)** - Main documentation hub
- **[⚡ Quick Start Guide](./docs/setup/QUICK_START_GUIDE.md)** - Get up and running in 5 minutes
- **[🔧 LinkedIn Token Setup](./docs/setup/LINKEDIN_TOKEN_SETUP_GUIDE.md)** - Complete LinkedIn OAuth setup
- **[⚡ LinkedIn Quick Setup](./docs/setup/LINKEDIN_QUICK_SETUP.md)** - Quick LinkedIn integration reference

### 🔌 API Reference
- **[📋 API Documentation](./docs/api/README.md)** - Complete REST API reference with examples

### 📖 Guides & Tutorials
- **[👤 Personal LinkedIn Setup](./docs/guides/personal_linkedin_setup.md)** - Personal account configuration
- **[💼 VC Outreach Message](./docs/guides/vc_outreach_message.md)** - Outreach message templates

## 🔧 Development

### Project Structure
```
opius_outreach_agent/
├── docs/                 # 📚 All documentation
│   ├── setup/           # Setup guides
│   ├── api/             # API documentation
│   ├── guides/          # Tutorials
│   └── marketing/       # Business guides
├── packages/
│   ├── backend/         # Express API server
│   │   ├── src/
│   │   │   ├── routes/  # API routes
│   │   │   └── utils/   # Token storage utilities
│   │   └── .env         # Environment configuration
│   ├── frontend/        # React application
│   └── shared/          # Shared utilities
├── vc_outreach/         # VC outreach automation
└── data/                # Data and research
```

### Available Scripts

**Backend:**
```bash
cd packages/backend
npm start              # Start production server
npm run dev           # Start dev server with hot reload
```

**Frontend:**
```bash
cd packages/frontend  
npm run dev           # Start Vite dev server
```

## 🔌 API Integration

### Social Media Platform Setup

#### ✅ LinkedIn (IMPLEMENTED)
1. ✅ Create a LinkedIn App at [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. ✅ Configure OAuth redirect URI: `http://localhost:3001/api/social/oauth/linkedin/callback`
3. ✅ Add your `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET` to `.env`
4. ✅ Complete OAuth flow and persistent token storage
5. ✅ Create and delete posts via API

**Current LinkedIn API Endpoints:**
- `GET /api/social/oauth/linkedin/authorize` - Get authorization URL
- `GET /api/social/oauth/linkedin/callback` - OAuth callback
- `POST /api/social/linkedin/post` - Create LinkedIn post
- `DELETE /api/social/linkedin/post/:postId` - Delete LinkedIn post

#### 🚧 Twitter/X (COMING NEXT)
1. Create a Twitter App at [Twitter Developer Portal](https://developer.twitter.com/)
2. Enable OAuth 2.0 with PKCE
3. Add your credentials to `.env`

#### 🚧 Reddit (PLANNED)
1. Create a Reddit App at [Reddit Apps](https://www.reddit.com/prefs/apps)
2. Choose "web app" type
3. Add your credentials to `.env`

#### 🚧 Hacker News (PLANNED)
1. Uses Firebase Auth for posting
2. Add your Firebase configuration to `.env`

## ✅ Current Status (LinkedIn Complete)

### LinkedIn Integration
- [x] OAuth 2.0 authentication with OpenID Connect
- [x] Persistent token storage (60-day expiration)
- [x] Post creation with full content support
- [x] Post deletion with proper URL encoding
- [x] Profile information retrieval
- [x] Automatic token expiration handling
- [x] Complete API documentation
- [x] Browser automation testing with Playwright
- [x] End-to-end workflow verification

### API & Testing
- [x] RESTful API with consistent responses
- [x] Complete error handling
- [x] Comprehensive documentation
- [x] Working examples and guides

## 🚧 Roadmap

### Phase 1: LinkedIn ✅ COMPLETE
- [x] OAuth 2.0 integration
- [x] Post creation and deletion
- [x] Persistent authentication
- [x] Complete documentation

### Phase 2: Twitter/X 🚧 IN PROGRESS
- [ ] Twitter OAuth 2.0 integration
- [ ] Tweet creation and deletion
- [ ] Thread support
- [ ] Media upload

### Phase 3: Reddit 🚧 PLANNED
- [ ] Reddit OAuth integration
- [ ] Subreddit posting
- [ ] Comment management
- [ ] Karma tracking

### Phase 4: Hacker News 🚧 PLANNED
- [ ] HN authentication
- [ ] Story submission
- [ ] Comment posting
- [ ] Vote tracking

### Phase 5: Frontend UI 🚧 PLANNED
- [ ] Multi-platform dashboard
- [ ] Rich text editor
- [ ] Content scheduling
- [ ] Analytics dashboard

## 🔐 Security

- **OAuth 2.0** - Industry standard authentication
- **Environment Variables** - Secure credential storage
- **Token Encryption** - Secure token storage
- **Gitignored Secrets** - No credentials in version control

## 🆘 Support

### Quick Help
- **"LinkedIn not connected"** → Check [Token Setup Guide](./docs/setup/LINKEDIN_TOKEN_SETUP_GUIDE.md)
- **403 Forbidden** → Verify OAuth scopes in LinkedIn app
- **Server issues** → Check [API Documentation](./docs/api/README.md)

### Documentation
1. **Setup Issues** → [Setup Guides](./docs/setup/)
2. **API Questions** → [API Documentation](./docs/api/README.md)
3. **Integration Help** → [Complete Documentation](./docs/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- LinkedIn integration successfully implemented with OAuth 2.0
- Thanks to all the open-source libraries that make this possible

---

**Need help?** Check out our [documentation](docs/) or open an issue for support. 