"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CollegeCard } from '@/components/features/CollegeCard';
import { Search, Filter, Loader2 } from 'lucide-react';

export default function CollegesPage() {
  const [colleges, setColleges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    q: '',
    location: '',
    minRating: '',
    maxFee: ''
  });

  const fetchColleges = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.q) params.append('q', filters.q);
      if (filters.location) params.append('location', filters.location);
      if (filters.minRating) params.append('minRating', filters.minRating);
      if (filters.maxFee) params.append('maxFee', filters.maxFee);
      
      const res = await fetch(`/api/colleges/search?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      
      setColleges(data.data || []);
      setTotal(data.meta?.total || 0);
    } catch {
      console.error(error);
      setColleges([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // Debounce the fetch slightly for better UX on typing
    const timeout = setTimeout(() => fetchColleges(), 300);
    return () => clearTimeout(timeout);
  }, [fetchColleges]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Filter size={20} />
            Filters
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Name</label>
              <Input 
                placeholder="e.g. Institute of Technology..." 
                value={filters.q}
                onChange={(e) => handleFilterChange('q', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <Input 
                placeholder="e.g. Mumbai, Delhi..." 
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
              <Select 
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Fees (INR)</label>
              <Select 
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
              className="w-full mt-4"
              onClick={() => setFilters({ q: '', location: '', minRating: '', maxFee: '' })}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Explore Colleges</h1>
          <span className="text-gray-500">{total} results found</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
            <Search className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No colleges found</h3>
            <p className="text-gray-500">Try adjusting your filters to find what you&apos;re looking for.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
