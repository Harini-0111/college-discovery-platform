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
    <Card className="flex flex-col h-full bg-white rounded-2xl border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative group-hover:scale-[1.02] transition-transform duration-300">
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-sm font-bold shadow-sm">
          <Star size={16} className="text-yellow-500 fill-yellow-500" />
          {college.rating.toFixed(1)}
        </div>
      </div>
      <CardContent className="flex flex-col flex-1 gap-5 p-6 z-10 bg-white">
        <div>
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2" title={college.name}>
            {college.name}
          </h3>
          <p className="text-gray-500 flex items-center gap-1 mt-1 text-sm">
            <MapPin size={16} />
            {college.location}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mt-auto">
          <div>
            <p className="text-gray-500 mb-1">Base Fees</p>
            <p className="font-semibold flex items-center">
              <IndianRupee size={14} />
              {(college.baseFees / 100000).toFixed(2)}L
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Placements</p>
            <p className="font-semibold line-clamp-1" title={college.placements || 'N/A'}>
              {college.placements ? college.placements.split(',')[0] : 'N/A'}
            </p>
          </div>
        </div>

        <Link href={`/colleges/${college.id}`} className="mt-4 block w-full">
          <Button variant="outline" className="w-full text-blue-600 border-blue-600 hover:bg-blue-50">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
