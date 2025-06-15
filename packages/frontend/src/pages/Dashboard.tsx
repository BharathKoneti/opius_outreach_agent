import React from 'react';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  LinkIcon, 
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

const stats = [
  { 
    name: 'Total Posts', 
    value: '142', 
    change: '+12%', 
    changeType: 'increase',
    icon: DocumentTextIcon 
  },
  { 
    name: 'Active Connections', 
    value: '3', 
    change: '+1', 
    changeType: 'increase',
    icon: LinkIcon 
  },
  { 
    name: 'Scheduled Posts', 
    value: '8', 
    change: '+4', 
    changeType: 'increase',
    icon: CalendarIcon 
  },
  { 
    name: 'Engagement Rate', 
    value: '24.8%', 
    change: '-2.1%', 
    changeType: 'decrease',
    icon: ChartBarIcon 
  },
];

const recentPosts = [
  {
    id: 1,
    content: 'Just launched our new AI-powered outreach tool! 🚀',
    platforms: ['LinkedIn', 'Twitter'],
    status: 'Published',
    publishedAt: '2 hours ago',
    engagement: { likes: 24, comments: 5, shares: 3 }
  },
  {
    id: 2,
    content: 'Thoughts on the future of automation in social media marketing...',
    platforms: ['LinkedIn', 'Reddit'],
    status: 'Published',
    publishedAt: '1 day ago',
    engagement: { likes: 156, comments: 23, shares: 12 }
  },
  {
    id: 3,
    content: 'Tips for effective cross-platform content strategy',
    platforms: ['LinkedIn', 'Twitter', 'Reddit'],
    status: 'Scheduled',
    publishedAt: 'Tomorrow at 9:00 AM',
    engagement: null
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
        <p className="text-primary-100">
          You have 3 scheduled posts and 2 platforms ready for your next campaign.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.changeType === 'increase' ? (
                        <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4" />
                      ) : (
                        <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {stat.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                      </span>
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Posts</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentPosts.map((post) => (
            <div key={post.id} className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex space-x-1">
                      {post.platforms.map((platform) => (
                        <span
                          key={platform}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      post.status === 'Published' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {post.publishedAt}
                  </p>
                </div>
                {post.engagement && (
                  <div className="flex-shrink-0">
                    <dl className="flex space-x-4 text-sm text-gray-500">
                      <div className="flex flex-col items-center">
                        <dt>Likes</dt>
                        <dd className="font-medium text-gray-900">
                          {post.engagement.likes}
                        </dd>
                      </div>
                      <div className="flex flex-col items-center">
                        <dt>Comments</dt>
                        <dd className="font-medium text-gray-900">
                          {post.engagement.comments}
                        </dd>
                      </div>
                      <div className="flex flex-col items-center">
                        <dt>Shares</dt>
                        <dd className="font-medium text-gray-900">
                          {post.engagement.shares}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/compose"
              className="w-full btn-primary justify-center"
            >
              Create New Post
            </a>
            <a
              href="/connections"
              className="w-full btn-secondary justify-center"
            >
              Manage Connections
            </a>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">LinkedIn</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Twitter/X</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Disconnected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Reddit</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Disconnected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Hacker News</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Disconnected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 