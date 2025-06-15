# 🤖 Outreach Agent

A comprehensive multi-platform social media outreach tool that allows you to compose, schedule, and publish content across LinkedIn, Twitter/X, Reddit, and Hacker News from a single interface.

## ✨ Features

### 🎯 Multi-Platform Publishing
- **LinkedIn**: Professional content and networking
- **Twitter/X**: Quick updates and trending topics  
- **Reddit**: Community engagement and discussions
- **Hacker News**: Tech news and developer community

### 📝 Content Management
- Rich text editor with real-time preview
- Drag & drop file upload (images and videos)
- Character count with platform-specific limits
- Content scheduling and automation
- Draft saving and management

### 🔐 Security & Authentication
- Secure OAuth integration for all platforms
- Encrypted token storage
- JWT-based user authentication
- Rate limiting and API quota management

### 📊 Analytics & Insights
- Post performance tracking
- Engagement metrics
- Platform-specific analytics
- Scheduled post management

## 🏗️ Architecture

This project uses a modern monorepo structure with:

### Backend (`packages/backend`)
- **Node.js + Express** - API server
- **TypeScript** - Type safety
- **PostgreSQL + Prisma** - Database ORM
- **JWT + Passport.js** - Authentication
- **Bull Queue + Redis** - Job processing
- **Winston** - Logging

### Frontend (`packages/frontend`)
- **React 18 + TypeScript** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **React Router** - Navigation
- **Tiptap** - Rich text editor

### Shared (`packages/shared`)
- **Zod** - Schema validation
- Common types and utilities

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- PostgreSQL database
- Redis (for job queue)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd outreach-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend environment
   cp packages/backend/env.example packages/backend/.env
   # Edit the .env file with your configuration
   ```

4. **Database Setup**
   ```bash
   cd packages/backend
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. **Start Development Servers**
   ```bash
   # Start backend (from packages/backend)
   npm run dev

   # Start frontend (from packages/frontend) 
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

## 🔧 Development

### Project Structure
```
outreach-agent/
├── packages/
│   ├── backend/          # Express API server
│   │   ├── src/
│   │   │   ├── routes/   # API routes
│   │   │   ├── middleware/
│   │   │   ├── utils/
│   │   │   └── config/
│   │   ├── uploads/      # File storage
│   │   └── env.example   # Environment template
│   ├── frontend/         # React application  
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   └── services/
│   │   └── public/
│   └── shared/           # Shared utilities
├── .project-scaffolding/ # Development tracking
└── package.json          # Workspace configuration
```

### Available Scripts

**Root Level:**
```bash
npm run dev        # Start all development servers
npm run build      # Build all packages  
npm run test       # Run all tests
npm run lint       # Lint all packages
npm run clean      # Clean all dependencies and builds
```

**Backend:**
```bash
npm run dev        # Start dev server with hot reload
npm run build      # Build for production
npm run start      # Start production server
npm run db:migrate # Run database migrations
npm run db:seed    # Seed database with sample data
```

**Frontend:**
```bash
npm run dev        # Start Vite dev server
npm run build      # Build for production  
npm run preview    # Preview production build
npm run test       # Run component tests
```

## 🔌 API Integration

### Social Media Platform Setup

#### LinkedIn
1. Create a LinkedIn App at [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Configure OAuth redirect URI: `http://localhost:3001/api/social/oauth/linkedin/callback`
3. Add your `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET` to `.env`

#### Twitter/X  
1. Create a Twitter App at [Twitter Developer Portal](https://developer.twitter.com/)
2. Enable OAuth 2.0 with PKCE
3. Add your credentials to `.env`

#### Reddit
1. Create a Reddit App at [Reddit Apps](https://www.reddit.com/prefs/apps)
2. Choose "web app" type
3. Add your credentials to `.env`

#### Hacker News
1. Uses Firebase Auth for posting
2. Add your Firebase configuration to `.env`

## 📊 Monitoring & Logging

- **Health Checks**: `/health` endpoint for service monitoring
- **Logging**: Winston logger with structured logging
- **Error Tracking**: Comprehensive error handling and reporting
- **Performance**: Request timing and API rate limit monitoring

## 🚀 Deployment

### Production Environment Variables
```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://host:port
JWT_SECRET=your-production-secret
ENCRYPTION_KEY=your-32-character-encryption-key
```

### Docker Deployment
```bash
# Build containers
docker-compose build

# Start services  
docker-compose up -d

# View logs
docker-compose logs -f
```

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
- Inspired by the need for unified social media management
- Thanks to all the open-source libraries that make this possible

---

**Need help?** Check out our [documentation](docs/) or open an issue for support. 