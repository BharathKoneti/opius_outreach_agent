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

interface TokenStorage {
  linkedin?: LinkedInTokens;
}

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