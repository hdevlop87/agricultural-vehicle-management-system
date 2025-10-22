import { formatTime } from '@/lib/utils';
import React from 'react';

export const OperationProgress = ({ 
  progress, 
  startTime, 
  endTime 
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-muted-foreground">Operation Progress</span>
        <span className="text-lg font-bold text-green-400">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-500 rounded-full h-4 overflow-hidden shadow-inner">
        <div
          className="h-4 rounded-full  bg-green-400 relative"
          style={{ width: `${progress}%` }}
        >
  
        </div>
      </div>
      <div className="flex justify-between text-xs text-foreground">
        <span>Started: {formatTime(startTime)}</span>
        <span>Est. completion: {formatTime(endTime)}</span>
      </div>
    </div>
  );
};
