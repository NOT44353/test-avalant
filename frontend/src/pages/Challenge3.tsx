import React from 'react';
import RealtimeDashboard from '../components/RealtimeDashboard';

const Challenge3: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Challenge 3: Real-time Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">
            Live-updating dashboard with WebSocket connection, real-time quotes, and interactive charts
          </p>
        </div>

        {/* Features */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900">WebSocket Connection</h3>
            <p className="text-sm text-gray-600 mt-1">Real-time data streaming with auto-reconnection</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900">Live Updates</h3>
            <p className="text-sm text-gray-600 mt-1">20 updates/second with batched UI rendering</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900">Interactive Charts</h3>
            <p className="text-sm text-gray-600 mt-1">Real-time line charts with multiple symbols</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900">Performance</h3>
            <p className="text-sm text-gray-600 mt-1">Optimized rendering with requestAnimationFrame</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">How to use:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• The dashboard automatically connects to the WebSocket server</li>
            <li>• Add or modify stock symbols using the input fields</li>
            <li>• Watch real-time price updates and trend indicators</li>
            <li>• The chart updates automatically with new data points</li>
            <li>• Connection status is shown in the header</li>
          </ul>
        </div>

        {/* Dashboard */}
        <RealtimeDashboard height={600} />
      </div>
    </div>
  );
};

export default Challenge3;
