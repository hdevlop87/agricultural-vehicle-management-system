import React from 'react';
import { Play, Square, MapPin } from 'lucide-react';
import { useCompleteOperation, useStartOperation } from '@/features/Operations/hooks/useOperations';
import { useUpdateLocation } from '@/features/Trackers/hooks/useUpdateLocation';
import { useRoleGuard } from '@/hooks/useRoleGuard';


export const OperationActions = ({ operation }) => {
  const operationId = operation?.id;
  const status = operation?.status;
  const { user, isOperator } = useRoleGuard();

  const startOperation = useStartOperation();
  const completeOperation = useCompleteOperation();

  const deviceId = operation?.tracker?.deviceId;
  const refreshInterval = operation?.tracker?.refreshInterval;
  const operatorUserId = operation?.operator?.userId;

  const isAssignedOperator = user?.id === operatorUserId;
  const canTrackLocation = isOperator() && isAssignedOperator && deviceId;

  const locationTracker = useUpdateLocation({
    deviceId: canTrackLocation ? deviceId : null,
    interval: refreshInterval
  });

  const onStart = () => {
    console.log(operation);
    
    if (operationId) {
      if (canTrackLocation) {
        locationTracker.startTracking();
      }
     startOperation.mutate({ operationId });
    }
  };

  const onComplete = () => {
    if (operationId) {
      if (canTrackLocation && locationTracker.isTracking) {
        locationTracker.stopTracking();
      }
      completeOperation.mutate({ operationId });
    }
  };

  const isStartLoading = startOperation.isLoading;
  const isCompleteLoading = completeOperation.isLoading;
  const anyActionLoading = isStartLoading || isCompleteLoading;

  if (status === 'planned') {
    return (
      <button
        onClick={onStart}
        disabled={anyActionLoading}
        className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-300 disabled:to-green-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {isStartLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <Play size={18} fill="currentColor" />
        )}
        {isStartLoading ? 'Starting Operation...' : 'Start Operation'}
      </button>
    );
  }

  if (status === 'active') {
    return (
      <div className="space-y-3">
        {/* Location tracking status */}
        {deviceId && (
          <div className="flex flex-col items-center gap-1 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className={`h-4 w-4 ${locationTracker.isTracking ? 'text-green-500 animate-pulse' : 'text-gray-400'}`} />
              <span>
                {canTrackLocation
                  ? (locationTracker.isTracking ? 'Location tracking active' : 'Location tracking inactive')
                  : 'Location tracking unavailable'
                }
              </span>
              {locationTracker.isError && (
                <span className="text-red-500 text-xs">(Error)</span>
              )}
            </div>
            {!canTrackLocation && (
              <div className="text-xs text-amber-600 text-center">
                {!isOperator()
                  ? 'Only operators can track location'
                  : !isAssignedOperator
                  ? 'Only the assigned operator can track location'
                  : 'No tracker device available'
                }
              </div>
            )}
          </div>
        )}

        {/* Complete operation button */}
        <button
          onClick={onComplete}
          disabled={anyActionLoading}
          className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-300 text-white rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isCompleteLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Square size={18} fill="currentColor" />
          )}
          {isCompleteLoading ? 'Completing...' : 'Complete Operation'}
        </button>
      </div>
    );
  }

  return null;
};