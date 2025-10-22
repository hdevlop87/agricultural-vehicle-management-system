"use client";

import { useQuery } from '@tanstack/react-query';
import { getMaintenanceByIdApi } from '@/services/maintenanceApi';

export const useMaintenanceById = (maintenanceId: string) => {
  const {
    data: maintenance,
    isLoading: isMaintenanceLoading,
    error: maintenanceError,
    refetch: refetchMaintenance
  } = useQuery({
    queryKey: ['maintenance', maintenanceId],
    queryFn: () => getMaintenanceByIdApi(maintenanceId),
    enabled: !!maintenanceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    select: (response) => response?.data,
  });
 
  return {
    maintenance,
    isMaintenanceLoading,
    maintenanceError,
    refetchMaintenance
  };
};