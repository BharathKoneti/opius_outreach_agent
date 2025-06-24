# 🚀 **OUTREACH SYSTEM SETUP GUIDE**
*Complete Configuration Guide for Social Media Integrations*

---

## ⚠️ **CURRENT STATUS**: Setup Required

Your outreach system is built but needs API credentials to function. Follow this guide to get all necessary tokens and complete the setup.

---

## 📋 **QUICK SETUP CHECKLIST**

### **Immediate Actions Needed:**
- [ ] **Database Setup** (PostgreSQL + Redis)
- [ ] **LinkedIn API Credentials**
- [ ] **Twitter/X API Credentials**  
- [ ] **Reddit API Credentials**
- [ ] **AWS S3 Configuration** (for file uploads)
- [ ] **Email SMTP Configuration**
- [ ] **Environment Variables Configuration**

---

## 🔧 **STEP-BY-STEP SETUP PROCESS**

### **1. Database Setup** 🗄️

**PostgreSQL:**
```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb outreach_agent
```

**Redis:**
```bash
# Install Redis (macOS)
brew install redis
brew services start redis
```

**Update your `.env`:**
```env
DATABASE_URL="postgresql://localhost:5432/outreach_agent"
REDIS_URL=redis://localhost:6379
```

---

### **2. LinkedIn API Setup** 💼

**Steps:**
1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Create a new app
3. Add your app details:
   - **App Name**: Opius Outreach Agent
   - **LinkedIn Page**: Your company page
   - **App Logo**: Upload your logo
4. In Products, add:
   - **Share on LinkedIn**
   - **Sign In with LinkedIn using OpenID Connect**
5. In Auth tab, add redirect URL: `http://localhost:3001/api/social/oauth/linkedin/callback`

**What you'll get:**
- Client ID
- Client Secret

**Add to `.env`:**
```env
LINKEDIN_CLIENT_ID=your-linkedin-client-id-here
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret-here
```

---

### **3. Twitter/X API Setup** 🐦

**Steps:**
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Apply for developer account (if not already done)
3. Create a new project/app
4. Generate API keys
5. Set up OAuth 2.0:
   - **Callback URL**: `http://localhost:3001/api/social/oauth/twitter/callback`
   - **Website URL**: `http://localhost:5173`

**What you'll get:**
- API Key (Client ID)
- API Secret Key (Client Secret)
- Bearer Token

**Add to `.env`:**
```env
TWITTER_CLIENT_ID=your-twitter-api-key-here
TWITTER_CLIENT_SECRET=your-twitter-api-secret-here
```

---

### **4. Reddit API Setup** 📱

**Steps:**
1. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps)
2. Click "Create App" or "Create Another App"
3. Fill in details:
   - **Name**: Opius Outreach Agent
   - **App type**: Web app
   - **Description**: Social media outreach automation
   - **About URL**: Your website
   - **Redirect URI**: `http://localhost:3001/api/social/oauth/reddit/callback`

**What you'll get:**
- Client ID (under app name)
- Client Secret

**Add to `.env`:**
```env
REDDIT_CLIENT_ID=your-reddit-client-id-here
REDDIT_CLIENT_SECRET=your-reddit-client-secret-here
```

---

### **5. AWS S3 Setup** ☁️

**Steps:**
1. Go to [AWS Console](https://aws.amazon.com/console/)
2. Create S3 bucket for file uploads
3. Create IAM user with S3 permissions
4. Generate access keys

**Required Permissions:**
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

**Add to `.env`:**
```env
AWS_ACCESS_KEY_ID=your-aws-access-key-here
AWS_SECRET_ACCESS_KEY=your-aws-secret-key-here
AWS_BUCKET_NAME=your-s3-bucket-name
AWS_REGION=us-east-1
```

---

### **6. Email Configuration** 📧

**For Gmail SMTP:**
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Google Account → Security → 2-Step Verification → App Passwords
   - Generate password for "Mail"

**Add to `.env`:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
```

---

### **7. Security Configuration** 🔐

**Generate secure keys:**
```bash
# JWT Secret (run in terminal)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Encryption Key (32 characters)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

**Add to `.env`:**
```env
JWT_SECRET=your-generated-jwt-secret-here
ENCRYPTION_KEY=your-generated-encryption-key-here
```

---

## 🚀 **TESTING YOUR SETUP**

### **1. Start the Backend:**
```bash
cd packages/backend
npm install
npm run dev
```

### **2. Start the Frontend:**
```bash
cd packages/frontend
npm install
npm run dev
```

### **3. Test Endpoints:**

**Health Check:**
```bash
curl http://localhost:3001/health
```

**Social Connections:**
```bash
curl http://localhost:3001/api/social/connections
```

---

## 🔍 **VERIFICATION COMMANDS**

Let me create a verification script for you:

```bash
# Test database connection
psql -d outreach_agent -c "SELECT version();"

# Test Redis connection
redis-cli ping

# Test backend health
curl -s http://localhost:3001/health | jq

# Test social endpoints
curl -s http://localhost:3001/api/social/connections | jq
```

---

## 📊 **CURRENT IMPLEMENTATION STATUS**

### ✅ **Completed:**
- Express.js backend with TypeScript
- React frontend with Vite
- OAuth flow framework
- File upload system
- Rate limiting & security
- Error handling
- Logging system

### 🚧 **TODO (In Code):**
- [ ] Database models & migrations
- [ ] Token encryption & storage
- [ ] Actual OAuth implementations
- [ ] Platform-specific API calls
- [ ] Post scheduling system
- [ ] Analytics tracking

---

## 🎯 **NEXT STEPS AFTER SETUP**

1. **Configure all API credentials** (this guide)
2. **Run database migrations** (once implemented)
3. **Test social media connections**
4. **Create your first outreach campaign**
5. **Monitor performance & analytics**

---

## 💡 **HELPFUL TIPS**

### **Rate Limits to Consider:**
- **LinkedIn**: 500 requests/day for basic tier
- **Twitter**: 300 requests/15 minutes
- **Reddit**: 60 requests/minute

### **Best Practices:**
- Keep credentials secure in `.env`
- Use environment-specific configs
- Monitor API quotas
- Implement retry mechanisms
- Log all outreach activities

---

## 🆘 **TROUBLESHOOTING**

### **Common Issues:**

**Database Connection Errors:**
- Verify PostgreSQL is running: `brew services list | grep postgresql`
- Check database exists: `psql -l | grep outreach`

**Redis Connection Errors:**
- Verify Redis is running: `brew services list | grep redis`
- Test connection: `redis-cli ping`

**OAuth Errors:**
- Verify callback URLs match exactly
- Check API keys are correctly copied
- Ensure apps have proper permissions

---

## 📞 **WHAT YOU NEED TO PROVIDE**

Please gather and provide:

1. **LinkedIn App Credentials** (Client ID + Secret)
2. **Twitter App Credentials** (API Key + Secret)
3. **Reddit App Credentials** (Client ID + Secret)
4. **AWS S3 Credentials** (Access Key + Secret + Bucket)
5. **Gmail App Password** (for notifications)

Once you have these, I'll help you configure the `.env` file and test all connections!

---

*🔧 Ready to start setup? Let me know which platform you'd like to configure first!* 