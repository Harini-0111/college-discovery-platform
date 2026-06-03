"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { MapPin, Star, IndianRupee, BookOpen, Trophy, Loader2 } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="w-32 h-32 bg-blue-100 rounded-xl flex-shrink-0 flex items-center justify-center text-blue-600 font-bold text-4xl">
          {college.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{college.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1"><MapPin size={16} /> {college.location}</span>
            <span className="flex items-center gap-1 text-yellow-600 font-medium"><Star size={16} className="fill-yellow-500" /> {college.rating.toFixed(1)} Rating</span>
          </div>
          <p className="text-gray-600 max-w-3xl leading-relaxed">
            {college.description || `Established as a premier institution in ${college.location}, offering excellent academic programs and industry-leading placements.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Courses Section */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-blue-600" />
              Available Courses
            </h2>
            <div className="grid gap-4">
              {college.courses?.map((course: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => (
                <Card key={course.id}>
                  <CardContent className="flex justify-between items-center py-4">
                    <div>
                      <h3 className="font-bold text-gray-900">{course.name}</h3>
                      <p className="text-sm text-gray-500">{course.durationYears} Years Full-Time</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 flex items-center justify-end">
                        <IndianRupee size={16} />
                        {(course.totalFees / 100000).toFixed(2)}L
                      </p>
                      <p className="text-xs text-gray-500">Total Fees</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Cutoffs Section */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy size={20} className="text-blue-600" />
              Past Year Cutoffs
            </h2>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="px-4 py-3 font-medium">Exam Name</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Closing Rank</th>
                      <th className="px-4 py-3 font-medium">Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {college.cutoffs?.map((cutoff: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => (
                      <tr key={cutoff.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{cutoff.examName}</td>
                        <td className="px-4 py-3 text-gray-600">{cutoff.category}</td>
                        <td className="px-4 py-3 text-blue-600 font-semibold">{cutoff.closingRank}</td>
                        <td className="px-4 py-3 text-gray-500">{cutoff.year}</td>
                      </tr>
                    ))}
                    {(!college.cutoffs || college.cutoffs.length === 0) && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No cutoff data available.</td>
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
          <Card>
            <CardHeader>
              <h3 className="font-bold text-gray-900">Placement Highlights</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-lg font-medium bg-blue-50 text-blue-800 p-3 rounded-lg border border-blue-100">
                {college.placements || "Data not available"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-bold text-gray-900">Key Information</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Base Fees</p>
                <p className="font-medium flex items-center">
                  <IndianRupee size={16} />
                  {(college.baseFees / 100000).toFixed(2)} Lakhs / Year
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Established</p>
                <p className="font-medium">{college.establishedYear || "Unknown"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
