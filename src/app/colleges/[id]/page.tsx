"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { MapPin, Star, IndianRupee, BookOpen, Trophy, Loader2 } from 'lucide-react';
import { CollegeImage } from '@/components/features/CollegeImage';

export default function CollegeDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [college, setCollege] = useState<any /* eslint-disable-line @typescript-eslint/no-explicit-any */>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    const fetchCollege = async () => {
      try {
        const res = await fetch(`/api/colleges/${id}`);
        if (!res.ok) throw new Error('College not found');
        const data = await res.json();
        setCollege(data.data);
      } catch {
        setError('Failed to load college details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollege();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="text-center py-32">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
        <p className="text-gray-500">{error || 'College not found.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative text-white overflow-hidden min-h-[280px] sm:min-h-[320px]">
        <CollegeImage
          slug={college.slug}
          name={college.name}
          alt={`${college.name} campus`}
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-gray-900/30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold border border-white/30">
                  <Star size={16} className="fill-yellow-300 text-yellow-300" />
                  {college.rating.toFixed(1)}
                </span>
                {college.placements && (
                  <span className="inline-flex items-center bg-emerald-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold">
                    ⭐ Top Placements
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight">
                {college.name}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <MapPin size={18} />
                  {college.location}
                </span>
                {college.establishedYear && (
                  <span className="flex items-center gap-1.5">
                    Est. {college.establishedYear}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">₹{(college.baseFees / 100000).toFixed(2)}L</div>
              <div className="text-xs text-gray-600">Annual Fees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{college.courses?.length || 0}</div>
              <div className="text-xs text-gray-600">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{college.cutoffs?.length || 0}</div>
              <div className="text-xs text-gray-600">Cutoff Data</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{college.rating.toFixed(1)}/5</div>
              <div className="text-xs text-gray-600">Rating</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* About Section */}
        {college.description && (
          <Card className="border-l-4 border-l-blue-600">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
              <p className="text-gray-700 leading-relaxed">
                {college.description}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Courses Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen size={20} className="text-blue-600" />
                </div>
                Available Courses
              </h2>
              <div className="grid gap-4">
                {college.courses?.map((course: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => (
                  <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-blue-600">
                    <CardContent className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-6">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{course.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="inline-flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md">
                            📚 {course.durationYears} Years Full-Time
                          </span>
                        </p>
                      </div>
                      <div className="text-right bg-blue-50 px-4 py-3 rounded-xl">
                        <p className="font-bold text-xl text-blue-900 flex items-center justify-end">
                          <IndianRupee size={18} />
                          {(course.totalFees / 100000).toFixed(2)}L
                        </p>
                        <p className="text-xs text-blue-700">Total Fees</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Cutoffs Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Trophy size={20} className="text-purple-600" />
                </div>
                Past Year Cutoffs
              </h2>
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <th className="px-6 py-4 text-left font-semibold text-gray-900">Exam</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-900">Category</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-900">Closing Rank</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-900">Year</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {college.cutoffs?.map((cutoff: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => (
                        <tr key={cutoff.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">{cutoff.examName}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              {cutoff.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 font-bold text-blue-600">
                              🎯 {cutoff.closingRank.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{cutoff.year}</td>
                        </tr>
                      ))}
                      {(!college.cutoffs || college.cutoffs.length === 0) && (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                            <div className="flex flex-col items-center gap-2">
                              <Trophy className="text-gray-300" size={48} />
                              <p>No cutoff data available</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </section>

          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            {/* Placement Card */}
            <Card className="border-t-4 border-t-emerald-500 shadow-lg">
              <CardHeader className="bg-gradient-to-br from-emerald-50 to-white">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">🏢</span>
                  Placement Highlights
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-900 font-semibold text-lg leading-relaxed">
                  {college.placements || "Placement data will be updated soon"}
                </p>
              </CardContent>
            </Card>

            {/* Key Info Card */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
                <h3 className="font-bold text-gray-900">Key Information</h3>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Annual Fees</p>
                    <p className="font-bold text-lg text-gray-900 flex items-center">
                      <IndianRupee size={18} />
                      {(college.baseFees / 100000).toFixed(2)} Lakhs
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <IndianRupee size={20} className="text-blue-600" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Established</p>
                    <p className="font-bold text-lg text-gray-900">
                      {college.establishedYear || "N/A"}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-xl">
                    📅
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Location</p>
                    <p className="font-bold text-lg text-gray-900">{college.location}</p>
                  </div>
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <MapPin size={20} className="text-pink-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
