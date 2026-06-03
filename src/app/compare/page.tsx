"use client";
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Input';
import { Loader2, ArrowRightLeft, Star, IndianRupee } from 'lucide-react';
import Link from 'next/link';

export default function ComparePage() {
  const [collegesList, setCollegesList] = useState<any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  const [col1Id, setCol1Id] = useState('');
  const [col2Id, setCol2Id] = useState('');

  const [col1Data, setCol1Data] = useState<any /* eslint-disable-line @typescript-eslint/no-explicit-any */>(null);
  const [col2Data, setCol2Data] = useState<any /* eslint-disable-line @typescript-eslint/no-explicit-any */>(null);
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
          col2Id ? fetch(`/api/colleges/${col2Id}`).then(r => r.json()) : Promise.resolve({ data: null })
        ]);

        setCol1Data(res1.data);
        setCol2Data(res2.data);
      } catch (error) {
        console.error("Comparison fetch error:", error);
      } finally {
        setIsLoadingCompare(false);
      }
    };

    fetchComparison();
  }, [col1Id, col2Id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <ArrowRightLeft className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Compare Colleges</h1>
        <p className="text-gray-600">Select two colleges to compare their fees, ratings, and placements side-by-side.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">College 1</label>
          <Select 
            value={col1Id} 
            onChange={e => setCol1Id(e.target.value)} 
            disabled={isLoadingList}
            className="text-sm"
          >
            <option value="">-- Select College --</option>
            {collegesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">College 2</label>
          <Select 
            value={col2Id} 
            onChange={e => setCol2Id(e.target.value)} 
            disabled={isLoadingList}
            className="text-sm"
          >
            <option value="">-- Select College --</option>
            {collegesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>
      </div>

      {isLoadingCompare ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={48} /></div>
      ) : (col1Data || col2Data) ? (
        <Card className="overflow-hidden shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm md:text-base">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 md:p-6 w-1/3 text-gray-500 font-medium">Feature</th>
                  <th className="p-4 md:p-6 w-1/3 font-bold text-lg text-gray-900 border-l border-gray-200">
                    {col1Data ? <Link href={`/colleges/${col1Data.id}`} className="hover:text-blue-600 hover:underline">{col1Data.name}</Link> : 'Not Selected'}
                  </th>
                  <th className="p-4 md:p-6 w-1/3 font-bold text-lg text-gray-900 border-l border-gray-200">
                    {col2Data ? <Link href={`/colleges/${col2Data.id}`} className="hover:text-blue-600 hover:underline">{col2Data.name}</Link> : 'Not Selected'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-4 md:p-6 font-medium text-gray-700">Location</td>
                  <td className="p-4 md:p-6 border-l border-gray-200">{col1Data?.location || '-'}</td>
                  <td className="p-4 md:p-6 border-l border-gray-200">{col2Data?.location || '-'}</td>
                </tr>
                <tr>
                  <td className="p-4 md:p-6 font-medium text-gray-700">Rating</td>
                  <td className="p-4 md:p-6 border-l border-gray-200">
                    {col1Data && <span className="flex items-center gap-1"><Star size={16} className="text-yellow-500 fill-yellow-500"/> {col1Data.rating.toFixed(1)}</span>}
                  </td>
                  <td className="p-4 md:p-6 border-l border-gray-200">
                    {col2Data && <span className="flex items-center gap-1"><Star size={16} className="text-yellow-500 fill-yellow-500"/> {col2Data.rating.toFixed(1)}</span>}
                  </td>
                </tr>
                <tr>
                  <td className="p-4 md:p-6 font-medium text-gray-700">Base Fees</td>
                  <td className="p-4 md:p-6 border-l border-gray-200">
                    {col1Data && <span className="flex items-center gap-1"><IndianRupee size={16}/> {(col1Data.baseFees / 100000).toFixed(2)} Lakhs</span>}
                  </td>
                  <td className="p-4 md:p-6 border-l border-gray-200">
                    {col2Data && <span className="flex items-center gap-1"><IndianRupee size={16}/> {(col2Data.baseFees / 100000).toFixed(2)} Lakhs</span>}
                  </td>
                </tr>
                <tr>
                  <td className="p-4 md:p-6 font-medium text-gray-700">Placements</td>
                  <td className="p-4 md:p-6 border-l border-gray-200">{col1Data?.placements || '-'}</td>
                  <td className="p-4 md:p-6 border-l border-gray-200">{col2Data?.placements || '-'}</td>
                </tr>
                <tr>
                  <td className="p-4 md:p-6 font-medium text-gray-700">Courses Offered</td>
                  <td className="p-4 md:p-6 border-l border-gray-200">{col1Data?.courses?.length || 0} courses</td>
                  <td className="p-4 md:p-6 border-l border-gray-200">{col2Data?.courses?.length || 0} courses</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
