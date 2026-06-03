"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Loader2, GraduationCap, CheckCircle, Target, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function PredictorPage() {
  const [form, setForm] = useState({ examName: 'JEE Main', category: 'General', rank: '' });
  const [results, setResults] = useState<any[] | null /* eslint-disable-line @typescript-eslint/no-explicit-any */>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.rank) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams({
        examName: form.examName,
        category: form.category,
        rank: form.rank
      });
      
      const res = await fetch(`/api/predictor?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch predictions');
      
      const data = await res.json();
      setResults(data.data);
    } catch {
      setError('An error occurred while generating predictions.');
    } finally {
      setIsLoading(false);
    }
  };

  const getProbabilityStyles = (prob: string) => {
    switch(prob) {
      case 'Safe': return 'bg-green-100 text-green-800 border-green-200';
      case 'Reach': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Ambitious': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <GraduationCap className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">College Predictor</h1>
        <p className="text-gray-600">Enter your rank to see which colleges you can get into based on past year cutoffs.</p>
      </div>

      <Card className="mb-10 shadow-md border-0 bg-white/50 backdrop-blur">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
              <Select value={form.examName} onChange={e => setForm({...form, examName: e.target.value})}>
                <option value="JEE Main">JEE Main</option>
                <option value="MHT CET">MHT CET</option>
                <option value="COMEDK">COMEDK</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Rank</label>
              <Input 
                type="number" 
                placeholder="e.g. 15000" 
                required 
                min="1"
                value={form.rank}
                onChange={e => setForm({...form, rank: e.target.value})}
              />
            </div>
            <div>
              <Button type="submit" className="w-full h-[42px]" disabled={isLoading || !form.rank}>
                {isLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Predict Colleges'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {error && <p className="text-red-500 text-center mb-6">{error}</p>}

      {results && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Chances ({results.length} colleges found)</h2>
          
          {results.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No colleges found in this rank range. Try adjusting your rank or category.
              </CardContent>
            </Card>
          ) : (
            results.map((result: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, idx: number) => (
              <Card key={idx} className="hover:border-blue-200 transition-colors">
                <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <Link href={`/colleges/${result.college.id}`} className="hover:text-blue-600">
                      <h3 className="text-lg font-bold text-gray-900">{result.college.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-500">{result.college.location}</p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Closing Rank ({result.cutoff.year})</p>
                      <p className="font-bold text-gray-900">{result.cutoff.closingRank}</p>
                    </div>
                    
                    <div className={`px-4 py-2 rounded-full border text-sm font-bold w-28 text-center flex items-center justify-center gap-1 ${getProbabilityStyles(result.probability)}`}>
                      {result.probability === 'Safe' && <CheckCircle size={14} />}
                      {result.probability === 'Reach' && <Target size={14} />}
                      {result.probability === 'Ambitious' && <AlertTriangle size={14} />}
                      {result.probability}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
