# Documentation

Welcome to the Outreach Agent documentation. This system provides automated LinkedIn outreach capabilities with a complete API for social media posting.

## 📚 Documentation Structure

### 🚀 Setup & Installation
- **[Quick Start Guide](./setup/QUICK_START_GUIDE.md)** - Get up and running in 5 minutes
- **[Complete Setup Guide](./setup/OUTREACH_SETUP_GUIDE.md)** - Detailed installation instructions

#### LinkedIn Integration ✅
- **[LinkedIn Token Setup](./setup/LINKEDIN_TOKEN_SETUP_GUIDE.md)** - Complete LinkedIn OAuth setup
- **[LinkedIn Quick Setup](./setup/LINKEDIN_QUICK_SETUP.md)** - Quick LinkedIn integration reference

#### Twitter/X Integration ✅
- **[Twitter Token Setup](./setup/TWITTER_TOKEN_SETUP_GUIDE.md)** - Complete Twitter OAuth setup
- **[Twitter Quick Setup](./setup/TWITTER_QUICK_SETUP.md)** - Quick Twitter integration reference

### 🔌 API Reference
- **[API Documentation](./api/README.md)** - Complete REST API reference with examples

### 📖 Guides & Tutorials
- **[Personal LinkedIn Setup](./guides/personal_linkedin_setup.md)** - Personal account configuration
- **[VC Outreach Message](./guides/vc_outreach_message.md)** - Outreach message templates

### 📈 Marketing & Business
- **[Marketing Traction Checklist](./marketing/marketing_traction_checklist.md)** - Business development guide

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   LinkedIn API  │
│   (React)       │◄──►│   (Express.js)  │◄──►│   (OAuth 2.0)   │
│   Port 5173     │    │   Port 3001     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │ Token Storage   │
                       │ (.tokens.json)  │
                       └─────────────────┘
```

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository>
   cd opius_outreach_agent
   npm install
   ```

2. **Setup LinkedIn App**
   - Follow [LinkedIn Quick Setup](./setup/LINKEDIN_QUICK_SETUP.md)
   - Configure environment variables

3. **Start Development**
   ```bash
   npm run dev
   ```

4. **Test API**
   ```bash
   curl http://localhost:3001/api/health
   ```

## 🔑 Key Features

- ✅ **LinkedIn OAuth Integration** - Persistent authentication
- ✅ **Post Creation & Deletion** - Full CRUD operations
- ✅ **RESTful API** - Clean, documented endpoints
- ✅ **Token Management** - Automatic expiration handling
- ✅ **Browser Automation** - Playwright integration for testing
- ✅ **TypeScript Support** - Full type safety

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Frontend**: React, Vite, TypeScript
- **Authentication**: OAuth 2.0 (LinkedIn)
- **Testing**: Playwright
- **Storage**: File-based token storage

## 📋 Prerequisites

- Node.js 18+ and npm
- LinkedIn Developer Account
- Modern web browser for OAuth flow

## 🔗 Important Links

- [LinkedIn Developer Portal](https://developer.linkedin.com/)
- [LinkedIn API Documentation](https://docs.microsoft.com/en-us/linkedin/)
- [OAuth 2.0 Specification](https://oauth.net/2/)

## 🆘 Support & Troubleshooting

### Common Issues
- **"LinkedIn not connected"** → Check token expiration, redo OAuth
- **403 Forbidden** → Verify OAuth scopes and app permissions
- **Server not starting** → Check port 3001 availability

### Getting Help
1. Check the [API Documentation](./api/README.md) for endpoint details
2. Review [Setup Guides](./setup/) for configuration issues
3. Verify LinkedIn app settings match the documentation

## 🔄 Development Workflow

1. **Setup** → Follow setup guides
2. **Develop** → Use API documentation for integration
3. **Test** → Use provided curl examples
4. **Deploy** → Follow production security guidelines

---

**Last Updated**: June 2025  
**Version**: 1.0.0 