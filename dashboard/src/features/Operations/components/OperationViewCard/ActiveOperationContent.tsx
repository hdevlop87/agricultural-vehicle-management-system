import React from 'react';
import { Timer, Activity, Gauge } from 'lucide-react';
import { OperationProgress } from './OperationProgress';
import { MetricCard } from './MetricCard';
import { WeatherIcon } from './WeatherIcon';
import { calculateProgress } from './operationUtils';
import { formatDuration } from '@/lib/utils';

export const ActiveOperationContent = ({ operation }) => {
  const progress = calculateProgress(operation.startTime, operation.endTime);

  return (
    <>
      <OperationProgress 
        progress={progress}
        startTime={operation.startTime}
        endTime={operation.endTime}
      />

      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={<Timer className="w-4 h-4 text-blue-500" />}
          label="Duration"
          value={formatDuration(operation.startTime, operation.endTime)}
        />

        <MetricCard
          icon={<Activity className="w-4 h-4 text-green-500" />}
          label="Area"
          value={operation.areaCovered ? `${operation.areaCovered} ha` : '--'}
        />

        <MetricCard
          icon={<Gauge className="w-4 h-4 text-purple-500" />}
          label="Mileage"
          value={operation.startMileage ? `${operation.startMileage} km` : '--'}
        />

        <MetricCard
          icon={<WeatherIcon weather={operation.weather} />}
          label="Weather"
          value={operation.weather || 'N/A'}
          className="text-xs"
        />
      </div>
    </>
  );
};
