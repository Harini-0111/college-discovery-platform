"use client";
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Input';
import { Loader2, ArrowRightLeft, Star, IndianRupee, MapPin } from 'lucide-react';
import Link from 'next/link';

type CollegeData = {
  id: string;
  name: string;
  location: string;
  rating: number;
  baseFees: number;
  placements: string | null;
  courses?: { length: number }[];
};

const COMPARISON_ROWS = [
  { key: 'location', label: 'Location', format: (c: CollegeData) => c.location },
  { key: 'rating', label: 'Rating', format: (c: CollegeData) => `${c.rating.toFixed(1)} / 5.0` },
  { key: 'baseFees', label: 'Base Fees', format: (c: CollegeData) => `₹${(c.baseFees / 100000).toFixed(2)} Lakhs / year` },
  { key: 'placements', label: 'Placements', format: (c: CollegeData) => c.placements || '—' },
  { key: 'courses', label: 'Courses Offered', format: (c: CollegeData) => `${c.courses?.length || 0} Courses` },
] as const;

function getBetterValue(key: string, v1: CollegeData | null, v2: CollegeData | null): 1 | 2 | null {
  if (!v1 || !v2) return null;
  if (key === 'rating') return v1.rating > v2.rating ? 1 : v2.rating > v1.rating ? 2 : null;
  if (key === 'baseFees') return v1.baseFees < v2.baseFees ? 1 : v2.baseFees < v1.baseFees ? 2 : null;
  return null;
}

export default function ComparePage() {
  const [collegesList, setCollegesList] = useState<CollegeData[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  const [col1Id, setCol1Id] = useState('');
  const [col2Id, setCol2Id] = useState('');

  const [col1Data, setCol1Data] = useState<CollegeData | null>(null);
  const [col2Data, setCol2Data] = useState<CollegeData | null>(null);
  const [isLoadingCompare, setIsLoadingCompare] = useState(false);

  useEffect(() => {
    fetch('/api/colleges?limit=100')
      .then(res => res.json())
      .then(data => {
        setCollegesList(data.data || []);
        setIsLoadingList(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoadingList(false);
      });
  }, []);

  useEffect(() => {
    const fetchComparison = async () => {
      if (!col1Id && !col2Id) return;

      setIsLoadingCompare(true);
      try {
        const [res1, res2] = await Promise.all([
          col1Id ? fetch(`/api/colleges/${col1Id}`).then(r => r.json()) : Promise.resolve({ data: null }),
          col2Id ? fetch(`/api/colleges/${col2Id}`).then(r => r.json()) : Promise.resolve({ data: null }),
        ]);

        setCol1Data(res1.data);
        setCol2Data(res2.data);
      } catch (error) {
        console.error('Comparison fetch error:', error);
      } finally {
        setIsLoadingCompare(false);
      }
    };

    fetchComparison();
  }, [col1Id, col2Id]);

  const renderValue = (key: string, data: CollegeData | null) => {
    if (!data) return <span className="text-gray-400">—</span>;

    if (key === 'location') {
      return (
        <span className="flex items-center gap-2 text-gray-700">
          <MapPin size={16} className="text-gray-400 flex-shrink-0" />
          {data.location}
        </span>
      );
    }
    if (key === 'rating') {
      return (
        <span className="flex items-center gap-1.5 font-medium text-gray-900">
          <Star size={16} className="text-yellow-500 fill-yellow-500" />
          {data.rating.toFixed(1)} / 5.0
        </span>
      );
    }
    if (key === 'baseFees') {
      return (
        <span className="flex items-center gap-1 font-semibold text-gray-900">
          <IndianRupee size={15} />
          {(data.baseFees / 100000).toFixed(2)} Lakhs / year
        </span>
      );
    }
    if (key === 'courses') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
          {data.courses?.length || 0} Courses
        </span>
      );
    }
    return <span className="text-gray-700 leading-relaxed">{data.placements || '—'}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="text-center mb-10">
          <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <ArrowRightLeft className="text-blue-600" size={28} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            Compare Colleges
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Select two colleges to compare fees, ratings, and placements side by side.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-200">
          <div>
            <label htmlFor="col1" className="block text-sm font-semibold text-gray-700 mb-2">
              College 1
            </label>
            <Select
              id="col1"
              value={col1Id}
              onChange={e => setCol1Id(e.target.value)}
              disabled={isLoadingList}
            >
              <option value="">Select first college</option>
              {collegesList.map(c => (
                <option key={c.id} value={c.id} disabled={c.id === col2Id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="col2" className="block text-sm font-semibold text-gray-700 mb-2">
              College 2
            </label>
            <Select
              id="col2"
              value={col2Id}
              onChange={e => setCol2Id(e.target.value)}
              disabled={isLoadingList}
            >
              <option value="">Select second college</option>
              {collegesList.map(c => (
                <option key={c.id} value={c.id} disabled={c.id === col1Id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {isLoadingCompare ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : (col1Data || col2Data) ? (
          <>
            {/* Desktop table */}
            <Card className="hidden md:block overflow-hidden shadow-sm border border-gray-200 rounded-2xl bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 w-1/4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Feature
                      </th>
                      <th className="px-6 py-4 w-[37.5%] font-bold text-lg text-gray-900 align-top">
                        {col1Data ? (
                          <Link href={`/colleges/${col1Data.id}`} className="hover:text-blue-600 transition-colors line-clamp-2">
                            {col1Data.name}
                          </Link>
                        ) : (
                          <span className="text-gray-400 font-normal text-base">Not selected</span>
                        )}
                      </th>
                      <th className="px-6 py-4 w-[37.5%] font-bold text-lg text-gray-900 align-top border-l border-gray-200">
                        {col2Data ? (
                          <Link href={`/colleges/${col2Data.id}`} className="hover:text-blue-600 transition-colors line-clamp-2">
                            {col2Data.name}
                          </Link>
                        ) : (
                          <span className="text-gray-400 font-normal text-base">Not selected</span>
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_ROWS.map((row, idx) => {
                      const better = getBetterValue(row.key, col1Data, col2Data);
                      return (
                        <tr
                          key={row.key}
                          className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                        >
                          <td className="px-6 py-4 font-semibold text-gray-700">{row.label}</td>
                          <td className={`px-6 py-4 ${better === 1 ? 'bg-emerald-50/60' : ''}`}>
                            {renderValue(row.key, col1Data)}
                          </td>
                          <td className={`px-6 py-4 border-l border-gray-100 ${better === 2 ? 'bg-emerald-50/60' : ''}`}>
                            {renderValue(row.key, col2Data)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {COMPARISON_ROWS.map((row) => {
                const better = getBetterValue(row.key, col1Data, col2Data);
                return (
                  <Card key={row.key} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900 text-sm">{row.label}</h3>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-gray-100">
                      <div className={`p-4 ${better === 1 ? 'bg-emerald-50/60' : ''}`}>
                        <p className="text-xs font-medium text-gray-500 mb-2 line-clamp-2">
                          {col1Data?.name || 'College 1'}
                        </p>
                        <div className="text-sm">{renderValue(row.key, col1Data)}</div>
                      </div>
                      <div className={`p-4 ${better === 2 ? 'bg-emerald-50/60' : ''}`}>
                        <p className="text-xs font-medium text-gray-500 mb-2 line-clamp-2">
                          {col2Data?.name || 'College 2'}
                        </p>
                        <div className="text-sm">{renderValue(row.key, col2Data)}</div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500">Select two colleges above to start comparing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
