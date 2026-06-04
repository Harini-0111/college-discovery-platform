"use client";
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Input';
import { Loader2, ArrowRightLeft, Star, IndianRupee, MapPin } from 'lucide-react';
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
      <div className="text-center mb-12">
        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <ArrowRightLeft className="text-blue-600" size={32} />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Compare Colleges</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Select two colleges to compare their fees, ratings, and placements side-by-side to make an informed decision.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <label htmlFor="col1" className="block text-sm font-semibold text-gray-700 mb-2">College 1</label>
          <Select 
            id="col1"
            value={col1Id} 
            onChange={e => setCol1Id(e.target.value)} 
            disabled={isLoadingList}
            className="text-base"
          >
            <option value="">-- Select First College --</option>
            {collegesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>
        <div>
          <label htmlFor="col2" className="block text-sm font-semibold text-gray-700 mb-2">College 2</label>
          <Select 
            id="col2"
            value={col2Id} 
            onChange={e => setCol2Id(e.target.value)} 
            disabled={isLoadingList}
            className="text-base"
          >
            <option value="">-- Select Second College --</option>
            {collegesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>
      </div>

      {isLoadingCompare ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={48} /></div>
      ) : (col1Data || col2Data) ? (
        <Card className="overflow-hidden shadow-sm border border-gray-100 rounded-2xl bg-white">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-base min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-6 w-1/4 text-gray-500 font-semibold sticky left-0 bg-gray-50 z-10 border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Feature</th>
                  <th className="p-6 w-3/8 font-bold text-xl text-gray-900 align-top">
                    {col1Data ? <Link href={`/colleges/${col1Data.id}`} className="hover:text-blue-600 transition-colors">{col1Data.name}</Link> : <span className="text-gray-400 font-medium text-base italic">Not Selected</span>}
                  </th>
                  <th className="p-6 w-3/8 font-bold text-xl text-gray-900 align-top border-l border-gray-200">
                    {col2Data ? <Link href={`/colleges/${col2Data.id}`} className="hover:text-blue-600 transition-colors">{col2Data.name}</Link> : <span className="text-gray-400 font-medium text-base italic">Not Selected</span>}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 font-semibold text-gray-700 sticky left-0 bg-white z-10 border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Location</td>
                  <td className="p-6 text-gray-600">
                    {col1Data ? <span className="flex items-center gap-2"><MapPin size={18} className="text-gray-400"/> {col1Data.location}</span> : '-'}
                  </td>
                  <td className="p-6 text-gray-600 border-l border-gray-200">
                    {col2Data ? <span className="flex items-center gap-2"><MapPin size={18} className="text-gray-400"/> {col2Data.location}</span> : '-'}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 font-semibold text-gray-700 sticky left-0 bg-white z-10 border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Rating</td>
                  <td className="p-6">
                    {col1Data ? <span className="flex items-center gap-1.5 font-medium text-gray-900"><Star size={18} className="text-yellow-500 fill-yellow-500"/> {col1Data.rating.toFixed(1)} / 5.0</span> : '-'}
                  </td>
                  <td className="p-6 border-l border-gray-200">
                    {col2Data ? <span className="flex items-center gap-1.5 font-medium text-gray-900"><Star size={18} className="text-yellow-500 fill-yellow-500"/> {col2Data.rating.toFixed(1)} / 5.0</span> : '-'}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 font-semibold text-gray-700 sticky left-0 bg-white z-10 border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Base Fees</td>
                  <td className="p-6">
                    {col1Data ? <span className="flex items-center gap-1 font-semibold text-gray-900"><IndianRupee size={16}/> {(col1Data.baseFees / 100000).toFixed(2)} Lakhs / year</span> : '-'}
                  </td>
                  <td className="p-6 border-l border-gray-200">
                    {col2Data ? <span className="flex items-center gap-1 font-semibold text-gray-900"><IndianRupee size={16}/> {(col2Data.baseFees / 100000).toFixed(2)} Lakhs / year</span> : '-'}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 font-semibold text-gray-700 sticky left-0 bg-white z-10 border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Placements</td>
                  <td className="p-6 text-gray-600 leading-relaxed">{col1Data?.placements || '-'}</td>
                  <td className="p-6 text-gray-600 leading-relaxed border-l border-gray-200">{col2Data?.placements || '-'}</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 font-semibold text-gray-700 sticky left-0 bg-white z-10 border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Courses Offered</td>
                  <td className="p-6 text-gray-600">
                    {col1Data ? <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm font-medium">{col1Data.courses?.length || 0} Courses</span> : '-'}
                  </td>
                  <td className="p-6 text-gray-600 border-l border-gray-200">
                    {col2Data ? <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm font-medium">{col2Data.courses?.length || 0} Courses</span> : '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
