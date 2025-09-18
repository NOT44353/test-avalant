import React from 'react';
import { Link } from 'react-router-dom';
import { Database, TreePine, TrendingUp, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const challenges = [
    {
      id: 1,
      title: 'Data Processing & Rendering',
      description: 'High-performance data table with 50,000+ records, server-side pagination, sorting, and filtering',
      icon: Database,
      features: ['Server-side pagination', 'Real-time search', 'Multi-column sorting', 'Virtual scrolling'],
      color: 'blue'
    },
    {
      id: 2,
      title: 'Tree & Hierarchy Rendering',
      description: 'Interactive tree structure with lazy loading, search, and auto-expansion',
      icon: TreePine,
      features: ['Lazy loading', 'Smart search', 'Path highlighting', 'Performance optimization'],
      color: 'green'
    },
    {
      id: 3,
      title: 'Real-time Dashboard',
      description: 'Live-updating dashboard with WebSocket connection, real-time quotes, and interactive charts',
      icon: TrendingUp,
      features: ['WebSocket streaming', 'Live updates', 'Interactive charts', 'Auto-reconnection'],
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100',
      green: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100',
      purple: 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Full-Stack Coding Challenges
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Three comprehensive challenges demonstrating high-performance data processing, 
            tree hierarchy rendering, and real-time dashboard capabilities.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tech Stack</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium text-gray-900">Backend</div>
                  <div className="text-gray-600">Node.js + Express</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">Frontend</div>
                  <div className="text-gray-600">React + TypeScript</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">Real-time</div>
                  <div className="text-gray-600">WebSocket</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">Charts</div>
                  <div className="text-gray-600">Recharts</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {challenges.map((challenge) => {
            const Icon = challenge.icon;
            return (
              <Link
                key={challenge.id}
                to={`/challenge${challenge.id}`}
                className={`group block p-6 rounded-lg border-2 transition-all duration-200 ${getColorClasses(challenge.color)}`}
              >
                <div className="flex items-center mb-4">
                  <Icon className={`w-8 h-8 mr-3 ${getIconColor(challenge.color)}`} />
                  <h3 className="text-xl font-semibold">Challenge {challenge.id}</h3>
                </div>
                <p className="text-sm mb-4 opacity-90">
                  {challenge.description}
                </p>
                <ul className="space-y-1 mb-4">
                  {challenge.features.map((feature, index) => (
                    <li key={index} className="text-xs flex items-center">
                      <span className="w-1 h-1 rounded-full bg-current mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center text-sm font-medium group-hover:translate-x-1 transition-transform">
                  Explore Challenge
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Performance Targets */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Performance Targets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">&lt; 500ms</div>
              <div className="text-sm text-gray-600">First page load (50k records)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">&lt; 300ms</div>
              <div className="text-sm text-gray-600">Tree node expansion</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">20/sec</div>
              <div className="text-sm text-gray-600">Real-time updates</div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Each challenge is self-contained with its own data seeding and testing capabilities. 
            Click on any challenge above to begin exploring the features and implementation.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/challenge1"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start with Data Processing
            </Link>
            <Link
              to="/challenge2"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Explore Tree Rendering
            </Link>
            <Link
              to="/challenge3"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Real-time Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
