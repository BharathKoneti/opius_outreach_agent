import fs from 'fs/promises';
import path from 'path';

const TOKEN_FILE = path.join(__dirname, '../../.tokens.json');

interface LinkedInTokens {
  accessToken: string;
  expiresIn: number;
  scope: string;
  profile: any;
  createdAt: number;
}

interface TwitterTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  scope: string;
  profile: any;
  createdAt: number;
}

interface RedditTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  scope: string;
  profile: any;
  createdAt: number;
}

interface TokenStorage {
  linkedin?: LinkedInTokens;
  twitter?: TwitterTokens;
  reddit?: RedditTokens;
}

// LinkedIn token functions
export async function saveLinkedInTokens(tokens: LinkedInTokens): Promise<void> {
  try {
    let storage: TokenStorage = {};
    
    // Try to read existing tokens
    try {
      const data = await fs.readFile(TOKEN_FILE, 'utf-8');
      storage = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet, that's fine
    }
    
    // Add timestamp for expiration checking
    storage.linkedin = {
      ...tokens,
      createdAt: Date.now()
    };
    
    await fs.writeFile(TOKEN_FILE, JSON.stringify(storage, null, 2));
    console.log('LinkedIn tokens saved successfully');
  } catch (error) {
    console.error('Failed to save LinkedIn tokens:', error);
  }
}

export async function getLinkedInTokens(): Promise<LinkedInTokens | null> {
  try {
    const data = await fs.readFile(TOKEN_FILE, 'utf-8');
    const storage: TokenStorage = JSON.parse(data);
    
    if (!storage.linkedin) {
      return null;
    }
    
    const tokens = storage.linkedin;
    const now = Date.now();
    const tokenAge = now - tokens.createdAt;
    const expiresInMs = tokens.expiresIn * 1000;
    
    // Check if token is expired (with 5 minute buffer)
    if (tokenAge >= (expiresInMs - 300000)) {
      console.log('LinkedIn token expired');
      return null;
    }
    
    return tokens;
  } catch (error) {
    console.log('No LinkedIn tokens found or error reading tokens');
    return null;
  }
}

export async function clearLinkedInTokens(): Promise<void> {
  try {
    let storage: TokenStorage = {};
    
    try {
      const data = await fs.readFile(TOKEN_FILE, 'utf-8');
      storage = JSON.parse(data);
    } catch (error) {
      // File doesn't exist, nothing to clear
      return;
    }
    
    delete storage.linkedin;
    await fs.writeFile(TOKEN_FILE, JSON.stringify(storage, null, 2));
    console.log('LinkedIn tokens cleared');
  } catch (error) {
    console.error('Failed to clear LinkedIn tokens:', error);
  }
}

// Twitter token functions
export async function saveTwitterTokens(tokens: TwitterTokens): Promise<void> {
  try {
    let storage: TokenStorage = {};
    
    // Try to read existing tokens
    try {
      const data = await fs.readFile(TOKEN_FILE, 'utf-8');
      storage = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet, that's fine
    }
    
    // Add timestamp for expiration checking
    storage.twitter = {
      ...tokens,
      createdAt: Date.now()
    };
    
    await fs.writeFile(TOKEN_FILE, JSON.stringify(storage, null, 2));
    console.log('Twitter tokens saved successfully');
  } catch (error) {
    console.error('Failed to save Twitter tokens:', error);
  }
}

export async function getTwitterTokens(): Promise<TwitterTokens | null> {
  try {
    const data = await fs.readFile(TOKEN_FILE, 'utf-8');
    const storage: TokenStorage = JSON.parse(data);
    
    if (!storage.twitter) {
      return null;
    }
    
    const tokens = storage.twitter;
    const now = Date.now();
    const tokenAge = now - tokens.createdAt;
    const expiresInMs = tokens.expiresIn * 1000;
    
    // Check if token is expired (with 5 minute buffer)
    // Twitter tokens expire in 2 hours by default
    if (tokenAge >= (expiresInMs - 300000)) {
      console.log('Twitter token expired, attempting refresh...');
      
      // If we have a refresh token, try to refresh
      if (tokens.refreshToken) {
        try {
          const refreshedTokens = await refreshTwitterToken(tokens.refreshToken);
          if (refreshedTokens) {
            return refreshedTokens;
          }
        } catch (error) {
          console.error('Failed to refresh Twitter token:', error);
        }
      }
      
      return null;
    }
    
    return tokens;
  } catch (error) {
    console.log('No Twitter tokens found or error reading tokens');
    return null;
  }
}

export async function clearTwitterTokens(): Promise<void> {
  try {
    let storage: TokenStorage = {};
    
    try {
      const data = await fs.readFile(TOKEN_FILE, 'utf-8');
      storage = JSON.parse(data);
    } catch (error) {
      // File doesn't exist, nothing to clear
      return;
    }
    
    delete storage.twitter;
    await fs.writeFile(TOKEN_FILE, JSON.stringify(storage, null, 2));
    console.log('Twitter tokens cleared');
  } catch (error) {
    console.error('Failed to clear Twitter tokens:', error);
  }
}

