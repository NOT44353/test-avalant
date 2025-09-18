import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Node, SearchResult } from '../types';
import { treeApi } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { Search, ChevronRight, ChevronDown, Loader2, AlertCircle } from 'lucide-react';

interface TreeViewProps {
  height?: number;
}

const TreeView: React.FC<TreeViewProps> = ({ height = 600 }) => {
  const [nodes, setNodes] = useState<Map<string, Node>>(new Map());
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [childrenMap, setChildrenMap] = useState<Map<string, string[]>>(new Map());
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingNodes, setLoadingNodes] = useState<Set<string>>(new Set());

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Load root nodes on mount
  useEffect(() => {
    loadRootNodes();
  }, []);

  // Handle search
  useEffect(() => {
    if (debouncedSearchTerm) {
      performSearch(debouncedSearchTerm);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]);

  const loadRootNodes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await treeApi.getRootNodes();
      const rootNodes = response.items;
      
      const newNodes = new Map(nodes);
      rootNodes.forEach(node => {
        newNodes.set(node.id, node);
      });
      
      setNodes(newNodes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load root nodes');
    } finally {
      setLoading(false);
    }
  };

  const loadNodeChildren = async (nodeId: string) => {
    if (loadingNodes.has(nodeId)) return;
    
    setLoadingNodes(prev => new Set(prev).add(nodeId));
    
    try {
      const response = await treeApi.getNodeChildren(nodeId);
      const children = response.items;
      
      const newNodes = new Map(nodes);
      const newChildrenMap = new Map(childrenMap);
      
      children.forEach(child => {
        newNodes.set(child.id, child);
      });
      
      newChildrenMap.set(nodeId, children.map(child => child.id));
      
      setNodes(newNodes);
      setChildrenMap(newChildrenMap);
    } catch (err) {
      console.error('Failed to load children:', err);
    } finally {
      setLoadingNodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(nodeId);
        return newSet;
      });
    }
  };

  const performSearch = async (query: string) => {
    try {
      const response = await treeApi.searchNodes(query, 100);
      setSearchResults(response.items);
      
      // Auto-expand paths for search results
      const nodesToExpand = new Set<string>();
      response.items.forEach(result => {
        result.path.forEach(node => {
          if (node.id !== result.id) {
            nodesToExpand.add(node.id);
          }
        });
      });
      
      setExpandedNodes(prev => new Set([...prev, ...nodesToExpand]));
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const toggleNode = useCallback((nodeId: string) => {
    const node = nodes.get(nodeId);
    if (!node) return;

    if (expandedNodes.has(nodeId)) {
      // Collapse
      setExpandedNodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(nodeId);
        return newSet;
      });
    } else {
      // Expand
      setExpandedNodes(prev => new Set(prev).add(nodeId));
      
      // Load children if not already loaded
      if (node.hasChildren && !childrenMap.has(nodeId)) {
        loadNodeChildren(nodeId);
      }
    }
  }, [nodes, expandedNodes, childrenMap]);

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const renderNode = (nodeId: string, level: number = 0) => {
    const node = nodes.get(nodeId);
    if (!node) return null;

    const isExpanded = expandedNodes.has(nodeId);
    const hasChildren = node.hasChildren;
    const isLoading = loadingNodes.has(nodeId);
    const isSearchResult = searchResults.some(result => result.id === nodeId);

    return (
      <div key={nodeId} className="select-none">
        <div
          className={`flex items-center py-1 px-2 hover:bg-gray-50 cursor-pointer ${
            isSearchResult ? 'bg-yellow-50 border-l-2 border-yellow-400' : ''
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => toggleNode(nodeId)}
        >
          <div className="flex items-center space-x-1">
            {hasChildren ? (
              isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              ) : isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )
            ) : (
              <div className="w-4 h-4" />
            )}
            <span className="text-sm text-gray-900">
              {highlightText(node.name, searchTerm)}
            </span>
          </div>
        </div>
        
        {isExpanded && hasChildren && (
          <div>
            {childrenMap.get(nodeId)?.map(childId => renderNode(childId, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const getRootNodeIds = () => {
    return Array.from(nodes.values())
      .filter(node => node.parentId === null)
      .map(node => node.id);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 font-medium">Error loading tree</p>
          <p className="text-red-500 text-sm">{error}</p>
          <button 
            onClick={loadRootNodes}
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
          <h2 className="text-lg font-semibold text-gray-900">Tree Hierarchy</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Tree Content */}
      <div 
        className="overflow-auto"
        style={{ height: `${height}px` }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading tree...</span>
          </div>
        ) : (
          <div className="py-2">
            {getRootNodeIds().map(nodeId => renderNode(nodeId))}
          </div>
        )}
      </div>

      {/* Search Results Summary */}
      {searchResults.length > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-200">
          <p className="text-sm text-blue-700">
            Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchTerm}"
          </p>
        </div>
      )}
    </div>
  );
};

export default TreeView;
