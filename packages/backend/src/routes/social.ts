import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/errorHandler';
import { saveLinkedInTokens, getLinkedInTokens, clearLinkedInTokens } from '../utils/tokenStorage';

const router = Router();

// Social platform connection schema
const connectPlatformSchema = z.object({
  platform: z.enum(['linkedin', 'twitter', 'reddit', 'hackernews']),
  accessToken: z.string().min(1),
  refreshToken: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
});

// Connect social media platform
router.post('/connect', asyncHandler(async (req: Request, res: Response) => {
  const connectionData = connectPlatformSchema.parse(req.body);
  
  // TODO: Implement secure token storage with encryption
  // TODO: Validate tokens with respective platforms
  
  res.json({
    success: true,
    message: `${connectionData.platform} connected successfully`,
    data: {
      platform: connectionData.platform,
      connected: true,
      connectedAt: new Date().toISOString()
    }
  });
}));

// Get connected platforms
router.get('/connections', asyncHandler(async (req: Request, res: Response) => {
  // TODO: Retrieve user's connected platforms from database
  
  res.json({
    success: true,
    data: {
      connections: [
        {
          platform: 'linkedin',
          connected: true,
          connectedAt: '2024-01-01T00:00:00Z',
          status: 'active'
        },
        {
          platform: 'twitter',
          connected: false,
          status: 'not_connected'
        },
        {
          platform: 'reddit',
          connected: false,
          status: 'not_connected'
        },
        {
          platform: 'hackernews',
          connected: false,
          status: 'not_connected'
        }
      ]
    }
  });
}));

// Disconnect platform
router.delete('/disconnect/:platform', asyncHandler(async (req: Request, res: Response) => {
  const { platform } = req.params;
  
  // TODO: Remove stored tokens and revoke access
  
  res.json({
    success: true,
    message: `${platform} disconnected successfully`
  });
}));

// Test platform connection
router.post('/test/:platform', asyncHandler(async (req: Request, res: Response) => {
  const { platform } = req.params;
  
  // TODO: Test API connection with stored tokens
  
  res.json({
    success: true,
    message: `${platform} connection test successful`,
    data: {
      platform,
      status: 'active',
      lastTested: new Date().toISOString()
    }
  });
}));

// OAuth callback handlers
router.get('/oauth/:platform/callback', asyncHandler(async (req: Request, res: Response) => {
  const { platform } = req.params;
  const { code, state, error } = req.query;
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: `OAuth error: ${error}`
    });
  }
  
  if (platform === 'linkedin') {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3001/api/social/oauth/linkedin/callback';
    
    if (!clientId || !clientSecret) {
      return res.status(500).json({
        success: false,
        error: 'LinkedIn credentials not configured'
      });
    }
    
    try {
      // Exchange authorization code for access token
      const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code as string,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });
      
      const tokenData = await tokenResponse.json() as {
        access_token?: string;
        expires_in?: number;
        scope?: string;
        error?: string;
        error_description?: string;
      };
      
      if (!tokenResponse.ok) {
        return res.status(400).json({
          success: false,
          error: 'Failed to exchange code for token',
          details: tokenData
        });
      }
      
      // Get user profile information
      const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });
      
      const profileData = await profileResponse.json() as {
        sub?: string;
        name?: string;
        email?: string;
        picture?: string;
      };
      
      // Store tokens persistently
      if (tokenData.access_token) {
        await saveLinkedInTokens({
          accessToken: tokenData.access_token,
          expiresIn: tokenData.expires_in || 0,
          scope: tokenData.scope || '',
          profile: profileData,
          createdAt: Date.now()
        });
      }
      
      res.json({
        success: true,
        message: 'LinkedIn connected successfully!',
        data: {
          platform,
          profile: {
            id: profileData.sub,
            name: profileData.name,
            email: profileData.email,
            picture: profileData.picture
          },
          tokenInfo: {
            hasAccessToken: !!tokenData.access_token,
            expiresIn: tokenData.expires_in,
            scope: tokenData.scope
          }
        }
      });
      
    } catch (error) {
      console.error('LinkedIn OAuth error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process LinkedIn OAuth callback'
      });
    }
  } else {
    // TODO: Handle other platforms
    res.json({
      success: true,
      message: `${platform} OAuth callback processed`,
      data: {
        platform,
        code,
        state
      }
    });
  }
}));

