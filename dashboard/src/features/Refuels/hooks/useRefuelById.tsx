"use client";

import { useQuery } from '@tanstack/react-query';
import * as refuelApi from '@/services/refuelApi';

export const useRefuelById = (refuelId: string) => {
  const {
    data: refuel,
    isLoading: isRefuelLoading,
    error: refuelError,
    refetch: refetchRefuel,
    isSuccess: isRefuelSuccess,
    isError: isRefuelError,
  } = useQuery({
    queryKey: ['refuel', refuelId],
    queryFn: () => refuelApi.getRefuelRecordByIdApi(refuelId),
    enabled: !!refuelId,
    staleTime: 5 * 60 * 1000,
    select: (response) => response?.data,
    refetchOnWindowFocus: false,
  });

  return {
    refuel,
    isRefuelLoading,
    refuelError,
    refetchRefuel,
    isRefuelSuccess,
    isRefuelError,
  };
};