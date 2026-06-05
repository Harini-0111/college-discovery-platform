import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';

export const CollegeCardSkeleton = () => {
  return (
    <Card className="flex flex-col h-full border border-gray-200 shadow-sm overflow-hidden">
      {/* Shimmer effect container */}
      <div className="relative overflow-hidden">
        {/* Header skeleton with shimmer */}
        <div className="h-48 bg-gray-200 relative">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
          <div className="absolute top-4 right-4 w-16 h-7 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      <CardContent className="flex flex-col flex-1 p-6 space-y-4">
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded-lg w-3/4 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded-lg w-1/2 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200"></div>

        {/* Info box skeleton */}
        <div className="flex-1">
          <div className="h-20 bg-gray-100 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
          </div>
        </div>

        {/* Button skeleton */}
        <div className="h-11 bg-gray-200 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
        </div>
      </CardContent>
    </Card>
  );
};