// Get OAuth authorization URL
router.get('/oauth/:platform/authorize', asyncHandler(async (req: Request, res: Response) => {
  const { platform } = req.params;
  
  if (platform === 'linkedin') {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3001/api/social/oauth/linkedin/callback';
    const state = Math.random().toString(36).substring(2, 15); // Generate random state
    const scope = 'openid profile email w_member_social'; // Permissions for OpenID Connect, profile access, and posting
    
    if (!clientId) {
      return res.status(400).json({
        success: false,
        error: 'LinkedIn Client ID not configured'
      });
    }
    
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(scope)}`;
    
    res.json({
      success: true,
      data: {
        authUrl,
        platform,
        state
      }
    });
  } else {
    // TODO: Implement other platforms
    const authUrls = {
      twitter: 'https://twitter.com/i/oauth2/authorize?...',
      reddit: 'https://www.reddit.com/api/v1/authorize?...',
      hackernews: 'https://news.ycombinator.com/oauth/authorize?...'
    };
    
    res.json({
      success: true,
      data: {
        authUrl: authUrls[platform as keyof typeof authUrls] || null,
        platform
      }
    });
  }
}));

// LinkedIn posting endpoints
router.post('/linkedin/post', asyncHandler(async (req: Request, res: Response) => {
  const { content } = req.body;
  
  if (!content || typeof content !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Content is required'
    });
  }
  
  const tokens = await getLinkedInTokens();
  if (!tokens?.accessToken) {
    return res.status(401).json({
      success: false,
      error: 'LinkedIn not connected. Please authenticate first.'
    });
  }
  
  try {
    // Get user profile ID for posting using the correct LinkedIn OpenID Connect endpoint
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`,
      },
    });
    
    if (!profileResponse.ok) {
      return res.status(400).json({
        success: false,
        error: `Failed to get LinkedIn profile: ${profileResponse.status}`
      });
    }
    
    const profileData = await profileResponse.json() as { sub?: string };
    const profileId = profileData.sub;
    
    if (!profileId) {
      return res.status(400).json({
        success: false,
        error: 'Could not get LinkedIn profile ID from /v2/userinfo endpoint'
      });
    }
    
    // Create LinkedIn post
    const postData = {
      author: `urn:li:person:${profileId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };
    
    const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(postData)
    });
    
    const postResult = await postResponse.json() as { id?: string; error?: string };
    
    if (!postResponse.ok) {
      return res.status(400).json({
        success: false,
        error: 'Failed to create LinkedIn post',
        details: postResult
      });
    }
    
    res.json({
      success: true,
      message: 'LinkedIn post created successfully!',
      data: {
        postId: postResult.id,
        content: content,
        platform: 'linkedin',
        createdAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('LinkedIn posting error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create LinkedIn post'
    });
  }
}));

// Delete LinkedIn post
router.delete('/linkedin/post/:postId', asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;
  
  const tokens = await getLinkedInTokens();
  if (!tokens?.accessToken) {
    return res.status(401).json({
      success: false,
      error: 'LinkedIn not connected. Please authenticate first.'
    });
  }
  
  try {
    // URL encode the postId to handle special characters like colons
    const encodedPostId = encodeURIComponent(postId);
    const deleteResponse = await fetch(`https://api.linkedin.com/v2/ugcPosts/${encodedPostId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });
    
    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json();
      return res.status(400).json({
        success: false,
        error: 'Failed to delete LinkedIn post',
        details: errorData
      });
    }
    
    res.json({
      success: true,
      message: 'LinkedIn post deleted successfully!',
      data: {
        postId: postId,
        deletedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('LinkedIn delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete LinkedIn post'
    });
  }
}));

export { router as socialRouter }; 