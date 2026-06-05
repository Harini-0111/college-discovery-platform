import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CollegeImage } from '@/components/features/CollegeImage';
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
    <Card className="group flex flex-col h-full bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <CollegeImage
          slug={college.slug}
          name={college.name}
          alt={`${college.name} campus`}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
          <Star size={16} className="text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-gray-900 text-sm">{college.rating.toFixed(1)}</span>
        </div>

        {college.placements && (
          <div className="absolute bottom-4 left-4 bg-emerald-600/90 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md backdrop-blur-sm max-w-[85%] truncate">
            {college.placements.split(',')[0]}
          </div>
        )}
      </div>

      <CardContent className="flex flex-col flex-1 p-5 space-y-4">
        <div className="space-y-2 min-h-[56px]">
          <h3
            className="text-lg font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors"
            title={college.name}
          >
            {college.name}
          </h3>
          <div className="flex items-center gap-1.5 text-gray-600">
            <MapPin size={14} className="flex-shrink-0 text-gray-400" />
            <span className="text-sm line-clamp-1">{college.location}</span>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        <div className="flex-1">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50/60 transition-colors">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <IndianRupee size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Annual Fees</p>
              <p className="font-bold text-gray-900">₹{(college.baseFees / 100000).toFixed(2)}L</p>
            </div>
          </div>
        </div>

        <Link href={`/colleges/${college.id}`} className="block w-full">
          <Button variant="primary" className="w-full">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
