import React from 'react';
import { Clock, Timer, Activity } from 'lucide-react';
import { WeatherIcon } from './WeatherIcon';
import { Card } from '@/components/ui/card';
import { OperationNotes } from './OperationNotes';
import { formatDuration, formatTime } from '@/lib/utils';


export const PlannedOperationContent = ({ operation }) => {

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex justify-center items-center flex-col bg-gradient-to-br rounded-lg p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-300" />
            <span className="text-xs font-semibold text-blue-400 uppercase">Start Time</span>
          </div>
          <div className="font-bold text-xl text-blue-300">
            {formatTime(operation.startTime)}
          </div>
        </div>

        <div className="flex justify-center items-center flex-col bg-gradient-to-br  rounded-lg p-4 border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <Timer className="w-5 h-5 text-purple-500" />
            <span className="text-xs font-semibold text-purple-400 uppercase">Duration</span>
          </div>
          <div className="font-bold text-xl text-purple-300">
            {formatDuration(operation.startTime, operation.endTime)}
          </div>
        </div>

        <div className="flex justify-center items-center flex-col col-span-2 bg-gradient-to-br  rounded-lg p-4 border border-green-100 ">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-green-500" />
            <span className="text-xs font-semibold text-green-400 uppercase">Target Area</span>
          </div>
          <div className="font-bold text-xl text-green-300">
            {operation.field?.area || operation.areaCovered || '--'} ha
          </div>
        </div>
      </div>

      {operation.weather && (
        <Card className="flex items-center justify-center gap-2 text-sm text-foreground border  border-blue-100 rounded-lg p-3">
          <WeatherIcon weather={operation.weather} />
          <span>Expected weather: <strong>{operation.weather}</strong></span>
        </Card>
      )}

      <OperationNotes operation={operation} />
    </>
  );
};
