import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Quote } from '../types';
import { useWebSocket } from '../hooks/useWebSocket';
import { quoteApi } from '../services/api';
import { Wifi, WifiOff, TrendingUp, TrendingDown, Loader2, AlertCircle } from 'lucide-react';

interface RealtimeDashboardProps {
  height?: number;
}

interface ChartDataPoint {
  timestamp: string;
  [symbol: string]: string | number;
}

const RealtimeDashboard: React.FC<RealtimeDashboardProps> = ({ height = 600 }) => {
  const [symbols, setSymbols] = useState<string[]>(['AAPL', 'MSFT', 'GOOG']);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [maxDataPoints] = useState(50);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { quotes, getQuote, isConnected } = useWebSocket(symbols);

  // Initialize with snapshot data
  useEffect(() => {
    const initializeData = async () => {
      try {
        const snapshot = await quoteApi.getSnapshot(symbols);
        const initialData: ChartDataPoint[] = [];
        
        // Create initial data points for each symbol
        Object.values(snapshot).forEach(quote => {
          const dataPoint: ChartDataPoint = {
            timestamp: new Date(quote.ts).toLocaleTimeString(),
            [quote.symbol]: quote.price
          };
          initialData.push(dataPoint);
        });
        
        setChartData(initialData);
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize data');
      }
    };

    if (!isInitialized) {
      initializeData();
    }
  }, [symbols, isInitialized]);

  // Update chart data when quotes change
  useEffect(() => {
    if (!isInitialized) return;

    setChartData(prevData => {
      const newData = [...prevData];
      
      // Add new data point
      const newDataPoint: ChartDataPoint = {
        timestamp: new Date().toLocaleTimeString(),
      };
      
      symbols.forEach(symbol => {
        const quote = getQuote(symbol);
        if (quote) {
          newDataPoint[symbol] = quote.price;
        } else {
          // Use last known price if no new quote
          const lastDataPoint = prevData[prevData.length - 1];
          newDataPoint[symbol] = lastDataPoint?.[symbol] || 0;
        }
      });
      
      newData.push(newDataPoint);
      
      // Keep only the last maxDataPoints
      return newData.slice(-maxDataPoints);
    });
  }, [quotes, symbols, isInitialized, maxDataPoints, getQuote]);

  const handleSymbolChange = useCallback((index: number, newSymbol: string) => {
    setSymbols(prev => {
      const newSymbols = [...prev];
      newSymbols[index] = newSymbol.toUpperCase();
      return newSymbols;
    });
    setIsInitialized(false);
  }, []);

  const addSymbol = useCallback(() => {
    if (symbols.length < 10) {
      setSymbols(prev => [...prev, '']);
    }
  }, [symbols.length]);

  const removeSymbol = useCallback((index: number) => {
    if (symbols.length > 1) {
      setSymbols(prev => prev.filter((_, i) => i !== index));
    }
  }, [symbols.length]);

  const getPriceChange = useCallback((symbol: string) => {
    if (chartData.length < 2) return 0;
    
    const current = chartData[chartData.length - 1]?.[symbol] as number;
    const previous = chartData[chartData.length - 2]?.[symbol] as number;
    
    if (!current || !previous) return 0;
    
    return ((current - previous) / previous) * 100;
  }, [chartData]);

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 font-medium">Error loading dashboard</p>
          <p className="text-red-500 text-sm">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setIsInitialized(false);
            }}
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
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-gray-900">Real-time Dashboard</h2>
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          <button
            onClick={addSymbol}
            disabled={symbols.length >= 10}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Symbol
          </button>
        </div>
      </div>

      {/* Symbol Controls */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          {symbols.map((symbol, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={symbol}
                onChange={(e) => handleSymbolChange(index, e.target.value)}
                placeholder="Symbol"
                className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {symbols.length > 1 && (
                <button
                  onClick={() => removeSymbol(index)}
                  className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Price Table */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {symbols.map(symbol => {
            const quote = getQuote(symbol);
            const change = getPriceChange(symbol);
            const isPositive = change >= 0;
            
            return (
              <div key={symbol} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{symbol}</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {quote ? formatPrice(quote.price) : 'Loading...'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center space-x-1 ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {formatChange(change)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {quote ? new Date(quote.ts).toLocaleTimeString() : ''}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Chart</h3>
        <div style={{ height: `${height - 200}px` }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip 
                  formatter={(value, name) => [formatPrice(Number(value)), name]}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                {symbols.map((symbol, index) => {
                  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];
                  return (
                    <Line
                      key={symbol}
                      type="monotone"
                      dataKey={symbol}
                      stroke={colors[index % colors.length]}
                      strokeWidth={2}
                      dot={false}
                      connectNulls={false}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
                <p className="text-gray-600">Loading chart data...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealtimeDashboard;
