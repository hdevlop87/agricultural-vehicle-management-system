"use client";

import { useQuery } from '@tanstack/react-query';
import { getAlertByIdApi } from '@/services/alertApi';

export const useAlertById = (alertId: string) => {
  const {
    data: alert,
    isLoading: isAlertLoading,
    error: alertError,
    refetch: refetchAlert
  } = useQuery({
    queryKey: ['alert', alertId],
    queryFn: () => getAlertByIdApi(alertId),
    enabled: !!alertId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    select: (response) => response?.data,
  });

  return {
    alert,
    isAlertLoading,
    alertError,
    refetchAlert
  };
};