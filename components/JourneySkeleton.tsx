import React from 'react';

export const JourneySkeleton = () => {
  return (
    <div className="p-6 space-y-8 relative animate-pulse">
      {/* Vertical Line Skeleton */}
      <div className="absolute left-9 top-10 bottom-10 w-0.5 bg-slate-800" />

      {[1, 2, 3].map((i) => (
        <div key={i} className="relative pl-12">
          {/* Dot Skeleton */}
          <div className="absolute left-0 top-6 w-6 h-6 rounded-full bg-slate-800 border-4 border-slate-900 z-10" />

          {/* Card Skeleton */}
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
            <div className="flex justify-between items-start mb-4">
              <div className="h-3 w-24 bg-slate-700 rounded mb-2" />
              <div className="h-5 w-5 bg-slate-700 rounded-full" />
            </div>
            <div className="h-6 w-3/4 bg-slate-700 rounded mb-3" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-700/50 rounded" />
              <div className="h-4 w-5/6 bg-slate-700/50 rounded" />
              <div className="h-4 w-4/6 bg-slate-700/50 rounded" />
            </div>
            <div className="flex space-x-3 mt-6">
              <div className="h-10 flex-1 bg-slate-700 rounded-lg" />
              <div className="h-10 flex-1 bg-slate-700 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
