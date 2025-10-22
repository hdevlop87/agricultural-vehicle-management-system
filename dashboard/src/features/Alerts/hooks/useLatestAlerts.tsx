'use client';

import { useQuery } from '@tanstack/react-query';
import { getRecentAlertsApi } from '@/services/alertApi';

export const useLatestAlerts = (limit = 4) => {
  return useQuery({
    queryKey: ['latestAlerts', limit],
    queryFn: () => getRecentAlertsApi(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (response) => response?.data,
  });
};