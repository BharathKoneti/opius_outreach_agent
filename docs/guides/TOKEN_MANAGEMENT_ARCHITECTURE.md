# 🔐 Token Management Architecture

## Overview

This document outlines the scalable token management system for the multi-platform outreach agent, designed to handle current integrations (LinkedIn, Twitter/X) and future platforms (Reddit, Hacker News, Instagram, TikTok, etc.).

## 🏗️ Current Architecture

### Token Storage Structure

```typescript
interface PlatformTokens {
  linkedin?: LinkedInTokens;
  twitter?: TwitterTokens;
  reddit?: RedditTokens;
  hackernews?: HackerNewsTokens;
  instagram?: InstagramTokens;
  tiktok?: TikTokTokens;
  youtube?: YouTubeTokens;
  facebook?: FacebookTokens;
}

interface BaseTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  scope: string;
  profile: PlatformProfile;
  createdAt: string;
  lastRefreshed?: string;
}
```

### File Structure
```
packages/backend/
├── .tokens.json          # Persistent token storage (gitignored)
├── .env                  # Platform credentials (gitignored)
└── src/utils/
    └── tokenStorage.ts   # Token management utilities
```

## 🚀 Scalable Token Management Plan

### 1. Platform-Specific Token Interfaces

```typescript
// Current Implementations
interface LinkedInTokens extends BaseTokens {
  // LinkedIn uses OpenID Connect
  // 60-day expiration, no refresh token
}

interface TwitterTokens extends BaseTokens {
  // Twitter OAuth 2.0 with PKCE
  // 2-hour expiration, has refresh token
  refreshToken: string;
}

// Future Implementations
interface RedditTokens extends BaseTokens {
  // Reddit OAuth 2.0
  // 1-hour expiration, has refresh token
  refreshToken: string;
  deviceId?: string;
}

interface HackerNewsTokens extends BaseTokens {
  // Firebase Auth
  // Custom token management
  firebaseToken: string;
  idToken: string;
}

interface InstagramTokens extends BaseTokens {
  // Instagram Basic Display API
  // 60-day expiration, has refresh token
  refreshToken: string;
  userId: string;
}

interface TikTokTokens extends BaseTokens {
  // TikTok for Developers
  // 24-hour expiration, has refresh token
  refreshToken: string;
  openId: string;
}

interface YouTubeTokens extends BaseTokens {
  // Google OAuth 2.0
  // 1-hour expiration, has refresh token
  refreshToken: string;
  channelId: string;
}

interface FacebookTokens extends BaseTokens {
  // Facebook Graph API
  // 60-day expiration, has refresh token
  refreshToken: string;
  pageTokens?: { [pageId: string]: string };
}
```

### 2. Universal Token Management Functions

```typescript
// Generic token operations
async function saveTokens<T extends BaseTokens>(
  platform: string, 
  tokens: T
): Promise<void>

async function getTokens<T extends BaseTokens>(
  platform: string
): Promise<T | null>

async function refreshTokens<T extends BaseTokens>(
  platform: string
): Promise<T | null>

async function clearTokens(platform: string): Promise<void>

async function isTokenValid(platform: string): Promise<boolean>

async function getAllPlatformTokens(): Promise<PlatformTokens>
```

### 3. Platform Configuration Registry

```typescript
interface PlatformConfig {
  name: string;
  authType: 'oauth2' | 'oauth2_pkce' | 'firebase' | 'api_key';
  tokenExpiration: number; // seconds
  hasRefreshToken: boolean;
  scopes: string[];
  endpoints: {
    authorize: string;
    token: string;
    refresh?: string;
    revoke?: string;
  };
  rateLimit: {
    requests: number;
    window: number; // seconds
  };
}

const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
  linkedin: {
    name: 'LinkedIn',
    authType: 'oauth2',
    tokenExpiration: 5184000, // 60 days
    hasRefreshToken: false,
    scopes: ['openid', 'profile', 'email', 'w_member_social'],
    endpoints: {
      authorize: 'https://www.linkedin.com/oauth/v2/authorization',
      token: 'https://www.linkedin.com/oauth/v2/accessToken',
    },
    rateLimit: { requests: 100, window: 86400 }
  },
  twitter: {
    name: 'Twitter/X',
    authType: 'oauth2_pkce',
    tokenExpiration: 7200, // 2 hours
    hasRefreshToken: true,
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
    endpoints: {
      authorize: 'https://twitter.com/i/oauth2/authorize',
      token: 'https://api.twitter.com/2/oauth2/token',
      refresh: 'https://api.twitter.com/2/oauth2/token',
      revoke: 'https://api.twitter.com/2/oauth2/revoke',
    },
    rateLimit: { requests: 200, window: 900 }
  },
  // ... future platforms
};
```

