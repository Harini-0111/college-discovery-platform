"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CollegeCard } from '@/components/features/CollegeCard';
import { CollegeCardSkeleton } from '@/components/features/CollegeCardSkeleton';
import { Filter, AlertCircle, Loader2, WifiOff } from 'lucide-react';

export default function CollegesPage() {
  const [colleges, setColleges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    q: '',
    location: '',
    minRating: '',
    maxFee: ''
  });

  const fetchColleges = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (filters.q) params.append('q', filters.q);
      if (filters.location) params.append('location', filters.location);
      if (filters.minRating) params.append('minRating', filters.minRating);
      if (filters.maxFee) params.append('maxFee', filters.maxFee);
      
      const res = await fetch(`/api/colleges/search?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch colleges');
      const data = await res.json();
      
      setColleges(data.data || []);
      setTotal(data.meta?.total || 0);
    } catch {
      setColleges([]);
      setTotal(0);
      setError('Unable to load colleges right now. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timeout = setTimeout(() => fetchColleges(), 300);
    return () => clearTimeout(timeout);
  }, [fetchColleges]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ q: '', location: '', minRating: '', maxFee: '' });
  };

  const renderResultsBadge = () => {
    if (isLoading) {
      return (
        <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
          <Loader2 size={14} className="animate-spin" />
          Loading colleges...
        </span>
      );
    }

    if (error) {
      return (
        <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
          Failed to load
        </span>
      );
    }

    return (
      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
        {total} results found
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row gap-10">
      
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-72 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
            <Filter size={20} className="text-blue-600" />
            Filters
          </h2>
          
          <div className="space-y-5">
            <div>
              <label htmlFor="filter-q" className="block text-sm font-semibold text-gray-700 mb-1.5">Search Name</label>
              <Input 
                id="filter-q"
                placeholder="e.g. Institute of Technology..." 
                value={filters.q}
                onChange={(e) => handleFilterChange('q', e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="filter-location" className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
              <Input 
                id="filter-location"
                placeholder="e.g. Mumbai, Delhi..." 
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="filter-rating" className="block text-sm font-semibold text-gray-700 mb-1.5">Min Rating</label>
              <Select 
                id="filter-rating"
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5 & Above</option>
                <option value="4.0">4.0 & Above</option>
                <option value="3.5">3.5 & Above</option>
              </Select>
            </div>
            
            <div>
              <label htmlFor="filter-fee" className="block text-sm font-semibold text-gray-700 mb-1.5">Max Fees (INR)</label>
              <Select 
                id="filter-fee"
                value={filters.maxFee}
                onChange={(e) => handleFilterChange('maxFee', e.target.value)}
              >
                <option value="">Any Fee</option>
                <option value="150000">Up to 1.5 Lakhs</option>
                <option value="250000">Up to 2.5 Lakhs</option>
                <option value="500000">Up to 5 Lakhs</option>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-6"
              onClick={handleClearFilters}
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Explore Colleges</h1>
          {renderResultsBadge()}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <CollegeCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 bg-red-50 rounded-2xl border border-red-200 shadow-sm text-center px-4">
            <div className="bg-white p-4 rounded-full mb-4">
              <WifiOff className="text-red-500" size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Couldn&apos;t load colleges</h3>
            <p className="text-gray-600 mb-6 max-w-md">{error}</p>
            <Button variant="primary" onClick={fetchColleges}>
              Try Again
            </Button>
          </div>
        ) : colleges.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm text-center px-4">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <AlertCircle className="text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No colleges found</h3>
            <p className="text-gray-500 mb-6 max-w-md">
              We couldn&apos;t find any colleges matching your current filters. Try adjusting your search criteria.
            </p>
            <Button variant="primary" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {colleges.map((college: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        )}
      </div>

    </div>
    </div>
  );
}
