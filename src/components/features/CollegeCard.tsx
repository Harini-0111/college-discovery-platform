import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Star, IndianRupee } from 'lucide-react';

interface College {
  id: string;
  name: string;
  slug: string;
  location: string;
  baseFees: number;
  rating: number;
  placements: string | null;
}

export const CollegeCard = ({ college }: { college: College }) => {
  return (
    <Card className="group flex flex-col h-full bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer">
      {/* Header Image with Gradient Overlay */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-pink-600/90 group-hover:opacity-95 transition-opacity duration-500"></div>
        
        {/* College initial */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/20 text-9xl font-black select-none group-hover:scale-110 transition-transform duration-500">
            {college.name.charAt(0)}
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Star size={16} className="text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-gray-900">{college.rating.toFixed(1)}</span>
        </div>

        {/* Placement Badge (if available) */}
        {college.placements && (
          <div className="absolute bottom-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
            ⭐ {college.placements.split(',')[0]}
          </div>
        )}
      </div>

      <CardContent className="flex flex-col flex-1 p-6 space-y-4">
        {/* College Name & Location */}
        <div className="space-y-2 min-h-[60px]">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors duration-300" title={college.name}>
            {college.name}
          </h3>
          <div className="flex items-center gap-1.5 text-gray-600">
            <MapPin size={14} className="flex-shrink-0 text-gray-400" />
            <span className="text-xs sm:text-sm line-clamp-1">{college.location}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

        {/* Info Grid */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors duration-300">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <IndianRupee size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Annual Fees</p>
                <p className="font-bold text-gray-900">₹{(college.baseFees / 100000).toFixed(2)}L</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Link href={`/colleges/${college.id}`} className="block w-full">
          <Button 
            variant="outline" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
          >
            <span className="font-semibold">View Details</span>
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
