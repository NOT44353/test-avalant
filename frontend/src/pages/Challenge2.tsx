import React, { useState, useEffect } from 'react';
import TreeView from '../components/TreeView';
import { treeApi } from '../services/api';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const Challenge2: React.FC = () => {
  const [isSeeded, setIsSeeded] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkSeededStatus();
  }, []);

  const checkSeededStatus = async () => {
    try {
      // Try to fetch root nodes to check if seeded
      const response = await treeApi.getRootNodes();
      setIsSeeded(response.items.length > 0);
    } catch (err) {
      console.log('Tree not seeded yet');
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    setError(null);
    
    try {
      await treeApi.seedTree(20, 10);
      setIsSeeded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to seed tree');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Challenge 2: Tree & Hierarchy Rendering</h1>
          <p className="mt-2 text-lg text-gray-600">
            Interactive tree structure with lazy loading, search, and auto-expansion
          </p>
        </div>

        {/* Seed Status */}
        <div className="mb-6">
          {!isSeeded ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-500 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Tree not seeded</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Click the button below to generate a tree structure (20^10 nodes, capped at 10,000)
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleSeed}
                  disabled={seeding}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {seeding ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Generating Tree...
                    </>
                  ) : (
                    'Generate Tree'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">Tree generated successfully</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Ready to explore the interactive tree structure
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900">Lazy Loading</h3>
            <p className="text-sm text-gray-600 mt-1">Children loaded on-demand when expanding nodes</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900">Smart Search</h3>
            <p className="text-sm text-gray-600 mt-1">Search with auto-expansion of matching paths</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900">Highlighting</h3>
            <p className="text-sm text-gray-600 mt-1">Search terms highlighted in node names</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900">Performance</h3>
            <p className="text-sm text-gray-600 mt-1">Smooth navigation with 10k+ nodes</p>
          </div>
        </div>

        {/* Tree View */}
        {isSeeded && (
          <TreeView height={600} />
        )}
      </div>
    </div>
  );
};

export default Challenge2;
