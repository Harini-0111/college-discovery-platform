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

  const getProbabilityIcon = (prob: string) => {
    switch(prob) {
      case 'Safe': return '🟢';
      case 'Reach': return '🟡';
      case 'Ambitious': return '🔴';
      default: return '⚪';
    }
  };

  const safeColleges = results?.filter(r => r.probability === 'Safe') || [];
  const reachColleges = results?.filter(r => r.probability === 'Reach') || [];
  const ambitiousColleges = results?.filter(r => r.probability === 'Ambitious') || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
              <GraduationCap size={32} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">College Admission Predictor</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Get personalized college recommendations based on your exam rank and category
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Input Card */}
        <Card className="mb-8 shadow-xl border-0 -mt-16 relative z-10">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Enter Your Details
            </h2>
            
            <form onSubmit={handlePredict} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="exam" className="block text-sm font-bold text-gray-700 mb-2">Entrance Exam</label>
                  <Select 
                    id="exam" 
                    value={form.examName} 
                    onChange={e => setForm({...form, examName: e.target.value})}
                    className="h-12 text-base"
                  >
                    <option value="JEE Main">JEE Main</option>
                    <option value="MHT CET">MHT CET</option>
                    <option value="COMEDK">COMEDK</option>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <Select 
                    id="category" 
                    value={form.category} 
                    onChange={e => setForm({...form, category: e.target.value})}
                    className="h-12 text-base"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="rank" className="block text-sm font-bold text-gray-700 mb-2">Your Rank</label>
                  <Input 
                    id="rank"
                    type="number" 
                    placeholder="e.g. 15000" 
                    required 
                    min="1"
                    value={form.rank}
                    onChange={e => setForm({...form, rank: e.target.value})}
                    className="h-12 text-base"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                disabled={isLoading || !form.rank}
              >
                {isLoading ? (
                  <><Loader2 className="animate-spin mr-2" size={24} /> Analyzing...</>
                ) : (
                  <>🎓 Predict My Colleges</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Card className="mb-8 bg-red-50 border-red-200">
            <CardContent className="p-6 text-center text-red-700 font-medium">
              {error}
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {results && (
          <div className="space-y-8">
            {/* Summary Stats */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-green-600">{safeColleges.length}</div>
                    <div className="text-sm text-gray-600 font-medium">Safe Options</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-yellow-600">{reachColleges.length}</div>
                    <div className="text-sm text-gray-600 font-medium">Reach Options</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-red-600">{ambitiousColleges.length}</div>
                    <div className="text-sm text-gray-600 font-medium">Ambitious Options</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-blue-50 border-l-4 border-l-blue-600">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  💡 How to Read Your Results
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong className="text-green-700">🟢 Safe:</strong> High chance of admission based on past cutoffs</p>
                  <p><strong className="text-yellow-700">🟡 Reach:</strong> Competitive but possible with your rank</p>
                  <p><strong className="text-red-700">🔴 Ambitious:</strong> Challenging but worth trying</p>
                </div>
              </CardContent>
            </Card>

            {results.length === 0 ? (
              <Card className="border-gray-200 shadow-sm bg-white">
                <CardContent className="py-16 flex flex-col items-center text-center">
                  <AlertTriangle className="text-yellow-500 mb-4" size={64} />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Matches Found</h3>
                  <p className="text-gray-600 max-w-md mb-6">
                    We couldn't find colleges matching your criteria. Try adjusting your rank or category.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Safe Colleges */}
                {safeColleges.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      🟢 Safe Colleges
                      <span className="text-sm font-normal text-gray-500">({safeColleges.length})</span>
                    </h2>
                    <div className="space-y-3">
                      {safeColleges.map((result: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, idx: number) => (
                        <Card key={idx} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div className="flex-1">
                                <Link href={`/colleges/${result.college.id}`} className="hover:text-blue-600 transition-colors">
                                  <h3 className="text-lg font-bold text-gray-900 mb-1">{result.college.name}</h3>
                                </Link>
                                <p className="text-sm text-gray-600">{result.college.location}</p>
                              </div>
                              
                              <div className="flex items-center gap-6">
                                <div className="text-center bg-gray-50 px-4 py-2 rounded-xl">
                                  <p className="text-xs text-gray-500 mb-1">Closing Rank</p>
                                  <p className="font-bold text-lg text-gray-900">{result.cutoff.closingRank.toLocaleString()}</p>
                                  <p className="text-xs text-gray-500">{result.cutoff.year}</p>
                                </div>
                                
                                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl border-2 border-green-200 font-bold text-sm min-w-[100px] text-center">
                                  🟢 Safe
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reach Colleges */}
                {reachColleges.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      🟡 Reach Colleges
                      <span className="text-sm font-normal text-gray-500">({reachColleges.length})</span>
                    </h2>
                    <div className="space-y-3">
                      {reachColleges.map((result: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, idx: number) => (
                        <Card key={idx} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-500">
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div className="flex-1">
                                <Link href={`/colleges/${result.college.id}`} className="hover:text-blue-600 transition-colors">
                                  <h3 className="text-lg font-bold text-gray-900 mb-1">{result.college.name}</h3>
                                </Link>
                                <p className="text-sm text-gray-600">{result.college.location}</p>
                              </div>
                              
                              <div className="flex items-center gap-6">
                                <div className="text-center bg-gray-50 px-4 py-2 rounded-xl">
                                  <p className="text-xs text-gray-500 mb-1">Closing Rank</p>
                                  <p className="font-bold text-lg text-gray-900">{result.cutoff.closingRank.toLocaleString()}</p>
                                  <p className="text-xs text-gray-500">{result.cutoff.year}</p>
                                </div>
                                
                                <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-xl border-2 border-yellow-200 font-bold text-sm min-w-[100px] text-center">
                                  🟡 Reach
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ambitious Colleges */}
                {ambitiousColleges.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      🔴 Ambitious Colleges
                      <span className="text-sm font-normal text-gray-500">({ambitiousColleges.length})</span>
                    </h2>
                    <div className="space-y-3">
                      {ambitiousColleges.map((result: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, idx: number) => (
                        <Card key={idx} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-500">
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div className="flex-1">
                                <Link href={`/colleges/${result.college.id}`} className="hover:text-blue-600 transition-colors">
                                  <h3 className="text-lg font-bold text-gray-900 mb-1">{result.college.name}</h3>
                                </Link>
                                <p className="text-sm text-gray-600">{result.college.location}</p>
                              </div>
                              
                              <div className="flex items-center gap-6">
                                <div className="text-center bg-gray-50 px-4 py-2 rounded-xl">
                                  <p className="text-xs text-gray-500 mb-1">Closing Rank</p>
                                  <p className="font-bold text-lg text-gray-900">{result.cutoff.closingRank.toLocaleString()}</p>
                                  <p className="text-xs text-gray-500">{result.cutoff.year}</p>
                                </div>
                                
                                <div className="bg-red-100 text-red-800 px-4 py-2 rounded-xl border-2 border-red-200 font-bold text-sm min-w-[100px] text-center">
                                  🔴 Ambitious
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