## 🔄 Token Lifecycle Management

### 1. Automatic Refresh Strategy

```typescript
class TokenManager {
  private refreshIntervals: Map<string, NodeJS.Timeout> = new Map();

  async initializeAutoRefresh(): Promise<void> {
    for (const platform of Object.keys(PLATFORM_CONFIGS)) {
      const config = PLATFORM_CONFIGS[platform];
      if (config.hasRefreshToken) {
        this.scheduleTokenRefresh(platform, config.tokenExpiration);
      }
    }
  }

  private scheduleTokenRefresh(platform: string, expirationSeconds: number): void {
    // Refresh at 80% of expiration time
    const refreshTime = expirationSeconds * 0.8 * 1000;
    
    const interval = setInterval(async () => {
      try {
        await this.refreshTokens(platform);
        console.log(`✅ ${platform} tokens refreshed automatically`);
      } catch (error) {
        console.error(`❌ Failed to refresh ${platform} tokens:`, error);
        // Implement notification/alert system
      }
    }, refreshTime);

    this.refreshIntervals.set(platform, interval);
  }
}
```

### 2. Token Health Monitoring

```typescript
interface TokenHealth {
  platform: string;
  isValid: boolean;
  expiresIn: number;
  lastRefreshed?: string;
  needsRefresh: boolean;
  error?: string;
}

async function getTokenHealthStatus(): Promise<TokenHealth[]> {
  const platforms = Object.keys(PLATFORM_CONFIGS);
  const healthChecks = await Promise.all(
    platforms.map(async (platform) => {
      try {
        const tokens = await getTokens(platform);
        if (!tokens) {
          return {
            platform,
            isValid: false,
            expiresIn: 0,
            needsRefresh: false,
            error: 'No tokens found'
          };
        }

        const now = Date.now();
        const expiresAt = new Date(tokens.createdAt).getTime() + (tokens.expiresIn * 1000);
        const expiresIn = Math.max(0, expiresAt - now);
        const needsRefresh = expiresIn < (tokens.expiresIn * 0.2 * 1000); // 20% threshold

        return {
          platform,
          isValid: expiresIn > 0,
          expiresIn: Math.floor(expiresIn / 1000),
          lastRefreshed: tokens.lastRefreshed,
          needsRefresh,
        };
      } catch (error) {
        return {
          platform,
          isValid: false,
          expiresIn: 0,
          needsRefresh: false,
          error: error.message
        };
      }
    })
  );

  return healthChecks;
}
```

## 🔒 Security Architecture

### 1. Token Encryption (Production)

```typescript
import CryptoJS from 'crypto-js';

class SecureTokenStorage {
  private encryptionKey: string;

  constructor() {
    this.encryptionKey = process.env.TOKEN_ENCRYPTION_KEY || '';
    if (!this.encryptionKey) {
      throw new Error('TOKEN_ENCRYPTION_KEY environment variable required');
    }
  }

  private encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
  }

  private decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  async saveEncryptedTokens(platform: string, tokens: any): Promise<void> {
    const encryptedTokens = this.encrypt(JSON.stringify(tokens));
    // Save to secure storage (database, key vault, etc.)
  }
}
```

### 2. Environment-Specific Storage

