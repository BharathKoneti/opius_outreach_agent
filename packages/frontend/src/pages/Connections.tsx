import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const platforms = [
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    icon: '💼',
    connected: true,
    description: 'Share professional content and network with industry leaders'
  },
  { 
    id: 'twitter', 
    name: 'Twitter/X', 
    icon: '𝕏',
    connected: false,
    description: 'Share quick updates and engage with trending topics'
  },
  { 
    id: 'reddit', 
    name: 'Reddit', 
    icon: '🗨️',
    connected: false,
    description: 'Participate in communities and share valuable content'
  },
  { 
    id: 'hackernews', 
    name: 'Hacker News', 
    icon: '📰',
    connected: false,
    description: 'Share tech news and engage with developer community'
  },
];

export default function Connections() {
  const handleConnect = (platformId: string) => {
    console.log('Connecting to:', platformId);
    // TODO: Implement OAuth connection flow
  };

  const handleDisconnect = (platformId: string) => {
    console.log('Disconnecting from:', platformId);
    // TODO: Implement disconnection
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Platform Connections</h1>
        <p className="text-gray-600 mt-2">
          Connect your social media accounts to start publishing content
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map((platform) => (
          <div key={platform.id} className="card p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{platform.icon}</span>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {platform.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {platform.description}
                  </p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                platform.connected 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {platform.connected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            
            <div className="mt-6">
              {platform.connected ? (
                <div className="flex space-x-3">
                  <button className="btn-secondary">
                    Test Connection
                  </button>
                  <button 
                    onClick={() => handleDisconnect(platform.id)}
                    className="btn-danger"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => handleConnect(platform.id)}
                  className="btn-primary"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Connect {platform.name}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 