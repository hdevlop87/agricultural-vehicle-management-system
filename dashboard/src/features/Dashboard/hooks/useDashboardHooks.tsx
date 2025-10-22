'use client'

import { useQuery } from '@tanstack/react-query';
import { getWidgetsApi } from '@/services/dashboardApi';
import { getRecentCompletedOperationsApi, getTopOperatorsApi } from '@/services/operationApi';

export const useDashboardWidgets = (enabled = true) => {
  const query = useQuery({
    queryKey: ['dashboard', 'widgets'],
    queryFn: getWidgetsApi,
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });

  return {
    widgets: query.data?.data || {
      totalFields: 0,
      activeVehicles: 0,
      operationsToday: 0,
      totalOperators: 0,
    },
    widgetsLoading: query.isPending,
    hasError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useRecentCompletedOperations = (limit = 5) => {
  return useQuery({
    queryKey: ['recentCompletedOperations'],
    queryFn: () => getRecentCompletedOperationsApi(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (response) => response?.data,
  });
};

export const useTopOperator = () => {
  const { data: topOperators, isLoading: isTopOperatorsLoading } = useQuery({
    queryKey: ['topOperators'],
    queryFn: getTopOperatorsApi,
    select: (response) => response?.data,
  });

  return {
    topOperators,
    isTopOperatorsLoading,
  };
};