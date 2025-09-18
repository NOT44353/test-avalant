import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { UserRow, UserQuery, UserResponse } from '../types';
import { dataApi } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { Search, ChevronUp, ChevronDown, Loader2, AlertCircle } from 'lucide-react';

interface DataTableProps {
  height?: number;
  itemHeight?: number;
}

const DataTable: React.FC<DataTableProps> = ({ 
  height = 600, 
  itemHeight = 50 
}) => {
  const [data, setData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<UserQuery['sortBy']>('name');
  const [sortDir, setSortDir] = useState<UserQuery['sortDir']>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const debouncedSearchTerm = useDebounce(searchTerm, 250);

  const query: UserQuery = useMemo(() => ({
    page,
    pageSize,
    search: debouncedSearchTerm || undefined,
    sortBy,
    sortDir
  }), [page, pageSize, debouncedSearchTerm, sortBy, sortDir]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await dataApi.getUsers(query);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSort = useCallback((column: UserQuery['sortBy']) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
    setPage(1);
  }, [sortBy, sortDir]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  }, []);

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0;

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    if (!data || !data.items[index]) return null;
    
    const user = data.items[index];
    
    return (
      <div style={style} className="flex items-center border-b border-gray-200 hover:bg-gray-50">
        <div className="flex-1 px-4 py-3 text-sm text-gray-900">{user.name}</div>
        <div className="flex-1 px-4 py-3 text-sm text-gray-600">{user.email}</div>
        <div className="flex-1 px-4 py-3 text-sm text-gray-600">
          {new Date(user.createdAt).toLocaleDateString()}
        </div>
        <div className="flex-1 px-4 py-3 text-sm text-gray-600">{user.orderCount}</div>
        <div className="flex-1 px-4 py-3 text-sm font-medium text-green-600">
          ${user.orderTotal.toLocaleString()}
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 font-medium">Error loading data</p>
          <p className="text-red-500 text-sm">{error}</p>
          <button 
            onClick={fetchData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Users Data Table</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
              <option value={200}>200 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="flex items-center bg-gray-50 border-b border-gray-200">
        <div className="flex-1 px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <button
            onClick={() => handleSort('name')}
            className="flex items-center space-x-1 hover:text-gray-700"
          >
            <span>Name</span>
            {sortBy === 'name' && (
              sortDir === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="flex-1 px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <button
            onClick={() => handleSort('email')}
            className="flex items-center space-x-1 hover:text-gray-700"
          >
            <span>Email</span>
            {sortBy === 'email' && (
              sortDir === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="flex-1 px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <button
            onClick={() => handleSort('createdAt')}
            className="flex items-center space-x-1 hover:text-gray-700"
          >
            <span>Created</span>
            {sortBy === 'createdAt' && (
              sortDir === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="flex-1 px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <button
            onClick={() => handleSort('orderTotal')}
            className="flex items-center space-x-1 hover:text-gray-700"
          >
            <span>Orders</span>
            {sortBy === 'orderTotal' && (
              sortDir === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="flex-1 px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
          Total Amount
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}

      {/* Virtualized Table Body */}
      {!loading && data && (
        <List
          height={height}
          itemCount={data.items.length}
          itemSize={itemHeight}
          className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          {Row}
        </List>
      )}

      {/* Empty State */}
      {!loading && data && data.items.length === 0 && (
        <div className="flex items-center justify-center h-32 text-gray-500">
          No users found
        </div>
      )}

      {/* Pagination */}
      {!loading && data && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((data.page - 1) * data.pageSize) + 1} to {Math.min(data.page * data.pageSize, data.total)} of {data.total} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