```typescript
interface StorageAdapter {
  save(key: string, data: any): Promise<void>;
  load(key: string): Promise<any>;
  delete(key: string): Promise<void>;
}

class FileStorageAdapter implements StorageAdapter {
  // Current file-based storage for development
}

class DatabaseStorageAdapter implements StorageAdapter {
  // PostgreSQL with encryption for production
}

class KeyVaultStorageAdapter implements StorageAdapter {
  // AWS Secrets Manager / Azure Key Vault for production
}
```

## 🎯 UI Integration Strategy

### 1. Platform Connection Status

```typescript
interface PlatformStatus {
  platform: string;
  connected: boolean;
  profileName?: string;
  profileImage?: string;
  tokenHealth: TokenHealth;
  lastPost?: {
    content: string;
    timestamp: string;
    success: boolean;
  };
}

// UI Component Data
async function getPlatformStatuses(): Promise<PlatformStatus[]> {
  const healthStatuses = await getTokenHealthStatus();
  
  return Promise.all(
    healthStatuses.map(async (health) => {
      const tokens = await getTokens(health.platform);
      return {
        platform: health.platform,
        connected: health.isValid,
        profileName: tokens?.profile?.name,
        profileImage: tokens?.profile?.picture,
        tokenHealth: health,
      };
    })
  );
}
```

### 2. Multi-Platform Publishing

```typescript
interface PublishRequest {
  content: string;
  platforms: string[];
  scheduleTime?: string;
  attachments?: {
    images?: string[];
    videos?: string[];
  };
}

interface PublishResult {
  platform: string;
  success: boolean;
  postId?: string;
  error?: string;
  url?: string;
}

async function publishToMultiplePlatforms(
  request: PublishRequest
): Promise<PublishResult[]> {
  const results = await Promise.allSettled(
    request.platforms.map(async (platform) => {
      try {
        const isValid = await isTokenValid(platform);
        if (!isValid) {
          throw new Error(`${platform} tokens are invalid or expired`);
        }

        const result = await publishToPlatform(platform, request);
        return {
          platform,
          success: true,
          postId: result.id,
          url: result.url,
        };
      } catch (error) {
        return {
          platform,
          success: false,
          error: error.message,
        };
      }
    })
  );

  return results.map((result, index) => {
    const platform = request.platforms[index];
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        platform,
        success: false,
        error: result.reason.message,
      };
    }
  });
}
```

## 📊 Future Platform Roadmap

### Phase 2: Core Social Platforms
- ✅ **LinkedIn** (Completed)
- ✅ **Twitter/X** (Completed)
- 🚧 **Reddit** (Next)
- 🚧 **Hacker News** (Next)

### Phase 3: Visual Platforms
- 🔄 **Instagram** (Stories, Posts, Reels)
- 🔄 **TikTok** (Short-form videos)
- 🔄 **YouTube** (Videos, Shorts, Community posts)

### Phase 4: Professional Platforms
- 🔄 **Facebook** (Personal + Business pages)
- 🔄 **Medium** (Long-form content)
- 🔄 **Dev.to** (Developer community)

### Phase 5: Emerging Platforms
- 🔄 **Threads** (Meta's Twitter alternative)
- 🔄 **Mastodon** (Decentralized social)
- 🔄 **Discord** (Community engagement)

## 🔧 Implementation Checklist

### Current Status
- [x] LinkedIn token management
- [x] Twitter token management
- [x] File-based storage with encryption
- [x] Automatic token refresh (Twitter)
- [x] Token health monitoring
- [x] Multi-platform architecture foundation

### Next Steps
1. [ ] Implement Reddit OAuth integration
2. [ ] Add Hacker News Firebase auth
3. [ ] Create unified publishing interface
4. [ ] Build token health dashboard
5. [ ] Implement production-grade encryption
6. [ ] Add database storage option
7. [ ] Create platform connection UI
8. [ ] Build multi-platform composer

## 🎯 Success Metrics

- **Token Reliability**: 99.9% uptime for active tokens
- **Auto-Refresh Success**: 100% success rate for platforms with refresh tokens
- **Platform Coverage**: Support for 8+ major platforms
- **Publishing Success**: 95%+ success rate for multi-platform posts
- **Security**: Zero token exposure incidents 