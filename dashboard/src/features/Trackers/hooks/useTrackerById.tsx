'use client'
import { useQuery } from '@tanstack/react-query';
import * as trackerApi from '@/services/trackerApi';

export const useTrackerById = (trackerId: string, enabled = true) => {
  const {
    data: tracker,
    isLoading: isTrackerLoading,
    isError,
    error: trackerError,
    refetch: refetchTracker,
  } = useQuery({
    queryKey: ['tracker', trackerId],
    queryFn: () => trackerApi.getTrackerByIdApi(trackerId),
    enabled: enabled && !!trackerId,
    staleTime: 5 * 60 * 1000, 
        select: (response) => response?.data,
    refetchOnWindowFocus: false,
  });

  return {
    tracker,
    isTrackerLoading,
    isError,
    trackerError,
    refetchTracker,
  };
};