// Twitter token refresh function
async function refreshTwitterToken(refreshToken: string): Promise<TwitterTokens | null> {
  try {
    const clientId = process.env.TWITTER_CLIENT_ID;
    const clientSecret = process.env.TWITTER_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      console.error('Twitter credentials not configured');
      return null;
    }
    
    const response = await fetch('https://api.x.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId
      })
    });
    
    if (!response.ok) {
      console.error('Failed to refresh Twitter token:', response.status);
      return null;
    }
    
    const tokenData = await response.json() as {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
      scope: string;
    };
    
    // Get user profile with new token
    const profileResponse = await fetch('https://api.x.com/2/users/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });
    
    const profileData = await profileResponse.json();
    
    const newTokens: TwitterTokens = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || refreshToken,
      expiresIn: tokenData.expires_in,
      scope: tokenData.scope,
      profile: profileData,
      createdAt: Date.now()
    };
    
    // Save the refreshed tokens
    await saveTwitterTokens(newTokens);
    
    return newTokens;
  } catch (error) {
    console.error('Error refreshing Twitter token:', error);
    return null;
  }
}

// Reddit token functions
export async function saveRedditTokens(tokens: RedditTokens): Promise<void> {
  try {
    let storage: TokenStorage = {};
    
    // Try to read existing tokens
    try {
      const data = await fs.readFile(TOKEN_FILE, 'utf-8');
      storage = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet, that's fine
    }
    
    // Add timestamp for expiration checking
    storage.reddit = {
      ...tokens,
      createdAt: Date.now()
    };
    
    await fs.writeFile(TOKEN_FILE, JSON.stringify(storage, null, 2));
    console.log('Reddit tokens saved successfully');
  } catch (error) {
    console.error('Failed to save Reddit tokens:', error);
  }
}

export async function getRedditTokens(): Promise<RedditTokens | null> {
  try {
    const data = await fs.readFile(TOKEN_FILE, 'utf-8');
    const storage: TokenStorage = JSON.parse(data);
    
    if (!storage.reddit) {
      return null;
    }
    
    const tokens = storage.reddit;
    const now = Date.now();
    const tokenAge = now - tokens.createdAt;
    const expiresInMs = tokens.expiresIn * 1000;
    
    // Check if token is expired (with 5 minute buffer)
    // Reddit tokens are permanent unless revoked
    if (tokenAge >= (expiresInMs - 300000)) {
      console.log('Reddit token expired, attempting refresh...');
      
      // Try to refresh the token
      try {
        const refreshedTokens = await refreshRedditToken(tokens.refreshToken);
        if (refreshedTokens) {
          return refreshedTokens;
        }
      } catch (error) {
        console.error('Failed to refresh Reddit token:', error);
      }
      
      return null;
    }
    
    return tokens;
  } catch (error) {
    console.log('No Reddit tokens found or error reading tokens');
    return null;
  }
}

export async function clearRedditTokens(): Promise<void> {
  try {
    let storage: TokenStorage = {};
    
    try {
      const data = await fs.readFile(TOKEN_FILE, 'utf-8');
      storage = JSON.parse(data);
    } catch (error) {
      // File doesn't exist, nothing to clear
      return;
    }
    
    delete storage.reddit;
    await fs.writeFile(TOKEN_FILE, JSON.stringify(storage, null, 2));
    console.log('Reddit tokens cleared');
  } catch (error) {
    console.error('Failed to clear Reddit tokens:', error);
  }
}

// Reddit token refresh function
async function refreshRedditToken(refreshToken: string): Promise<RedditTokens | null> {
  try {
    const clientId = process.env.REDDIT_CLIENT_ID;
    const clientSecret = process.env.REDDIT_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      console.error('Reddit credentials not configured');
      return null;
    }
    
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'User-Agent': 'Opius Outreach Agent v1.0'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });
    
    if (!response.ok) {
      console.error('Failed to refresh Reddit token:', response.status);
      return null;
    }
    
    const tokenData = await response.json() as {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
      scope: string;
    };
    
    // Get user profile with new token
    const profileResponse = await fetch('https://oauth.reddit.com/api/v1/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'User-Agent': 'Opius Outreach Agent v1.0'
      },
    });
    
    const profileData = await profileResponse.json();
    
    const newTokens: RedditTokens = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || refreshToken,
      expiresIn: tokenData.expires_in,
      scope: tokenData.scope,
      profile: profileData,
      createdAt: Date.now()
    };
    
    // Save the refreshed tokens
    await saveRedditTokens(newTokens);
    
    return newTokens;
  } catch (error) {
    console.error('Error refreshing Reddit token:', error);
    return null;
  }
} 