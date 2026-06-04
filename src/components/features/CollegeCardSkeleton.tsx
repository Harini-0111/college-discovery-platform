import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';

export const CollegeCardSkeleton = () => {
  return (
    <Card className="flex flex-col h-full animate-pulse border-gray-100 shadow-sm">
      <div className="h-48 bg-gray-200"></div>
      <CardContent className="flex flex-col flex-1 gap-4 p-6">
        <div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div>
            <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div>
            <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>

        <div className="mt-4 w-full h-10 bg-gray-200 rounded-lg"></div>
      </CardContent>
    </Card>
  );
};
