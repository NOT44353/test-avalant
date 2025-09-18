import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { dataApi } from '../services/api';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const Challenge1: React.FC = () => {
  const [isSeeded, setIsSeeded] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkSeededStatus();
  }, []);

  const checkSeededStatus = async () => {
    try {
      // Try to fetch a small amount of data to check if seeded
      const response = await dataApi.getUsers({
        page: 1,
        pageSize: 1,
        sortBy: 'name',
        sortDir: 'asc'
      });
      setIsSeeded(response.total > 0);
    } catch (err) {
      console.log('Data not seeded yet');
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    setError(null);
    
    try {
      await dataApi.seedData(50000, 500000, 10000);
      setIsSeeded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to seed data');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Challenge 1: Data Processing & Rendering</h1>
          <p className="mt-2 text-lg text-gray-600">
            High-performance data table with 50,000+ records, server-side pagination, sorting, and filtering
          </p>
        </div>

        {/* Seed Status */}
        <div className="mb-6">
          {!isSeeded ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-500 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Database not seeded</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Click the button below to seed the database with sample data (50,000 users, 500,000 orders, 10,000 products)
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
                      Seeding...
                    </>
                  ) : (
                    'Seed Database'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">Database seeded successfully</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Ready to explore the data table with 50,000+ records
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
            <h3 className="font-semibold text-gray-900">Server-side Pagination</h3>
            <p className="text-sm text-gray-600 mt-1">Efficient pagination with configurable page sizes</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900">Real-time Search</h3>
            <p className="text-sm text-gray-600 mt-1">Debounced search across name and email fields</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900">Multi-column Sorting</h3>
            <p className="text-sm text-gray-600 mt-1">Sort by name, email, date, or order total</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900">Virtual Scrolling</h3>
            <p className="text-sm text-gray-600 mt-1">Smooth scrolling with react-window for performance</p>
          </div>
        </div>

        {/* Data Table */}
        {isSeeded && (
          <DataTable height={600} itemHeight={50} />
        )}
      </div>
    </div>
  );
};

export default Challenge1;
